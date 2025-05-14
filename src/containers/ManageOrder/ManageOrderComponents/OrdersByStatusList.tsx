/* eslint-disable react-hooks/exhaustive-deps */
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Collapse,
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
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfoIcon from "@mui/icons-material/Info";
import SearchIcon from "@mui/icons-material/Search";
import { SelectChangeEvent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { orderManagementService } from "../../../api/Services/orderManagementService";
import staffService from "../../../api/Services/staffService";
import vehicleService from "../../../api/Services/vehicleService";
import OrderAllocationDialog from "./Dialog/OrderAllocationDialog";
import StaffAssignmentStatus from "./StaffAssignmentStatus";
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
import VehicleInfoDisplay from "./VehicleInfoDisplay";
import {
  MultiStaffAssignmentRequest,
  OrderQueryParams,
  OrderSize,
  OrderSizeDTO,
  OrderStatus,
  OrderWithDetailsDTO,
  StaffTaskType,
  VehicleType,
} from "../../../types/orderManagement";
import { StaffAvailabilityDto } from "../../../types/staff";
import { VehicleDTO } from "../../../types/vehicle";
import { formatCurrency } from "../../../utils/formatters";
import { getVietnameseOrderStatusLabel } from "./utils/orderHelpers";

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
  // Allocation dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] =
    useState<OrderWithDetailsDTO | null>(null);
  const [allocating, setAllocating] = useState(false);
  // Staff selection state
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<StaffTaskType[]>([
    StaffTaskType.Preparation,
  ]);
  const [prepStaff, setPrepStaff] = useState<StaffAvailabilityDto[]>([]);
  const [shippingStaff, setShippingStaff] = useState<StaffAvailabilityDto[]>(
    []
  );
  const [selectedPrepStaffId, setSelectedPrepStaffId] = useState<number>(0);
  const [selectedShippingStaffId, setSelectedShippingStaffId] =
    useState<number>(0);
  // Vehicle selection state
  const [vehicles, setVehicles] = useState<VehicleDTO[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  // Order size state
  const [orderSize, setOrderSize] = useState<OrderSizeDTO | null>(null);
  const [estimatingSize, setEstimatingSize] = useState(false);
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
      if (selectedTaskTypes.includes(StaffTaskType.Shipping) && selectedOrder) {
        // Pass the orderCode to get context-specific availability for shipping
        const shippingStaffData = await staffService.getAvailableStaff(
          StaffTaskType.Shipping
        );
        const availableShippingStaff = Array.isArray(shippingStaffData)
          ? shippingStaffData.filter(
              (staff) => staff.isAvailable === true && staff.isEligible === true
            )
          : [];
        // Sort the shipping staff to prioritize staff who prepared this order
        availableShippingStaff.sort((a, b) => {
          // Staff who prepared this order should be at the top
          if (a.preparedThisOrder && !b.preparedThisOrder) return -1;
          if (!a.preparedThisOrder && b.preparedThisOrder) return 1;
          // Then sort by assignment count (less busy staff first)
          return a.assignmentCount - b.assignmentCount;
        });
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

  // Estimate order size - Updated to use orderCode (string)
  const estimateOrderSize = async (orderCode: string) => {
    try {
      setEstimatingSize(true);
      const sizeData = await orderManagementService.estimateOrderSize(
        orderCode
      );
      setOrderSize(sizeData);

      // Pre-select a vehicle based on the suggested vehicle type if available
      if (vehicles.length > 0) {
        // For large orders, prioritize cars
        if (sizeData.size === OrderSize.Large) {
          // First try to find a car
          const cars = vehicles.filter((v) => v.type === VehicleType.Car);
          if (cars.length > 0) {
            setSelectedVehicleId(cars[0].vehicleId);
          } else {
            // If no cars available, select any vehicle
            setSelectedVehicleId(vehicles[0].vehicleId);
          }
        }
        // For small orders with a suggested vehicle type
        else if (sizeData.suggestedVehicleType) {
          // Try to find a vehicle of the suggested type
          const suggestedVehicles = vehicles.filter(
            (v) => v.type === sizeData.suggestedVehicleType
          );

          if (suggestedVehicles.length > 0) {
            // Select the first available vehicle of the suggested type
            setSelectedVehicleId(suggestedVehicles[0].vehicleId);
          } else {
            // If no vehicles of the suggested type are available, select any available vehicle
            setSelectedVehicleId(vehicles[0].vehicleId);
          }
        }
        // For small orders without a suggested vehicle type, prefer scooters
        else {
          const scooters = vehicles.filter(
            (v) => v.type === VehicleType.Scooter
          );
          if (scooters.length > 0) {
            setSelectedVehicleId(scooters[0].vehicleId);
          } else {
            setSelectedVehicleId(vehicles[0].vehicleId);
          }
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

  // Handle preparation staff selection
  const handlePrepStaffChange = (event: SelectChangeEvent<number>) => {
    setSelectedPrepStaffId(Number(event.target.value));
  };

  // Handle shipping staff selection
  const handleShippingStaffChange = (event: SelectChangeEvent<number>) => {
    setSelectedShippingStaffId(Number(event.target.value));
  };

  // Handle vehicle selection
  const handleVehicleChange = (event: SelectChangeEvent<number>) => {
    setSelectedVehicleId(Number(event.target.value));
  };

  // Handle allocate button click
  const handleAllocateClick = async (order: OrderWithDetailsDTO) => {
    setSelectedOrder(order);
    // Pre-select staff if already assigned
    if (order.isPreparationStaffAssigned && order.preparationAssignment) {
      setSelectedPrepStaffId(order.preparationAssignment.staffId);
    } else {
      setSelectedPrepStaffId(0);
    }
    if (order.isShippingStaffAssigned && order.shippingAssignment) {
      setSelectedShippingStaffId(order.shippingAssignment.staffId);
    } else {
      setSelectedShippingStaffId(0);
    }
    // Pre-select vehicle if already assigned
    if (order.vehicleInfo && order.vehicleInfo.vehicleId) {
      setSelectedVehicleId(order.vehicleInfo.vehicleId);
    } else {
      setSelectedVehicleId(null);
    }
    setOrderSize(null);
    // Set task types based on what's already assigned
    const taskTypes: StaffTaskType[] = [];
    if (!order.isPreparationStaffAssigned) {
      taskTypes.push(StaffTaskType.Preparation);
    }
    if (!order.isShippingStaffAssigned) {
      taskTypes.push(StaffTaskType.Shipping);
    }
    // If both are already assigned, allow reassigning both
    if (taskTypes.length === 0) {
      taskTypes.push(StaffTaskType.Preparation, StaffTaskType.Shipping);
    }
    setSelectedTaskTypes(taskTypes);
    // Open dialog first
    setOpenDialog(true);
    // Then fetch data with the specific order context
    await fetchStaffMembers();
    await fetchAvailableVehicles();
    // Estimate order size after dialog is open
    if (order.orderId) {
      estimateOrderSize(order.orderId);
    }
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setOrderSize(null);
  };

  // Handle allocate order - Updated to use orderCode (string)
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
      // Check which task types are selected
      const prepSelected =
        selectedTaskTypes.includes(StaffTaskType.Preparation) &&
        selectedPrepStaffId;
      const shippingSelected =
        selectedTaskTypes.includes(StaffTaskType.Shipping) &&
        selectedShippingStaffId;
      // If both preparation and shipping are selected, use the new endpoint
      if (prepSelected && shippingSelected) {
        const multiRequest: MultiStaffAssignmentRequest = {
          orderCode: selectedOrder.orderId,
          preparationStaffId: selectedPrepStaffId,
          shippingStaffId: selectedShippingStaffId,
          vehicleId: selectedVehicleId || undefined,
        };
        await orderManagementService.assignMultipleStaffToOrder(multiRequest);
        setSnackbar({
          open: true,
          message: `Đơn hàng #${selectedOrder.orderId} đã được phân công chuẩn bị và giao hàng thành công`,
          severity: "success",
        });
      }
      // If only preparation is selected
      else if (prepSelected) {
        const multiRequest: MultiStaffAssignmentRequest = {
          orderCode: selectedOrder.orderId,
          preparationStaffId: selectedPrepStaffId,
          shippingStaffId: 0, // Use 0 or another default value for unused staff
          vehicleId: undefined,
        };
        await orderManagementService.assignMultipleStaffToOrder(multiRequest);
        setSnackbar({
          open: true,
          message: `Đơn hàng #${selectedOrder.orderId} đã được phân công chuẩn bị thành công`,
          severity: "success",
        });
      }
      // If only shipping is selected
      else if (shippingSelected) {
        const multiRequest: MultiStaffAssignmentRequest = {
          orderCode: selectedOrder.orderId,
          preparationStaffId: 0, // Use 0 or another default value for unused staff
          shippingStaffId: selectedShippingStaffId,
          vehicleId: selectedVehicleId || undefined,
        };
        await orderManagementService.assignMultipleStaffToOrder(multiRequest);
        setSnackbar({
          open: true,
          message: `Đơn hàng #${selectedOrder.orderId} đã được phân công giao hàng thành công`,
          severity: "success",
        });
      }
      // Refresh the data after allocation
      fetchOrders();
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

  // Get filtered vehicles based on order size
  const getFilteredVehicles = () => {
    if (!orderSize) return vehicles;

    // For large orders, prioritize cars but still show scooters (with warning in the dialog)
    if (orderSize.size === OrderSize.Large) {
      // Sort vehicles to show cars first
      return [...vehicles].sort((a, b) => {
        if (a.type === VehicleType.Car && b.type !== VehicleType.Car) return -1;
        if (a.type !== VehicleType.Car && b.type === VehicleType.Car) return 1;
        return 0;
      });
    }

    // For small orders, prioritize scooters but show all vehicles
    if (orderSize.size === OrderSize.Small) {
      // Sort vehicles to show scooters first
      return [...vehicles].sort((a, b) => {
        if (a.type === VehicleType.Scooter && b.type !== VehicleType.Scooter)
          return -1;
        if (a.type !== VehicleType.Scooter && b.type === VehicleType.Scooter)
          return 1;
        return 0;
      });
    }

    return vehicles;
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
              placeholder="Tìm tên khách hàng..."
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
                          applyFilters();
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
                        Số tiền
                      </TableSortLabel>
                    </StyledHeaderCell>
                    <StyledHeaderCell>
                      <TableSortLabel
                        active={sortBy === "totalprice"}
                        direction={sortDescending ? "desc" : "asc"}
                        onClick={() => handleSortChange("totalprice")}
                      >
                        Sản phẩm
                      </TableSortLabel>
                    </StyledHeaderCell>
                    <StyledHeaderCell>Nhân viên</StyledHeaderCell>
                    <StyledHeaderCell>Trạng thái</StyledHeaderCell>
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
                        <StaffAssignmentStatus order={order} />
                      </StyledTableCell>
                      <StyledTableCell>
                        {order.shippingInfo ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 0.5,
                            }}
                          >
                            <Tooltip
                              title={`Được giao bởi ${
                                order.shippingInfo.staff?.name ||
                                "Không xác định"
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
                            <VehicleInfoDisplay order={order} />
                          </Box>
                        ) : (
                          <UnallocatedChip
                            label="Chưa phân công"
                            size="small"
                          />
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        <ActionsContainer>
                          {/* Allocate Button - Show for all orders to allow reassignment */}
                          {(order.status === OrderStatus.Pending ||
                            order.status === OrderStatus.Processing) && (
                            <Tooltip title="Phân công đơn hàng">
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleAllocateClick(order)}
                                sx={{
                                  ml: 1,
                                  borderRadius: 2,
                                  textTransform: "none",
                                  fontWeight: 600,
                                }}
                              >
                                {order.isPreparationStaffAssigned ||
                                order.isShippingStaffAssigned
                                  ? "Phân công lại"
                                  : "Phân công"}
                              </Button>
                            </Tooltip>
                          )}
                          {/* View Details Button */}
                          <Tooltip title="Xem chi tiết đơn hàng">
                            <ViewDetailsButton
                              size="small"
                              onClick={() => {
                                // Navigate to order details - using orderCode (string) now
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

      {/* Allocation Dialog */}
      <OrderAllocationDialog
        open={openDialog}
        onClose={handleCloseDialog}
        selectedOrder={selectedOrder}
        selectedTaskTypes={selectedTaskTypes}
        onTaskTypeChange={handleTaskTypeChange}
        prepStaff={prepStaff}
        shippingStaff={shippingStaff}
        selectedPrepStaffId={selectedPrepStaffId}
        selectedShippingStaffId={selectedShippingStaffId}
        onPrepStaffChange={handlePrepStaffChange}
        onShippingStaffChange={handleShippingStaffChange}
        vehicles={vehicles}
        filteredVehicles={getFilteredVehicles()}
        selectedVehicleId={selectedVehicleId}
        onVehicleChange={handleVehicleChange}
        orderSize={orderSize}
        estimatingSize={estimatingSize}
        onAllocate={handleAllocateOrder}
        allocating={allocating}
      />

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

export default OrdersByStatusList;
