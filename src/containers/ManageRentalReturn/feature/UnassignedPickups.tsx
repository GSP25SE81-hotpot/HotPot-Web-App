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
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";
import { format } from "date-fns";
import { getUnassignedPickups } from "../../../api/Services/rentalService";
import {
  PagedResult,
  RentOrderDetailResponse,
} from "../../../types/rentalTypes";
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

const translateStatus = (status: string): string => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Chờ xử lý";
    case "assigned":
      return "Đã phân công";
    case "in progress":
      return "Đang xử lý";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

const UnassignedPickups: React.FC = () => {
  const [pickups, setPickups] =
    useState<PagedResult<RentOrderDetailResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  // Changed default rowsPerPage to match one of the options in rowsPerPageOptions
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPickup, setSelectedPickup] =
    useState<RentOrderDetailResponse | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const fetchPickups = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUnassignedPickups(page + 1, rowsPerPage);
      setPickups(data.data as PagedResult<RentOrderDetailResponse>);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching pickups"
      );
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

  const handleAssignClick = (pickup: RentOrderDetailResponse) => {
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
        <PageTitle variant="h4">Phân công thu hồi</PageTitle>
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
                      <HeaderTableCell>Mã đơn</HeaderTableCell>
                      <HeaderTableCell>Tên Khách hàng</HeaderTableCell>
                      <HeaderTableCell>Thiết bị</HeaderTableCell>
                      <HeaderTableCell>Ngày trả</HeaderTableCell>
                      <HeaderTableCell>Trạng thái</HeaderTableCell>
                      <HeaderTableCell>Hành động</HeaderTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pickups?.items.length === 0 ? (
                      <StyledTableRow key="empty-row">
                        <BodyTableCell colSpan={6}>
                          <EmptyMessage>
                            Không tìm thấy đơn hàng chưa được phân công
                          </EmptyMessage>
                        </BodyTableCell>
                      </StyledTableRow>
                    ) : (
                      pickups?.items.map((pickup) => (
                        <StyledTableRow key={pickup.orderId}>
                          <BodyTableCell>{pickup.orderId}</BodyTableCell>
                          <BodyTableCell>
                            <CustomerName variant="body2">
                              {pickup.customerName}
                            </CustomerName>
                            <CustomerPhone variant="caption">
                              {pickup.customerPhone}
                            </CustomerPhone>
                          </BodyTableCell>
                          <BodyTableCell>
                            <Stack direction="column" spacing={1}>
                              {pickup.equipmentItems.slice(0, 2).map((item) => (
                                <Tooltip
                                  key={item.detailId}
                                  title={`${item.type} - ID: ${item.id}`}
                                >
                                  <Chip
                                    label={item.name}
                                    size="small"
                                    variant="outlined"
                                  />
                                </Tooltip>
                              ))}
                              {pickup.equipmentItems.length > 2 && (
                                <Tooltip
                                  title={pickup.equipmentItems
                                    .slice(2)
                                    .map((item) => item.name)
                                    .join(", ")}
                                >
                                  <Chip
                                    label={`+${
                                      pickup.equipmentItems.length - 2
                                    } more`}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                  />
                                </Tooltip>
                              )}
                            </Stack>
                          </BodyTableCell>
                          <BodyTableCell>
                            {format(
                              new Date(pickup.expectedReturnDate),
                              "MMM dd, yyyy"
                            )}
                          </BodyTableCell>
                          <BodyTableCell>
                            <StatusChip
                              label={translateStatus(pickup.status)}
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
                              Phân công
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

export default UnassignedPickups;
