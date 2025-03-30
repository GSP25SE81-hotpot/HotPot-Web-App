/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/OrderManagement/components/OrdersByStatusList.tsx
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
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
import Grid from "@mui/material/Grid2";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import {
  OrderQueryParams,
  OrderStatus,
  OrderWithDetailsDTO,
  orderManagementService,
} from "../../../api/Services/orderManagementService";
import {
  ActionsContainer,
  CustomerName,
  CustomerPhone,
  EmptyStateContainer,
  EmptyStateText,
  LoadingContainer,
  OrderIdCell,
  OrderTypeChip,
  OrdersListContainer,
  ShippingStatusChip,
  StyledHeaderCell,
  StyledPaper,
  StyledTab,
  StyledTableCell,
  StyledTableContainer,
  StyledTableRow,
  StyledTabs,
  UnallocatedChip,
  ViewDetailsButton,
} from "../../../components/manager/styles/OrdersByStatusListStyles";
import { formatCurrency } from "../../../utils/formatters";

const OrdersByStatusList: React.FC = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState(0);
  // State for orders data
  const [orders, setOrders] = useState<OrderWithDetailsDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  // Sorting state
  const [sortBy, setSortBy] = useState<string>("date");
  const [sortDescending, setSortDescending] = useState(true);
  // Filtering state
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Map tab index to order status
  const tabToStatus = [
    OrderStatus.Pending,
    OrderStatus.Processing,
    OrderStatus.Shipping,
    OrderStatus.Delivered,
    OrderStatus.Completed,
    OrderStatus.Cancelled,
    OrderStatus.Returning,
  ];

  // Fetch orders when dependencies change
  useEffect(() => {
    fetchOrders();
  }, [activeTab, pageNumber, pageSize, sortBy, sortDescending]);

  // Function to fetch orders with current filters
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const status = tabToStatus[activeTab];
      // Create query params object
      const queryParams: Omit<OrderQueryParams, "status"> = {
        pageNumber,
        pageSize,
        sortBy,
        sortDescending,
        searchTerm: searchTerm || undefined,
        fromDate: fromDate ? fromDate.toISOString() : undefined,
        toDate: toDate ? toDate.toISOString() : undefined,
        customerId: customerId || undefined,
      };
      const response = await orderManagementService.getOrdersByStatus(
        status,
        queryParams
      );
      // Update state with paginated data
      setOrders(response.items);
      setTotalCount(response.totalCount);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(`Không thể tải đơn hàng. Vui lòng thử lại sau.`);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPageNumber(1); // Reset to first page when changing tabs
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

  // Handle search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Apply filters
  const applyFilters = () => {
    setPageNumber(1); // Reset to first page when applying filters
    fetchOrders();
  };

  // Clear filters
  const clearFilters = () => {
    setSearchTerm("");
    setFromDate(null);
    setToDate(null);
    setCustomerId(null);
    setPageNumber(1);
    // Fetch orders with cleared filters
    fetchOrders();
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Render filters section
  const renderFilters = () => (
    <Collapse in={showFilters}>
      <Box
        sx={{
          p: 2,
          mb: 2,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.5),
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Từ ngày"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Đến ngày"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Khách hàng</InputLabel>
              <Select
                value={customerId || ""}
                label="Khách hàng"
                onChange={(e) =>
                  setCustomerId((e.target.value as number) || null)
                }
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <MenuItem value="">Tất cả khách hàng</MenuItem>
                {/* Add customer options here */}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                onClick={applyFilters}
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Áp dụng
              </Button>
              <Button
                variant="outlined"
                onClick={clearFilters}
                sx={{
                  flex: 1,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Xóa bộ lọc
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Collapse>
  );

  return (
    <OrdersListContainer>
      <StyledPaper>
        {/* Tabs section */}
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="order status tabs"
        >
          <StyledTab label="Chờ xử lý" />
          <StyledTab label="Đang xử lý" />
          <StyledTab label="Đang giao" />
          <StyledTab label="Đã giao" />
          <StyledTab label="Hoàn thành" />
          <StyledTab label="Đã hủy" />
          <StyledTab label="Đang trả" />
        </StyledTabs>
        {/* Search and filter toolbar */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="h2"
              sx={{
                m: 0,
                fontSize: "1.25rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              Đơn hàng {getVietnameseOrderStatusLabel(tabToStatus[activeTab])}
              <Box
                sx={{
                  ml: 1,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1.5,
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                }}
              >
                {totalCount}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              placeholder="Tìm kiếm đơn hàng..."
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
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
                        applyFilters();
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  applyFilters();
                }
              }}
            />
            <Tooltip title="Bộ lọc nâng cao">
              <Button
                variant={showFilters ? "contained" : "outlined"}
                color="primary"
                onClick={toggleFilters}
                startIcon={<FilterListIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Bộ lọc
              </Button>
            </Tooltip>
          </Box>
        </Box>
        {/* Filters section */}
        {renderFilters()}
        {/* Loading state */}
        {loading && orders.length === 0 ? (
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        ) : error ? (
          <Box sx={{ p: 2 }}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          </Box>
        ) : orders.length === 0 ? (
          <EmptyStateContainer>
            <EmptyStateText variant="h6">
              Không tìm thấy đơn hàng{" "}
              {getVietnameseOrderStatusLabel(
                tabToStatus[activeTab]
              ).toLowerCase()}
            </EmptyStateText>
            <EmptyStateText variant="body2" sx={{ mt: 1 }}>
              Hãy thử điều chỉnh bộ lọc hoặc tiêu chí tìm kiếm
            </EmptyStateText>
          </EmptyStateContainer>
        ) : (
          <>
            {/* Orders table */}
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
                    <StyledHeaderCell>Sản phẩm</StyledHeaderCell>
                    <StyledHeaderCell>Vận chuyển</StyledHeaderCell>
                    <StyledHeaderCell>Thao tác</StyledHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <StyledTableRow key={order.orderId}>
                      <OrderIdCell>#{order.orderId}</OrderIdCell>
                      <StyledTableCell>
                        <CustomerName>
                          {order.userName || "Không xác định"}
                        </CustomerName>
                        <CustomerPhone>ID: {order.userId}</CustomerPhone>
                      </StyledTableCell>
                      <StyledTableCell>
                        {formatCurrency(order.totalPrice)}
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
                        {order.shippingInfo ? (
                          <Tooltip
                            title={`Được giao bởi ${
                              order.shippingInfo.staff?.name || "Không xác định"
                            }`}
                          >
                            <ShippingStatusChip
                              label={
                                order.shippingInfo.isDelivered
                                  ? "Đã giao"
                                  : "Đang chờ"
                              }
                              size="small"
                              delivered={order.shippingInfo.isDelivered}
                            />
                          </Tooltip>
                        ) : (
                          <UnallocatedChip
                            label="Chưa phân công"
                            size="small"
                          />
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        <ActionsContainer>
                          <Tooltip title="Xem chi tiết đơn hàng">
                            <ViewDetailsButton
                              size="small"
                              onClick={() => {
                                // Navigate to order details
                                window.location.href = `/orders/${order.orderId}`;
                              }}
                            >
                              <InfoIcon fontSize="small" />
                            </ViewDetailsButton>
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

// Hàm trợ giúp để dịch trạng thái đơn hàng sang tiếng Việt
const getVietnameseOrderStatusLabel = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.Pending]: "Chờ xử lý",
    [OrderStatus.Processing]: "Đang xử lý",
    [OrderStatus.Shipping]: "Đang giao",
    [OrderStatus.Delivered]: "Đã giao",
    [OrderStatus.Completed]: "Hoàn thành",
    [OrderStatus.Cancelled]: "Đã hủy",
    [OrderStatus.Returning]: "Đang trả",
  };

  return statusMap[status] || "Không xác định";
};

export default OrdersByStatusList;
