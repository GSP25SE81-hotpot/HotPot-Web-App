/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/OrderManagement/components/PendingDeliveriesList.tsx
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Snackbar,
  Table,
  TableBody,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  alpha,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  DeliveryStatusUpdateRequest,
  PendingDeliveryDTO,
  ShippingOrderQueryParams,
  orderManagementService,
} from "../../../api/Services/orderManagementService";
import {
  ActionsContainer,
  CountBadge,
  CustomerName,
  CustomerPhone,
  DialogActionButton,
  EmptyStateContainer,
  EmptyStateSubtitle,
  EmptyStateTitle,
  IdCell,
  ListTitle,
  LoadingContainer,
  OrderTypeChip,
  OrdersListContainer,
  StyledHeaderCell,
  StyledPaper,
  StyledTableCell,
  StyledTableContainer,
  StyledTableRow,
} from "../../../components/manager/styles/PendingDeliveriesListStyles"; // You'll need to create this
import { formatDate } from "../../../utils/formatters";

const PendingDeliveriesList: React.FC = () => {
  const [deliveries, setDeliveries] = useState<PendingDeliveryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDelivery, setSelectedDelivery] =
    useState<PendingDeliveryDTO | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  // Sorting state
  const [sortBy, setSortBy] = useState<string>("deliverytime");
  const [sortDescending, setSortDescending] = useState(true);
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDeliveries();
  }, [pageNumber, pageSize, sortBy, sortDescending]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      // Create query params
      const queryParams: ShippingOrderQueryParams = {
        pageNumber,
        pageSize,
        sortBy,
        sortDescending,
        searchTerm: searchTerm || undefined,
        isDelivered: false, // Only get pending deliveries
      };
      const response = await orderManagementService.getPendingDeliveries(
        queryParams
      );
      // Update state with paginated data
      setDeliveries(response.items);
      setTotalCount(response.totalCount);
      setError(null);
    } catch (err) {
      console.error("Error fetching pending deliveries:", err);
      setError(
        "Không thể tải danh sách giao hàng đang chờ. Vui lòng thử lại sau."
      );
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Apply search
  const applySearch = () => {
    setPageNumber(1); // Reset to first page when searching
    fetchDeliveries();
  };

  // Handle page change
  const handlePageChange = (_event: unknown, newPage: number) => {
    setPageNumber(newPage + 1); // MUI pagination is 0-based, our API is 1-based
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNumber(1);
  };

  // Handle sort change
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      // Toggle sort direction if clicking the same column
      setSortDescending(!sortDescending);
    } else {
      // Set new sort column and default to descending
      setSortBy(column);
      setSortDescending(true);
    }
  };

  // Handle mark as delivered click
  const handleMarkAsDeliveredClick = (delivery: PendingDeliveryDTO) => {
    setSelectedDelivery(delivery);
    setDeliveryNotes("");
    setOpenDialog(true);
  };

  // Handle confirm delivery
  const handleConfirmDelivery = async () => {
    if (!selectedDelivery) return;
    try {
      const request: DeliveryStatusUpdateRequest = {
        isDelivered: true,
        notes: deliveryNotes || undefined,
      };
      await orderManagementService.updateDeliveryStatus(
        selectedDelivery.shippingOrderId,
        request
      );
      // Show success message
      setSnackbar({
        open: true,
        message: `Đơn hàng #${selectedDelivery.orderId} đã được đánh dấu là đã giao thành công`,
        severity: "success",
      });
      // Close dialog and refresh list
      setOpenDialog(false);
      fetchDeliveries();
    } catch (err) {
      console.error("Error updating delivery status:", err);
      setSnackbar({
        open: true,
        message: "Không thể cập nhật trạng thái giao hàng. Vui lòng thử lại.",
        severity: "error",
      });
    }
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDelivery(null);
  };

  // Handle delivery notes change
  const handleDeliveryNotesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDeliveryNotes(event.target.value);
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && deliveries.length === 0) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <OrdersListContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <ListTitle variant="h6">
          Giao hàng đang chờ <CountBadge>{totalCount}</CountBadge>
        </ListTitle>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            placeholder="Tìm kiếm giao hàng..."
            size="small"
            value={searchTerm}
            onChange={handleSearch}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSearchTerm("");
                        applySearch();
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              },
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                applySearch();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchDeliveries}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Làm mới
          </Button>
        </Box>
      </Box>
      <StyledPaper>
        {deliveries.length === 0 ? (
          <EmptyStateContainer>
            <EmptyStateTitle variant="h6">
              Không tìm thấy giao hàng đang chờ
            </EmptyStateTitle>
            <EmptyStateSubtitle variant="body2">
              Tất cả đơn hàng đã được giao hoặc không có đơn hàng nào được phân
              công giao
            </EmptyStateSubtitle>
          </EmptyStateContainer>
        ) : (
          <>
            <StyledTableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledHeaderCell>Mã đơn hàng</StyledHeaderCell>
                    <StyledHeaderCell>
                      <TableSortLabel
                        active={sortBy === "customer"}
                        direction={sortDescending ? "desc" : "asc"}
                        onClick={() => handleSortChange("customer")}
                      >
                        Khách hàng
                      </TableSortLabel>
                    </StyledHeaderCell>
                    <StyledHeaderCell>
                      <TableSortLabel
                        active={sortBy === "deliverytime"}
                        direction={sortDescending ? "desc" : "asc"}
                        onClick={() => handleSortChange("deliverytime")}
                      >
                        Thời gian giao hàng
                      </TableSortLabel>
                    </StyledHeaderCell>
                    <StyledHeaderCell>Địa chỉ</StyledHeaderCell>
                    <StyledHeaderCell>Trạng thái</StyledHeaderCell>
                    <StyledHeaderCell>Thao tác</StyledHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deliveries.map((delivery) => (
                    <StyledTableRow key={delivery.shippingOrderId}>
                      <IdCell>#{delivery.orderId}</IdCell>
                      <StyledTableCell>
                        <CustomerName>
                          {delivery.userName || "Không xác định"}
                        </CustomerName>
                        <CustomerPhone>ID: {delivery.userId}</CustomerPhone>
                      </StyledTableCell>
                      <StyledTableCell>
                        {delivery.deliveryTime
                          ? formatDate(delivery.deliveryTime)
                          : "Chưa lên lịch"}
                      </StyledTableCell>
                      <StyledTableCell sx={{ maxWidth: 200 }}>
                        <Tooltip title={delivery.address || ""}>
                          <Box
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {delivery.address || "Không có địa chỉ"}
                          </Box>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell>
                        <OrderTypeChip
                          label={getStatusTranslation(
                            delivery.status.toString()
                          )}
                          size="small"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <ActionsContainer>
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleMarkAsDeliveredClick(delivery)}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Đã giao
                          </Button>
                          <Tooltip title="Xem chi tiết đơn hàng">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                // Navigate to order details
                                window.location.href = `/manage-order/${delivery.orderId}`;
                              }}
                              sx={{
                                backgroundColor: (theme) =>
                                  alpha(theme.palette.primary.main, 0.1),
                                "&:hover": {
                                  backgroundColor: (theme) =>
                                    alpha(theme.palette.primary.main, 0.2),
                                },
                              }}
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </ActionsContainer>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
            {/* Pagination */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
              <TablePagination
                component="div"
                count={totalCount}
                page={pageNumber - 1} // Convert 1-based to 0-based for MUI
                onPageChange={handlePageChange}
                rowsPerPage={pageSize}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Số hàng:"
                labelDisplayedRows={({ from, to, count }) =>
                  `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
                }
                sx={{
                  ".MuiTablePagination-select": {
                    borderRadius: 1,
                  },
                  ".MuiTablePagination-selectIcon": {
                    color: "primary.main",
                  },
                }}
              />
            </Box>
          </>
        )}
      </StyledPaper>
      {/* Mark as Delivered Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
              padding: 1,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            pb: 1,
          }}
        >
          Đánh dấu đơn hàng #{selectedDelivery?.orderId} là đã giao
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
          <Box sx={{ mt: 1, minWidth: 300 }}>
            <TextField
              label="Ghi chú giao hàng (Tùy chọn)"
              multiline
              rows={4}
              fullWidth
              value={deliveryNotes}
              onChange={handleDeliveryNotesChange}
              placeholder="Nhập ghi chú về việc giao hàng..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <DialogActionButton
            onClick={handleCloseDialog}
            sx={{
              color: (theme) => theme.palette.text.secondary,
              "&:hover": {
                backgroundColor: (theme) =>
                  alpha(theme.palette.text.secondary, 0.08),
              },
            }}
          >
            Hủy bỏ
          </DialogActionButton>
          <DialogActionButton
            onClick={handleConfirmDelivery}
            variant="contained"
            color="success"
            sx={{
              fontWeight: 600,
              "&:hover": {
                backgroundColor: (theme) => theme.palette.success.dark,
              },
            }}
          >
            Xác nhận đã giao
          </DialogActionButton>
        </DialogActions>
      </Dialog>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            fontWeight: 500,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </OrdersListContainer>
  );
};

// Hàm trợ giúp để dịch trạng thái sang tiếng Việt
const getStatusTranslation = (status: string): string => {
  const statusMap: Record<string, string> = {
    Pending: "Đang chờ",
    Processing: "Đang xử lý",
    Shipping: "Đang giao",
    Delivered: "Đã giao",
    Completed: "Hoàn thành",
    Cancelled: "Đã hủy",
    Returning: "Đang trả",
  };

  return statusMap[status] || status;
};

export default PendingDeliveriesList;
