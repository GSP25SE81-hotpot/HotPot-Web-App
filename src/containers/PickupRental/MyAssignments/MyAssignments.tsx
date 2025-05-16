import {
  Box,
  FormControlLabel,
  Switch,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { rentalService } from "../../../api/Services/pickupService";
import ErrorAlert from "../../../components/errorAlert/ErrorAlert";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import {
  ActionButtonsContainer,
  AnimatedButton,
  AssignmentChip,
  CardDescription,
  CustomerCell,
  CustomerName,
  CustomerPhone,
  EmptyStateContainer,
  FilterContainer,
  StatusContainer,
  StyledTable,
  StyledTableContainer,
  StyledTablePagination,
} from "../../../components/StyledComponents";
import { useApi } from "../../../hooks/useApi";
import { StaffPickupAssignment } from "../../../types/rentalPickup";
import { formatDate } from "../../../utils/formatters";

const MyAssignments: React.FC = () => {
  const navigate = useNavigate();
  const [pendingOnly, setPendingOnly] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, loading, error, execute } = useApi(
    rentalService.getMyAssignments
  );

  useEffect(() => {
    execute(pendingOnly, page + 1, rowsPerPage);
  }, [execute, pendingOnly, page, rowsPerPage]);

  const handleTogglePending = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPendingOnly(event.target.checked);
    setPage(0); // Reset to first page when filter changes
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetail = (id: number) => {
    navigate(`/rentals/${id}`);
  };

  const handleRecordReturn = (assignment: StaffPickupAssignment) => {
    navigate("/rentals/record-return", {
      state: {
        assignmentId: assignment.assignmentId,
        rentOrderId: assignment.orderId,
        customerName: assignment.customerName,
        equipmentName: assignment.equipmentSummary,
        expectedReturnDate: assignment.expectedReturnDate,
      },
    });
  };

  // Check if data and data.data exist before accessing
  const assignments = data?.data.items || [];
  const hasAssignments = assignments.length > 0;

  useEffect(() => {
    console.log("Fetching assignments with params:", {
      pendingOnly,
      page,
      rowsPerPage,
    });
    execute(pendingOnly, page + 1, rowsPerPage)
      .then((response) => {
        console.log("API Response:", response);
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  }, [execute, pendingOnly, page, rowsPerPage]);

  return (
    <Box>
      <FilterContainer>
        <FormControlLabel
          control={
            <Switch
              checked={pendingOnly}
              onChange={handleTogglePending}
              color="primary"
            />
          }
          label="Chỉ hiển thị lấy hàng đang chờ xử lý"
        />
      </FilterContainer>

      {loading && <LoadingSpinner />}
      {error && <ErrorAlert message={error} />}

      {!loading && !error && (
        <>
          {!hasAssignments ? (
            <EmptyStateContainer>
              <Typography variant="h6" fontWeight={600}>
                Không tìm thấy nhiệm vụ nào
              </Typography>
              <CardDescription>
                {pendingOnly
                  ? "Bạn không có nhiệm vụ lấy hàng đang chờ xử lý nào được giao."
                  : "Bạn chưa có nhiệm vụ nào."}
              </CardDescription>
              <AnimatedButton
                variant="outlined"
                color="primary"
                onClick={() => setPendingOnly(!pendingOnly)}
              >
                {pendingOnly ? "Xem tất cả nhiệm vụ" : "Chỉ xem đang chờ xử lý"}
              </AnimatedButton>
            </EmptyStateContainer>
          ) : (
            <>
              <StyledTableContainer>
                <StyledTable>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mã nhiệm vụ</TableCell>
                      <TableCell>Mã đơn hàng</TableCell>
                      <TableCell>Khách hàng</TableCell>
                      <TableCell>Thiết bị</TableCell>
                      <TableCell>Ngày trả dự kiến</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Hành động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.assignmentId}>
                        <TableCell>#{assignment.assignmentId}</TableCell>
                        <TableCell>{assignment.orderCode}</TableCell>
                        <TableCell>
                          <CustomerCell>
                            <CustomerName>
                              {assignment.customerName}
                            </CustomerName>
                            <CustomerPhone>
                              {assignment.customerPhone}
                            </CustomerPhone>
                          </CustomerCell>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={500}>
                            {assignment.equipmentSummary}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={500}>
                            {assignment.expectedReturnDate
                              ? formatDate(assignment.expectedReturnDate)
                              : "N/A"}{" "}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <StatusContainer>
                            <AssignmentChip
                              label={
                                assignment.completedDate
                                  ? "Hoàn thành"
                                  : "Đang chờ"
                              }
                              status={
                                assignment.completedDate
                                  ? "completed"
                                  : "pending"
                              }
                              size="small"
                            />
                          </StatusContainer>
                        </TableCell>
                        <TableCell>
                          <ActionButtonsContainer>
                            <AnimatedButton
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                handleViewDetail(assignment.orderId)
                              }
                              sx={{ minWidth: "80px" }}
                            >
                              Xem
                            </AnimatedButton>
                            {!assignment.completedDate && (
                              <AnimatedButton
                                variant="contained"
                                size="small"
                                color="primary"
                                onClick={() => handleRecordReturn(assignment)}
                                sx={{ minWidth: "120px" }}
                              >
                                Ghi nhận trả
                              </AnimatedButton>
                            )}
                          </ActionButtonsContainer>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </StyledTable>
              </StyledTableContainer>

              <StyledTablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={data?.data?.totalCount || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Số hàng mỗi trang:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} của ${count}`
                }
              />
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default MyAssignments;
