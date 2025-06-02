/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Snackbar,
} from "@mui/material";
import React, { useEffect, useState, useCallback } from "react";
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
  AssignButton,
  BodyTableCell,
  CustomerName,
  CustomerPhone,
  EmptyMessage,
  HeaderTableCell,
  LoadingContainer,
  PageTitle,
  StatusChip,
  StyledTableContainer,
  StyledTableRow,
} from "../../../components/manager/styles/UnassignedPickupsStyles";
import { formatDate } from "../../../utils/formatters";

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

// Helper function to group equipment items by name and count quantities
const groupEquipmentItems = (items: any[]) => {
  const grouped: { [key: string]: number } = {};

  items.forEach((item) => {
    if (grouped[item.name]) {
      grouped[item.name] += 1;
    } else {
      grouped[item.name] = 1;
    }
  });

  return Object.entries(grouped).map(([name, quantity]) => ({
    name,
    quantity,
  }));
};

const UnassignedPickups: React.FC = () => {
  const [pickups, setPickups] =
    useState<PagedResult<RentOrderDetailResponse> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedPickup, setSelectedPickup] =
    useState<RentOrderDetailResponse | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  // Success/Error notification states
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchPickups = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getUnassignedPickups(page + 1, rowsPerPage);
      setPickups(response.data as PagedResult<RentOrderDetailResponse>);
    } catch (err) {
      console.error("Error fetching pickups:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch pickups");
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchPickups();
  }, [fetchPickups]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleAssignClick = (pickup: RentOrderDetailResponse) => {
    setSelectedPickup(pickup);
    setAssignDialogOpen(true);
    // Clear any previous error messages
    setError(null);
  };

  const handleAssignSuccess = (staffName: string, customerName: string) => {
    // Close dialog first
    setAssignDialogOpen(false);
    setSelectedPickup(null);

    // Show success message
    setSuccessMessage(
      `Đã phân công thành công nhân viên ${staffName} cho khách hàng ${customerName}`
    );
    setShowSuccess(true);

    // Refresh the data
    fetchPickups();
  };

  const handleDialogClose = () => {
    setAssignDialogOpen(false);
    setSelectedPickup(null);
  };

  const handleCloseSuccessSnackbar = () => {
    setShowSuccess(false);
    setSuccessMessage(null);
  };

  const isTableEmpty = !pickups?.items || pickups.items.length === 0;

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
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        <StyledPaper elevation={0}>
          {loading ? (
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
                    {isTableEmpty ? (
                      <StyledTableRow key="empty-row">
                        <BodyTableCell colSpan={6}>
                          <EmptyMessage>
                            Không tìm thấy đơn hàng chưa được phân công
                          </EmptyMessage>
                        </BodyTableCell>
                      </StyledTableRow>
                    ) : (
                      pickups.items.map((pickup) => {
                        // Group equipment items by name
                        const groupedItems = groupEquipmentItems(
                          pickup.equipmentItems
                        );

                        return (
                          <StyledTableRow key={pickup.orderId}>
                            <BodyTableCell>{pickup.orderCode}</BodyTableCell>
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
                                {groupedItems
                                  .slice(0, 2)
                                  .map((item: any, index: any) => (
                                    <Tooltip
                                      key={index}
                                      title={`${item.name} (${item.quantity} cái)`}
                                    >
                                      <Chip
                                        label={`${item.name} x ${item.quantity}`}
                                        size="small"
                                        variant="outlined"
                                      />
                                    </Tooltip>
                                  ))}
                                {groupedItems.length > 2 && (
                                  <Tooltip
                                    title={groupedItems
                                      .slice(2)
                                      .map(
                                        (item) =>
                                          `${item.name} x ${item.quantity}`
                                      )
                                      .join(", ")}
                                  >
                                    <Chip
                                      label={`+${groupedItems.length - 2} more`}
                                      size="small"
                                      variant="outlined"
                                      color="primary"
                                    />
                                  </Tooltip>
                                )}
                              </Stack>
                            </BodyTableCell>

                            <BodyTableCell>
                              {formatDate(pickup.expectedReturnDate)}
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
                                disabled={loading}
                              >
                                Phân công
                              </AssignButton>
                            </BodyTableCell>
                          </StyledTableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </StyledTableContainer>

              {!isTableEmpty && (
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={pickups?.totalCount || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số dòng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) =>
                      `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
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
              )}
            </>
          )}
        </StyledPaper>

        {/* Assignment Dialog */}
        {selectedPickup && (
          <AssignStaffDialog
            open={assignDialogOpen}
            onClose={handleDialogClose}
            pickup={selectedPickup}
            onSuccess={handleAssignSuccess}
          />
        )}

        {/* Success Notification */}
        <Snackbar
          open={showSuccess}
          autoHideDuration={6000}
          onClose={handleCloseSuccessSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSuccessSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </StyledContainer>
  );
};

export default UnassignedPickups;
