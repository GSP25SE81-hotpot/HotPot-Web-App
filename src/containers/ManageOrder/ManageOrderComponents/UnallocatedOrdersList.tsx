/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/OrderManagement/components/UnallocatedOrdersList.tsx
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
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
  Typography,
  alpha,
  Chip,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { orderManagementService } from "../../../api/Services/orderManagementService";
import {
  AllocateOrderWithVehicleRequest,
  OrderQueryParams,
  UnallocatedOrderDTO,
  OrderStatus,
  OrderSize,
  VehicleType,
  OrderSizeDTO,
} from "../../../types/orderManagement";
import { VehicleDTO } from "../../../types/vehicle";
import staffService from "../../../api/Services/staffService";
import vehicleService from "../../../api/Services/vehicleService";
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

// Helper function to translate order size into Vietnamese
const getVietnameseOrderSizeLabel = (size: OrderSize): string => {
  const sizeMap: Record<OrderSize, string> = {
    [OrderSize.Small]: "Nhỏ",
    [OrderSize.Large]: "Lớn",
  };
  return sizeMap[size] || "Không xác định";
};

// Helper function to translate vehicle type into Vietnamese
const getVietnameseVehicleTypeLabel = (type: VehicleType): string => {
  const typeMap: Record<VehicleType, string> = {
    [VehicleType.Scooter]: "Xe máy",
    [VehicleType.Car]: "Ô tô",
  };
  return typeMap[type] || "Không xác định";
};

const UnallocatedOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<UnallocatedOrderDTO[]>([]);
  const [staff, setStaff] = useState<StaffAvailabilityDto[]>([]);
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allocating, setAllocating] = useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<UnallocatedOrderDTO | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<number>(0);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const [orderSize, setOrderSize] = useState<OrderSizeDTO | null>(null);
  const [estimatingSize, setEstimatingSize] = useState(false);
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

      // Use the service method to fetch unallocated orders
      const result = await orderManagementService.getUnallocatedOrders(
        queryParams
      );
      setOrders(result.items);
      setTotalCount(result.totalCount);
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

  // Fetch available vehicles
  const fetchAvailableVehicles = async () => {
    try {
      const vehiclesData = await vehicleService.getAvailableVehicles();
      setVehicles(vehiclesData);
    } catch (err) {
      console.error("Error fetching available vehicles:", err);
      setVehicles([]);
      if (openDialog) {
        setSnackbar({
          open: true,
          message:
            "Không thể tải dữ liệu phương tiện khả dụng. Vui lòng thử lại sau.",
          severity: "error",
        });
      }
    }
  };

  // Estimate order size
  const estimateOrderSize = async (orderId: number) => {
    try {
      setEstimatingSize(true);
      const sizeData = await orderManagementService.estimateOrderSize(orderId);
      setOrderSize(sizeData);

      // Pre-select a vehicle based on the suggested vehicle type if available
      if (sizeData.suggestedVehicleType && vehicles.length > 0) {
        const suggestedVehicle = vehicles.find(
          (v) => v.type === sizeData.suggestedVehicleType
        );
        if (suggestedVehicle) {
          setSelectedVehicleId(suggestedVehicle.vehicleId);
        }
      }
    } catch (err) {
      console.error("Error estimating order size:", err);
      setSnackbar({
        open: true,
        message:
          "Không thể ước tính kích thước đơn hàng. Vui lòng thử lại sau.",
        severity: "error",
      });
      setOrderSize(null);
    } finally {
      setEstimatingSize(false);
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

  const handleAllocateClick = async (order: UnallocatedOrderDTO) => {
    setSelectedOrder(order);
    setSelectedStaffId(0);
    setSelectedVehicleId(null);
    setOrderSize(null);

    // Fetch staff and vehicles before opening dialog
    await fetchStaffMembers();
    await fetchAvailableVehicles();

    // Open dialog and then estimate order size
    setOpenDialog(true);

    // Estimate order size after dialog is open
    if (order.orderId) {
      estimateOrderSize(order.orderId);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setOrderSize(null);
  };

  const handleStaffChange = (event: SelectChangeEvent<number>) => {
    setSelectedStaffId(Number(event.target.value));
  };

  const handleVehicleChange = (event: SelectChangeEvent<number>) => {
    setSelectedVehicleId(Number(event.target.value));
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

      const request: AllocateOrderWithVehicleRequest = {
        orderId: selectedOrder.orderId,
        staffId: selectedStaffId,
        vehicleId: selectedVehicleId || undefined,
      };

      // Use the new method that supports vehicle allocation
      await orderManagementService.allocateOrderToStaffWithVehicle(request);

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

  // Get filtered vehicles based on order size
  const getFilteredVehicles = () => {
    if (!orderSize) return vehicles;

    return vehicles.filter((vehicle) => {
      // For small orders, both scooters and cars are fine
      if (orderSize.size === OrderSize.Small) return true;

      // For large orders, only cars are suitable
      if (orderSize.size === OrderSize.Large) {
        return vehicle.type === VehicleType.Car;
      }

      return true;
    });
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

      {/* Enhanced Allocation Dialog with Vehicle Selection */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
              padding: 1,
              maxWidth: 450,
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
          {/* Order Size Information */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: "text.secondary" }}
            >
              Thông tin đơn hàng
            </Typography>

            {estimatingSize ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2">
                  Đang ước tính kích thước đơn hàng...
                </Typography>
              </Box>
            ) : orderSize ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={`Kích thước: ${getVietnameseOrderSizeLabel(
                      orderSize.size
                    )}`}
                    size="small"
                    color={
                      orderSize.size === OrderSize.Large ? "warning" : "success"
                    }
                  />
                  <Chip
                    label={`Phương tiện đề xuất: ${getVietnameseVehicleTypeLabel(
                      orderSize.suggestedVehicleType
                    )}`}
                    size="small"
                    color="info"
                    icon={
                      orderSize.suggestedVehicleType === VehicleType.Car ? (
                        <DirectionsCarIcon fontSize="small" />
                      ) : (
                        <TwoWheelerIcon fontSize="small" />
                      )
                    }
                  />
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: 0.5 }}
                >
                  {orderSize.size === OrderSize.Large
                    ? "Đơn hàng lớn, nên sử dụng ô tô để vận chuyển."
                    : "Đơn hàng nhỏ, có thể sử dụng xe máy để vận chuyển."}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Không thể ước tính kích thước đơn hàng.
              </Typography>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Staff Selection */}
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: "text.secondary" }}
            >
              Chọn nhân viên giao hàng
            </Typography>
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

          {/* Vehicle Selection */}
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: "text.secondary" }}
            >
              Chọn phương tiện vận chuyển
            </Typography>
            <FormControl fullWidth>
              <InputLabel id="vehicle-select-label">
                Chọn phương tiện
              </InputLabel>
              <Select
                labelId="vehicle-select-label"
                value={selectedVehicleId || 0}
                label="Chọn phương tiện"
                onChange={handleVehicleChange}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <MenuItem value={0}>Không sử dụng phương tiện</MenuItem>
                {getFilteredVehicles().map((vehicle) => (
                  <MenuItem
                    key={vehicle.vehicleId}
                    value={vehicle.vehicleId}
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
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {vehicle.type === VehicleType.Car ? (
                          <DirectionsCarIcon fontSize="small" color="primary" />
                        ) : (
                          <TwoWheelerIcon fontSize="small" color="secondary" />
                        )}
                        <Typography>{vehicle.name}</Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {vehicle.licensePlate}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {orderSize &&
              orderSize.size === OrderSize.Large &&
              selectedVehicleId &&
              vehicles.find((v) => v.vehicleId === selectedVehicleId)?.type ===
                VehicleType.Scooter && (
                <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                  Đơn hàng lớn nên sử dụng ô tô để vận chuyển. Xe máy có thể
                  không đủ không gian.
                </Alert>
              )}
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
