/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/OrderManagement/components/UnallocatedOrdersList.tsx
import BuildIcon from "@mui/icons-material/Build";
import ClearIcon from "@mui/icons-material/Clear";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SearchIcon from "@mui/icons-material/Search";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  Alert,
  Box,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { orderManagementService } from "../../../api/Services/orderManagementService";
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
import {
  OrderQueryParams,
  OrderSize,
  OrderSizeDTO,
  OrderStatus,
  StaffAssignmentRequest,
  StaffTaskType,
  UnallocatedOrderDTO,
  VehicleType,
} from "../../../types/orderManagement";
import { StaffAvailabilityDto } from "../../../types/staff";
import { VehicleDTO } from "../../../types/vehicle";
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

// Helper function to translate task type into Vietnamese
const getVietnameseTaskTypeLabel = (type: StaffTaskType): string => {
  const typeMap: Record<StaffTaskType, string> = {
    [StaffTaskType.Preparation]: "Chuẩn bị",
    [StaffTaskType.Shipping]: "Giao hàng",
  };
  return typeMap[type] || "Không xác định";
};

const UnallocatedOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<UnallocatedOrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allocating, setAllocating] = useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<UnallocatedOrderDTO | null>(null);
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const [orderSize, setOrderSize] = useState<OrderSizeDTO | null>(null);
  const [estimatingSize, setEstimatingSize] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Selected task types (multiple selection)
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<StaffTaskType[]>([
    StaffTaskType.Shipping,
  ]);

  // Staff for each task type
  const [prepStaff, setPrepStaff] = useState<StaffAvailabilityDto[]>([]);
  const [shippingStaff, setShippingStaff] = useState<StaffAvailabilityDto[]>(
    []
  );

  // Selected staff for each task type
  const [selectedPrepStaffId, setSelectedPrepStaffId] = useState<number>(0);
  const [selectedShippingStaffId, setSelectedShippingStaffId] =
    useState<number>(0);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );

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

  // Fetch staff members for both task types
  const fetchStaffMembers = async () => {
    try {
      // Fetch preparation staff if that task type is selected
      if (selectedTaskTypes.includes(StaffTaskType.Preparation)) {
        const prepStaffData = await staffService.getAvailableStaff(
          StaffTaskType.Preparation
        );
        const availablePrepStaff = Array.isArray(prepStaffData)
          ? prepStaffData.filter(
              (staff) => staff.isAvailable === true && staff.isEligible === true
            )
          : [];
        setPrepStaff(availablePrepStaff);
      }

      // Fetch shipping staff if that task type is selected
      if (selectedTaskTypes.includes(StaffTaskType.Shipping)) {
        const shippingStaffData = await staffService.getAvailableStaff(
          StaffTaskType.Shipping
        );
        const availableShippingStaff = Array.isArray(shippingStaffData)
          ? shippingStaffData.filter(
              (staff) => staff.isAvailable === true && staff.isEligible === true
            )
          : [];
        setShippingStaff(availableShippingStaff);
      }
    } catch (err) {
      console.error("Error fetching staff members:", err);
      setPrepStaff([]);
      setShippingStaff([]);
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

  // Handle task type selection (checkboxes)
  const handleTaskTypeChange = (taskType: StaffTaskType) => {
    setSelectedTaskTypes((prev) => {
      if (prev.includes(taskType)) {
        // Remove task type if already selected
        const result = prev.filter((type) => type !== taskType);
        // Reset the corresponding staff selection
        if (taskType === StaffTaskType.Preparation) {
          setSelectedPrepStaffId(0);
        } else if (taskType === StaffTaskType.Shipping) {
          setSelectedShippingStaffId(0);
          setSelectedVehicleId(null);
        }
        return result.length > 0 ? result : [taskType]; // Ensure at least one task type is selected
      } else {
        // Add task type if not already selected
        return [...prev, taskType];
      }
    });

    // Fetch staff for the updated task types
    fetchStaffMembers();
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
    setSelectedPrepStaffId(0);
    setSelectedShippingStaffId(0);
    setSelectedVehicleId(null);
    setOrderSize(null);

    // Default to shipping task type for new allocations
    setSelectedTaskTypes([StaffTaskType.Shipping]);

    // Open dialog first
    setOpenDialog(true);

    // Then fetch data
    await fetchStaffMembers();
    await fetchAvailableVehicles();

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

  // Handle preparation staff selection
  const handlePrepStaffChange = (event: SelectChangeEvent<number>) => {
    setSelectedPrepStaffId(Number(event.target.value));
  };

  // Handle shipping staff selection
  const handleShippingStaffChange = (event: SelectChangeEvent<number>) => {
    setSelectedShippingStaffId(Number(event.target.value));
  };

  const handleVehicleChange = (event: SelectChangeEvent<number>) => {
    setSelectedVehicleId(Number(event.target.value));
  };

  // Updated to handle multiple assignments
  const handleAllocateOrder = async () => {
    // Validate selections based on selected task types
    if (
      (selectedTaskTypes.includes(StaffTaskType.Preparation) &&
        !selectedPrepStaffId) ||
      (selectedTaskTypes.includes(StaffTaskType.Shipping) &&
        !selectedShippingStaffId)
    ) {
      setSnackbar({
        open: true,
        message: "Vui lòng chọn nhân viên cho tất cả các nhiệm vụ đã chọn",
        severity: "error",
      });
      return;
    }

    if (!selectedOrder) {
      return;
    }

    try {
      setAllocating(true);

      // Track successful assignments
      const successfulAssignments: StaffTaskType[] = [];

      // Assign preparation staff if selected
      if (
        selectedTaskTypes.includes(StaffTaskType.Preparation) &&
        selectedPrepStaffId
      ) {
        const prepRequest: StaffAssignmentRequest = {
          orderId: selectedOrder.orderId,
          staffId: selectedPrepStaffId,
          taskType: StaffTaskType.Preparation,
        };

        try {
          await orderManagementService.assignStaffToOrder(prepRequest);
          successfulAssignments.push(StaffTaskType.Preparation);
        } catch (err) {
          console.error("Error assigning preparation staff:", err);
          // Continue with shipping assignment even if preparation assignment fails
        }
      }

      // Assign shipping staff if selected
      if (
        selectedTaskTypes.includes(StaffTaskType.Shipping) &&
        selectedShippingStaffId
      ) {
        const shippingRequest: StaffAssignmentRequest = {
          orderId: selectedOrder.orderId,
          staffId: selectedShippingStaffId,
          taskType: StaffTaskType.Shipping,
          vehicleId: selectedVehicleId || undefined,
        };

        try {
          await orderManagementService.assignStaffToOrder(shippingRequest);
          successfulAssignments.push(StaffTaskType.Shipping);
        } catch (err) {
          console.error("Error assigning shipping staff:", err);
          // Continue with showing results even if shipping assignment fails
        }
      }

      // Refresh the data after allocation
      fetchData();

      // Show appropriate success message based on successful assignments
      if (successfulAssignments.length === 0) {
        setSnackbar({
          open: true,
          message: `Không thể phân công đơn hàng #${selectedOrder.orderCode}`,
          severity: "error",
        });
      } else if (successfulAssignments.length === 1) {
        const taskTypeText =
          successfulAssignments[0] === StaffTaskType.Preparation
            ? "chuẩn bị"
            : "giao hàng";

        setSnackbar({
          open: true,
          message: `Đơn hàng #${selectedOrder.orderCode} đã được phân công ${taskTypeText} thành công`,
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: `Đơn hàng #${selectedOrder.orderCode} đã được phân công chuẩn bị và giao hàng thành công`,
          severity: "success",
        });
      }

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
      {/* Enhanced Allocation Dialog with Task Type Selection */}
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
          {/* Task Type Selection with Checkboxes */}
          <Box sx={{ mb: 3 }}>
            <FormLabel
              component="legend"
              sx={{ color: "text.secondary", mb: 1, fontSize: "0.875rem" }}
            >
              Loại nhiệm vụ
            </FormLabel>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTaskTypes.includes(
                      StaffTaskType.Preparation
                    )}
                    onChange={() =>
                      handleTaskTypeChange(StaffTaskType.Preparation)
                    }
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <BuildIcon fontSize="small" />
                    <Typography>Chuẩn bị</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedTaskTypes.includes(StaffTaskType.Shipping)}
                    onChange={() =>
                      handleTaskTypeChange(StaffTaskType.Shipping)
                    }
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <LocalShippingIcon fontSize="small" />
                    <Typography>Giao hàng</Typography>
                  </Box>
                }
              />
            </FormGroup>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Preparation Staff Selection - Only show if preparation task type is selected */}
          {selectedTaskTypes.includes(StaffTaskType.Preparation) && (
            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Chọn nhân viên chuẩn bị
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="prep-staff-select-label">
                  Chọn nhân viên chuẩn bị
                </InputLabel>
                <Select
                  labelId="prep-staff-select-label"
                  value={selectedPrepStaffId}
                  label="Chọn nhân viên chuẩn bị"
                  onChange={handlePrepStaffChange}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: (theme) =>
                        alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                >
                  <MenuItem value={0} disabled>
                    Chọn một nhân viên chuẩn bị
                  </MenuItem>
                  {prepStaff.map((staffMember) => (
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
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <BuildIcon fontSize="small" color="info" />
                          <Typography>{staffMember.name}</Typography>
                        </Box>
                        {staffMember.assignmentCount > 0 && (
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
                            {staffMember.assignmentCount} đơn
                          </Box>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {selectedTaskTypes.includes(StaffTaskType.Preparation) &&
            selectedTaskTypes.includes(StaffTaskType.Shipping) && (
              <Divider sx={{ my: 2 }} />
            )}

          {/* Shipping Staff and Vehicle Selection - Only show if shipping task type is selected */}
          {selectedTaskTypes.includes(StaffTaskType.Shipping) && (
            <>
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
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={`Kích thước: ${getVietnameseOrderSizeLabel(
                          orderSize.size
                        )}`}
                        size="small"
                        color={
                          orderSize.size === OrderSize.Large
                            ? "warning"
                            : "success"
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

              {/* Shipping Staff Selection */}
              <Box sx={{ mt: 2, mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  Chọn nhân viên giao hàng
                </Typography>
                <FormControl fullWidth>
                  <InputLabel id="shipping-staff-select-label">
                    Chọn nhân viên giao hàng
                  </InputLabel>
                  <Select
                    labelId="shipping-staff-select-label"
                    value={selectedShippingStaffId}
                    label="Chọn nhân viên giao hàng"
                    onChange={handleShippingStaffChange}
                    sx={{
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <MenuItem value={0} disabled>
                      Chọn một nhân viên giao hàng
                    </MenuItem>
                    {shippingStaff.map((staffMember) => (
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
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <LocalShippingIcon
                              fontSize="small"
                              color="secondary"
                            />
                            <Typography>{staffMember.name}</Typography>
                          </Box>
                          {staffMember.assignmentCount > 0 && (
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
                              {staffMember.assignmentCount} đơn
                            </Box>
                          )}
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
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {vehicle.type === VehicleType.Car ? (
                              <DirectionsCarIcon
                                fontSize="small"
                                color="primary"
                              />
                            ) : (
                              <TwoWheelerIcon
                                fontSize="small"
                                color="secondary"
                              />
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
                  vehicles.find((v) => v.vehicleId === selectedVehicleId)
                    ?.type === VehicleType.Scooter && (
                    <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
                      Đơn hàng lớn nên sử dụng ô tô để vận chuyển. Xe máy có thể
                      không đủ không gian.
                    </Alert>
                  )}
              </Box>
            </>
          )}
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
            disabled={
              allocating ||
              (selectedTaskTypes.includes(StaffTaskType.Preparation) &&
                !selectedPrepStaffId) ||
              (selectedTaskTypes.includes(StaffTaskType.Shipping) &&
                !selectedShippingStaffId)
            }
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
            {allocating ? (
              <CircularProgress size={24} color="inherit" />
            ) : selectedTaskTypes.length > 1 ? (
              "Phân công chuẩn bị và giao hàng"
            ) : (
              `Phân công ${getVietnameseTaskTypeLabel(selectedTaskTypes[0])}`
            )}
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
