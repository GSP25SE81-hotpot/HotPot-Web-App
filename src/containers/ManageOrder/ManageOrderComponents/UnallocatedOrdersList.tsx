/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/OrderManagement/components/UnallocatedOrdersList.tsx
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Table,
  TableBody,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  alpha,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  AllocateOrderRequest,
  OrderQueryParams,
  UnallocatedOrderDTO,
  orderManagementService,
  OrderStatus,
} from "../../../api/Services/orderManagementService";
import staffService from "../../../api/Services/staffService";
import {
  AllocateButton,
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
  StatusChip,
  StyledHeaderCell,
  StyledPaper,
  StyledTableCell,
  StyledTableContainer,
  StyledTableRow,
} from "../../../components/manager/styles/UnallocatedOrdersListStyles";
import { StaffAvailabilityDto } from "../../../types/staff";
import {
  formatCurrency,
  formatDate,
  getOrderStatusColor,
} from "../../../utils/formatters";

// Helper function to translate order status into Vietnamese
const getVietnameseOrderStatusLabel = (status: any): string => {
  // If status is a number, convert to enum OrderStatus
  if (typeof status === "number") {
    // Map from number to enum name
    const statusEnum = OrderStatus[status];
    if (statusEnum) {
      // If enum name is found, use it to look up in translation table
      const statusMap: Record<string, string> = {
        Pending: "Chờ xử lý",
        Processing: "Đang xử lý",
        Shipping: "Đang giao",
        Delivered: "Đã giao",
        Completed: "Hoàn thành",
        Cancelled: "Đã hủy",
        Returning: "Đang trả",
      };
      return statusMap[statusEnum] || statusEnum;
    }
  }

  // If status is a string, use it directly
  if (typeof status === "string") {
    const statusMap: Record<string, string> = {
      Pending: "Chờ xử lý",
      Processing: "Đang xử lý",
      Shipping: "Đang giao",
      Delivered: "Đã giao",
      Completed: "Hoàn thành",
      Cancelled: "Đã hủy",
      Returning: "Đang trả",
    };
    return statusMap[status] || status;
  }

  // Otherwise, convert to string and return
  return String(status);
};

const UnallocatedOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<UnallocatedOrderDTO[]>([]);
  const [staff, setStaff] = useState<StaffAvailabilityDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allocating, setAllocating] = useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<UnallocatedOrderDTO | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState(false);
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
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDescending, setSortDescending] = useState(true);
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data function
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // Prepare query parameters
      const queryParams: OrderQueryParams = {
        pageNumber,
        pageSize,
        sortBy,
        sortDescending,
        searchTerm: searchTerm.trim() || undefined,
      };
      // Call the API
      const result = await orderManagementService.getUnallocatedOrders(
        queryParams
      );
      // Update state with the response data
      setOrders(result.items);
      setTotalCount(result.totalCount);
      // Also fetch staff members for allocation
      fetchStaffMembers();
    } catch (err) {
      console.error("Error fetching unallocated orders:", err);
      setError(
        err instanceof Error
          ? `Không thể tải đơn hàng chưa phân công: ${err.message}`
          : "Không thể tải đơn hàng chưa phân công"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch staff members
  const fetchStaffMembers = async () => {
    try {
      const staffData = await staffService.getAvailableStaff();
      // Filter staff to only include those with isAvailable = true
      const availableStaff = Array.isArray(staffData)
        ? staffData.filter((staff) => staff.isAvailable === true)
        : [];
      setStaff(availableStaff);
      // Log how many staff members are available
      // console.log(
      //   `Tìm thấy ${availableStaff.length} nhân viên khả dụng trong tổng số ${staffData?.length} nhân viên`
      // );
    } catch (err) {
      console.error("Error fetching staff members:", err);
      setStaff([]);
      // Only show error message if we're opening the dialog
      if (openDialog) {
        setSnackbar({
          open: true,
          message:
            "Không thể tải dữ liệu khả dụng của nhân viên. Vui lòng thử lại sau.",
          severity: "error",
        });
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageNumber, pageSize, sortBy, sortDescending]);

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Apply search
  const applySearch = () => {
    setPageNumber(1); // Reset to first page when searching
    fetchData();
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

  const handleAllocateClick = (order: UnallocatedOrderDTO) => {
    setSelectedOrder(order);
    setSelectedStaffId(0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleStaffChange = (event: SelectChangeEvent<number>) => {
    setSelectedStaffId(Number(event.target.value));
  };

  const handleAllocateOrder = async () => {
    if (!selectedOrder || !selectedStaffId) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn một nhân viên",
        severity: "error",
      });
      return;
    }
    try {
      setAllocating(true);
      const request: AllocateOrderRequest = {
        orderId: selectedOrder.orderId,
        staffId: selectedStaffId,
      };
      await orderManagementService.allocateOrderToStaff(request);
      // Refresh the data after allocation
      fetchData();
      setSnackbar({
        open: true,
        message: `Đơn hàng #${selectedOrder.orderCode} đã được phân công thành công`,
        severity: "success",
      });
      handleCloseDialog();
    } catch (err) {
      console.error("Error allocating order:", err);
      setSnackbar({
        open: true,
        message: `Không thể phân công đơn hàng: ${
          err instanceof Error ? err.message : "Lỗi không xác định"
        }`,
        severity: "error",
      });
    } finally {
      setAllocating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && orders.length === 0) {
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
          Đơn hàng chưa phân công <CountBadge>{totalCount}</CountBadge>
        </ListTitle>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            placeholder="Tìm kiếm đơn hàng..."
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
        </Box>
      </Box>
      <StyledPaper>
        {orders.length === 0 ? (
          <EmptyStateContainer>
            <EmptyStateTitle variant="h6">
              Không tìm thấy đơn hàng chưa phân công
            </EmptyStateTitle>
            <EmptyStateSubtitle variant="body2">
              Tất cả đơn hàng đã được phân công cho nhân viên
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
                        active={sortBy === "date"}
                        direction={sortDescending ? "desc" : "asc"}
                        onClick={() => handleSortChange("date")}
                      >
                        Ngày đặt
                      </TableSortLabel>
                    </StyledHeaderCell>
                    <StyledHeaderCell>
                      <TableSortLabel
                        active={sortBy === "totalprice"}
                        direction={sortDescending ? "desc" : "asc"}
                        onClick={() => handleSortChange("totalprice")}
                      >
                        Tổng tiền
                      </TableSortLabel>
                    </StyledHeaderCell>
                    <StyledHeaderCell>Trạng thái</StyledHeaderCell>
                    <StyledHeaderCell>Sản phẩm</StyledHeaderCell>
                    <StyledHeaderCell>Thao tác</StyledHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <StyledTableRow key={order.orderCode}>
                      <IdCell>#{order.orderCode}</IdCell>
                      <StyledTableCell>
                        <CustomerName>
                          {order.userName || "Không xác định"}
                        </CustomerName>
                        <CustomerPhone>ID: {order.userId}</CustomerPhone>
                      </StyledTableCell>
                      <StyledTableCell>
                        {formatDate(new Date().toISOString())}{" "}
                        {/* Use current date as fallback */}
                      </StyledTableCell>
                      <StyledTableCell>
                        {formatCurrency(order.totalPrice)}
                      </StyledTableCell>
                      <StyledTableCell>
                        <StatusChip
                          label={getVietnameseOrderStatusLabel(order.status)}
                          size="small"
                          statuscolor={getOrderStatusColor(order.status)}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        {order.hasSellItems && (
                          <OrderTypeChip label="Bán" size="small" />
                        )}
                        {order.hasRentItems && (
                          <OrderTypeChip
                            label="Thuê"
                            size="small"
                            color="secondary"
                          />
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        <AllocateButton
                          variant="contained"
                          size="small"
                          onClick={() => handleAllocateClick(order)}
                        >
                          Phân công
                        </AllocateButton>
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
      {/* Allocation Dialog */}
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
          Phân công đơn hàng #{selectedOrder?.orderCode}
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
          <Box sx={{ mt: 1, minWidth: 300 }}>
            <FormControl fullWidth>
              <InputLabel id="staff-select-label">Chọn nhân viên</InputLabel>
              <Select
                labelId="staff-select-label"
                value={selectedStaffId}
                label="Chọn nhân viên"
                onChange={handleStaffChange}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <MenuItem value={0} disabled>
                  Chọn một nhân viên
                </MenuItem>
                {staff.map((staffMember) => (
                  <MenuItem
                    key={staffMember.id}
                    value={staffMember.id}
                    sx={{
                      borderRadius: 1,
                      my: 0.5,
                      "&:hover": {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.08),
                      },
                      "&.Mui-selected": {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.12),
                        "&:hover": {
                          backgroundColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.16),
                        },
                      },
                    }}
                  >
                    {staffMember.name}
                    <Box
                      component="span"
                      sx={{
                        ml: 2,
                        bgcolor: "action.hover",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.75rem",
                        fontWeight: "medium",
                        color: "text.secondary",
                      }}
                    >
                      {staffMember.assignmentCount} lần
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            onClick={handleAllocateOrder}
            variant="contained"
            disabled={allocating || !selectedStaffId}
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              color: "white",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.dark,
              },
              "&.Mui-disabled": {
                backgroundColor: (theme) =>
                  alpha(theme.palette.primary.main, 0.3),
                color: "white",
              },
            }}
          >
            {allocating ? <CircularProgress size={24} /> : "Phân công"}
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

export default UnallocatedOrdersList;
