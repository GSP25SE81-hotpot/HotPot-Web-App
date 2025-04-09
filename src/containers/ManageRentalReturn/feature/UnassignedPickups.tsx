/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
  Alert,
} from "@mui/material";
import { format } from "date-fns";
import { getUnassignedPickups } from "../../../api/Services/rentalService";
import { PagedResult, RentOrderDetail } from "../../../types/rentalTypes";
import AssignStaffDialog from "../dialog/AssignStaffDialog";
// Import styled components
import {
  StyledContainer,
  StyledPaper,
} from "../../../components/StyledComponents";
// Import unassigned pickups specific styled components
import {
  PageTitle,
  StyledTableContainer,
  HeaderTableCell,
  BodyTableCell,
  StyledTableRow,
  CustomerName,
  CustomerPhone,
  StatusChip,
  AssignButton,
  EmptyMessage,
  LoadingContainer,
} from "../../../components/manager/styles/UnassignedPickupsStyles";

const UnassignedPickups: React.FC = () => {
  const [pickups, setPickups] = useState<PagedResult<RentOrderDetail[]> | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPickup, setSelectedPickup] = useState<RentOrderDetail | null>(
    null
  );
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const fetchPickups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUnassignedPickups(page + 1, rowsPerPage);
      // Check if the API call was successful and data exists
      if (response.success && response.data) {
        // Extract just the PagedResult part from the ApiResponse
        setPickups(response.data);
      } else {
        // Handle the case where the API call was successful but no data was returned
        setError(response.message || "Không có dữ liệu trả về từ máy chủ");
        setPickups(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi tải danh sách lấy hàng"
      );
      setPickups(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, [page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAssignClick = (pickup: RentOrderDetail) => {
    setSelectedPickup(pickup);
    setAssignDialogOpen(true);
  };

  const handleAssignSuccess = () => {
    fetchPickups();
    setAssignDialogOpen(false);
    setSelectedPickup(null);
  };

  return (
    <StyledContainer maxWidth="xl">
      <Box sx={{ p: 3 }}>
        <PageTitle variant="h4">Danh sách lấy hàng chưa phân công</PageTitle>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              "& .MuiAlert-icon": {
                alignItems: "center",
              },
            }}
          >
            {error}
          </Alert>
        )}
        <StyledPaper elevation={0}>
          {loading && !pickups ? (
            <LoadingContainer>
              <CircularProgress />
            </LoadingContainer>
          ) : (
            <>
              <StyledTableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderTableCell>ID</HeaderTableCell>
                      <HeaderTableCell>Khách hàng</HeaderTableCell>
                      <HeaderTableCell>Thiết bị</HeaderTableCell>
                      <HeaderTableCell>Loại</HeaderTableCell>
                      <HeaderTableCell>Ngày trả</HeaderTableCell>
                      <HeaderTableCell>Trạng thái</HeaderTableCell>
                      <HeaderTableCell>Thao tác</HeaderTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pickups?.items.length === 0 ? (
                      <StyledTableRow>
                        <BodyTableCell colSpan={7}>
                          <EmptyMessage>
                            Không tìm thấy lấy hàng nào chưa được phân công
                          </EmptyMessage>
                        </BodyTableCell>
                      </StyledTableRow>
                    ) : (
                      pickups?.items.map((pickup) => (
                        <StyledTableRow key={pickup.id}>
                          <BodyTableCell>{pickup.id}</BodyTableCell>
                          <BodyTableCell>
                            <CustomerName variant="body2">
                              {pickup.customerName}
                            </CustomerName>
                            <CustomerPhone variant="caption">
                              {pickup.customerPhone}
                            </CustomerPhone>
                          </BodyTableCell>
                          <BodyTableCell>{pickup.equipmentName}</BodyTableCell>
                          <BodyTableCell>{pickup.equipmentType}</BodyTableCell>
                          <BodyTableCell>
                            {format(
                              new Date(pickup.expectedReturnDate),
                              "dd/MM/yyyy"
                            )}
                          </BodyTableCell>
                          <BodyTableCell>
                            <StatusChip
                              label={getStatusTranslation(pickup.status)}
                              status={pickup.status.toLowerCase()}
                              size="small"
                            />
                          </BodyTableCell>
                          <BodyTableCell>
                            <AssignButton
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleAssignClick(pickup)}
                            >
                              Phân công nhân viên
                            </AssignButton>
                          </BodyTableCell>
                        </StyledTableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={pickups?.totalCount || 0}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Số hàng mỗi trang:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} của ${count}`
                  }
                  sx={{
                    borderRadius: 2,
                    "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                      {
                        fontWeight: 500,
                      },
                  }}
                />
              </Box>
            </>
          )}
        </StyledPaper>
        {selectedPickup && (
          <AssignStaffDialog
            open={assignDialogOpen}
            onClose={() => setAssignDialogOpen(false)}
            pickup={selectedPickup}
            onSuccess={handleAssignSuccess}
          />
        )}
      </Box>
    </StyledContainer>
  );
};

// Hàm trợ giúp để dịch trạng thái
const getStatusTranslation = (status: string): string => {
  const statusMap: Record<string, string> = {
    Active: "Đang hoạt động",
    Completed: "Hoàn thành",
    Overdue: "Quá hạn",
    Cancelled: "Đã hủy",
    Pending: "Đang chờ",
    // Thêm các trạng thái khác nếu cần
  };

  return statusMap[status] || status;
};

export default UnassignedPickups;
