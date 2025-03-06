import {
  AssignmentInd,
  CalendarMonth,
  CheckCircle,
  FilterList,
  LocalShipping,
  LocationOn,
  Person,
  Schedule,
  Search,
  Timeline,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectProps,
  Step,
  StepLabel,
  Stepper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { alpha, styled } from "@mui/material/styles";
import React, { useState } from "react";

// Define TypeScript interfaces
interface OrderItem {
  id: number;
  name: string;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  orderItems: OrderItem[];
  address: string;
  status: OrderStatus;
  assignedTo?: Staff;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryItem[];
}

interface Staff {
  id: number;
  name: string;
  avatar?: string;
  role: string;
  vehicle?: string;
  contact: string;
  availability: "Available" | "On Delivery" | "Off Duty";
  assignedOrders: number;
}

interface StatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  actor: string;
  note?: string;
}

type OrderStatus =
  | "PENDING_ASSIGNMENT"
  | "ASSIGNED"
  | "SCHEDULED"
  | "IN_PREPARATION"
  | "READY_FOR_PICKUP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  padding: theme.spacing(3),
  height: "100%",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(8px)",
  borderRadius: 16,
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 20px 0 ${alpha(theme.palette.common.black, 0.1)}`,
  },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "10px 24px",
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
  },
}));

const StyledSelect = styled(Select)<SelectProps<unknown>>(() => ({
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: 12,
  },
  "& .MuiSelect-select": {
    padding: "12px 16px",
  },
}));

const StyledStepper = styled(Stepper)(({ theme }) => ({
  "& .MuiStepLabel-root": {
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  "& .MuiStepLabel-label": {
    marginTop: theme.spacing(1),
    fontSize: "0.8rem",
  },
}));

const StatusChip = styled(Chip)<{ status: OrderStatus }>(
  ({ theme, status }) => {
    const getStatusColor = () => {
      switch (status) {
        case "PENDING_ASSIGNMENT":
          return theme.palette.info.main;
        case "ASSIGNED":
          return theme.palette.primary.main;
        case "SCHEDULED":
          return theme.palette.secondary.main;
        case "IN_PREPARATION":
          return theme.palette.warning.main;
        case "READY_FOR_PICKUP":
          return theme.palette.success.light;
        case "IN_TRANSIT":
          return theme.palette.warning.dark;
        case "DELIVERED":
          return theme.palette.success.main;
        case "CANCELLED":
          return theme.palette.error.main;
        default:
          return theme.palette.grey[500];
      }
    };

    return {
      backgroundColor: alpha(getStatusColor(), 0.1),
      color: getStatusColor(),
      borderRadius: 12,
      fontWeight: 600,
      border: `1px solid ${alpha(getStatusColor(), 0.3)}`,
      "& .MuiChip-icon": {
        color: getStatusColor(),
      },
    };
  }
);

// Mock Data
const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2024-001",
    customerName: "John Smith",
    orderItems: [
      { id: 1, name: "Large Hotpot Set", quantity: 1 },
      { id: 2, name: "Extra Cookware", quantity: 2 },
    ],
    address: "123 Main St, Apartment 4B, New York, NY 10001",
    status: "PENDING_ASSIGNMENT",
    createdAt: "2024-02-20T10:30:00Z",
    updatedAt: "2024-02-20T10:30:00Z",
    statusHistory: [
      {
        status: "PENDING_ASSIGNMENT",
        timestamp: "2024-02-20T10:30:00Z",
        actor: "System",
      },
    ],
  },
  {
    id: "ORD-2024-002",
    customerName: "Emily Johnson",
    orderItems: [
      { id: 3, name: "Medium Hotpot Set", quantity: 1 },
      { id: 4, name: "Premium Utensils", quantity: 1 },
    ],
    address: "456 Park Ave, Suite 201, Boston, MA 02108",
    status: "ASSIGNED",
    assignedTo: {
      id: 1,
      name: "David Wilson",
      role: "Delivery Staff",
      vehicle: "Truck-202",
      contact: "555-0101",
      availability: "On Delivery",
      assignedOrders: 2,
    },
    createdAt: "2024-02-19T14:15:00Z",
    updatedAt: "2024-02-19T15:20:00Z",
    statusHistory: [
      {
        status: "PENDING_ASSIGNMENT",
        timestamp: "2024-02-19T14:15:00Z",
        actor: "System",
      },
      {
        status: "ASSIGNED",
        timestamp: "2024-02-19T15:20:00Z",
        actor: "Manager",
      },
    ],
  },
  {
    id: "ORD-2024-003",
    customerName: "Michael Brown",
    orderItems: [{ id: 5, name: "Small Hotpot Set", quantity: 1 }],
    address: "789 Oak St, Chicago, IL 60601",
    status: "SCHEDULED",
    assignedTo: {
      id: 3,
      name: "Sarah Johnson",
      role: "Delivery Staff",
      vehicle: "Van-305",
      contact: "555-0102",
      availability: "On Delivery",
      assignedOrders: 3,
    },
    scheduledDate: "2024-02-25",
    scheduledTime: "14:00",
    createdAt: "2024-02-18T09:45:00Z",
    updatedAt: "2024-02-18T11:30:00Z",
    statusHistory: [
      {
        status: "PENDING_ASSIGNMENT",
        timestamp: "2024-02-18T09:45:00Z",
        actor: "System",
      },
      {
        status: "ASSIGNED",
        timestamp: "2024-02-18T10:30:00Z",
        actor: "Manager",
      },
      {
        status: "SCHEDULED",
        timestamp: "2024-02-18T11:30:00Z",
        actor: "Sarah Johnson",
      },
    ],
  },
  {
    id: "ORD-2024-004",
    customerName: "Jessica Lee",
    orderItems: [
      { id: 6, name: "Large Hotpot Set", quantity: 1 },
      { id: 7, name: "Deluxe Cookware", quantity: 1 },
      { id: 8, name: "Premium Utensils", quantity: 2 },
    ],
    address: "321 Pine St, San Francisco, CA 94101",
    status: "IN_TRANSIT",
    assignedTo: {
      id: 2,
      name: "Robert Chen",
      role: "Delivery Staff",
      vehicle: "Truck-203",
      contact: "555-0103",
      availability: "On Delivery",
      assignedOrders: 1,
    },
    scheduledDate: "2024-02-22",
    scheduledTime: "16:30",
    createdAt: "2024-02-21T13:20:00Z",
    updatedAt: "2024-02-22T16:45:00Z",
    statusHistory: [
      {
        status: "PENDING_ASSIGNMENT",
        timestamp: "2024-02-21T13:20:00Z",
        actor: "System",
      },
      {
        status: "ASSIGNED",
        timestamp: "2024-02-21T14:15:00Z",
        actor: "Manager",
      },
      {
        status: "SCHEDULED",
        timestamp: "2024-02-21T15:00:00Z",
        actor: "Robert Chen",
      },
      {
        status: "IN_PREPARATION",
        timestamp: "2024-02-22T14:30:00Z",
        actor: "Warehouse Staff",
      },
      {
        status: "READY_FOR_PICKUP",
        timestamp: "2024-02-22T16:00:00Z",
        actor: "Warehouse Staff",
      },
      {
        status: "IN_TRANSIT",
        timestamp: "2024-02-22T16:45:00Z",
        actor: "Robert Chen",
      },
    ],
  },
  {
    id: "ORD-2024-005",
    customerName: "Daniel Martinez",
    orderItems: [{ id: 9, name: "Medium Hotpot Set", quantity: 1 }],
    address: "555 Maple Ave, Seattle, WA 98101",
    status: "DELIVERED",
    assignedTo: {
      id: 1,
      name: "David Wilson",
      role: "Delivery Staff",
      vehicle: "Truck-202",
      contact: "555-0101",
      availability: "Available",
      assignedOrders: 2,
    },
    scheduledDate: "2024-02-21",
    scheduledTime: "13:00",
    createdAt: "2024-02-20T11:00:00Z",
    updatedAt: "2024-02-21T13:45:00Z",
    statusHistory: [
      {
        status: "PENDING_ASSIGNMENT",
        timestamp: "2024-02-20T11:00:00Z",
        actor: "System",
      },
      {
        status: "ASSIGNED",
        timestamp: "2024-02-20T11:30:00Z",
        actor: "Manager",
      },
      {
        status: "SCHEDULED",
        timestamp: "2024-02-20T12:15:00Z",
        actor: "David Wilson",
      },
      {
        status: "IN_PREPARATION",
        timestamp: "2024-02-21T10:00:00Z",
        actor: "Warehouse Staff",
      },
      {
        status: "READY_FOR_PICKUP",
        timestamp: "2024-02-21T11:30:00Z",
        actor: "Warehouse Staff",
      },
      {
        status: "IN_TRANSIT",
        timestamp: "2024-02-21T12:00:00Z",
        actor: "David Wilson",
      },
      {
        status: "DELIVERED",
        timestamp: "2024-02-21T13:45:00Z",
        actor: "David Wilson",
        note: "Customer confirmed receipt",
      },
    ],
  },
];

const MOCK_STAFF: Staff[] = [
  {
    id: 1,
    name: "David Wilson",
    role: "Delivery Staff",
    vehicle: "Truck-202",
    contact: "555-0101",
    availability: "Available",
    assignedOrders: 2,
  },
  {
    id: 2,
    name: "Robert Chen",
    role: "Delivery Staff",
    vehicle: "Truck-203",
    contact: "555-0103",
    availability: "On Delivery",
    assignedOrders: 1,
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Delivery Staff",
    vehicle: "Van-305",
    contact: "555-0102",
    availability: "On Delivery",
    assignedOrders: 3,
  },
  {
    id: 4,
    name: "Lisa Thompson",
    role: "Delivery Staff",
    vehicle: "Truck-204",
    contact: "555-0104",
    availability: "Available",
    assignedOrders: 0,
  },
  {
    id: 5,
    name: "James Rodriguez",
    role: "Delivery Staff",
    vehicle: "Van-306",
    contact: "555-0105",
    availability: "Available",
    assignedOrders: 1,
  },
];

// Helper functions
const getStatusIcon = (status: OrderStatus): React.ReactElement => {
  switch (status) {
    case "PENDING_ASSIGNMENT":
      return <AssignmentInd />;
    case "ASSIGNED":
      return <Person />;
    case "SCHEDULED":
      return <Schedule />;
    case "IN_PREPARATION":
      return <Timeline />;
    case "READY_FOR_PICKUP":
      return <LocalShipping />;
    case "IN_TRANSIT":
      return <LocalShipping />;
    case "DELIVERED":
      return <CheckCircle />;
    case "CANCELLED":
      return <Schedule />;
    default:
      return <AssignmentInd />;
  }
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const ManageOrder: React.FC = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<number | "">("");
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [statusNote, setStatusNote] = useState("");

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle order selection
  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
  };

  const statusSteps: OrderStatus[] = [
    "PENDING_ASSIGNMENT",
    "ASSIGNED",
    "SCHEDULED",
    "IN_PREPARATION",
    "READY_FOR_PICKUP",
    "IN_TRANSIT",
    "DELIVERED",
  ];

  // Handle staff assignment
  const handleAssignStaff = () => {
    if (selectedOrder && selectedStaff !== "") {
      const staffMember = staff.find((s) => s.id === selectedStaff);

      if (staffMember) {
        // Update order with proper type casting
        const updatedOrders = orders.map((order) => {
          if (order.id === selectedOrder.id) {
            const newStatusHistoryItem: StatusHistoryItem = {
              status: "ASSIGNED",
              timestamp: new Date().toISOString(),
              actor: "Manager",
              note: `Assigned to ${staffMember.name}`,
            };

            return {
              ...order,
              status: "ASSIGNED" as OrderStatus,
              assignedTo: staffMember,
              updatedAt: new Date().toISOString(),
              statusHistory: [...order.statusHistory, newStatusHistoryItem],
            };
          }
          return order;
        });

        // Update staff availability
        const updatedStaff = staff.map((s) => {
          if (s.id === selectedStaff) {
            return {
              ...s,
              assignedOrders: s.assignedOrders + 1,
              availability:
                s.assignedOrders + 1 > 2
                  ? ("On Delivery" as const)
                  : ("Available" as const),
            };
          }
          return s;
        });

        setOrders(updatedOrders);
        setStaff(updatedStaff);
        setSelectedOrder(
          updatedOrders.find((o) => o.id === selectedOrder.id) || null
        );
        setAssignDialogOpen(false);
        setSelectedStaff("");
      }
    }
  };

  // Handle schedule delivery
  const handleScheduleDelivery = () => {
    if (selectedOrder && deliveryDate && deliveryTime) {
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder.id) {
          const newStatusHistoryItem: StatusHistoryItem = {
            status: "SCHEDULED",
            timestamp: new Date().toISOString(),
            actor: order.assignedTo?.name || "System",
            note: `Scheduled for ${deliveryDate} at ${deliveryTime}`,
          };

          return {
            ...order,
            status: "SCHEDULED" as OrderStatus,
            scheduledDate: deliveryDate,
            scheduledTime: deliveryTime,
            updatedAt: new Date().toISOString(),
            statusHistory: [...order.statusHistory, newStatusHistoryItem],
          };
        }
        return order;
      });

      setOrders(updatedOrders);
      setSelectedOrder(
        updatedOrders.find((o) => o.id === selectedOrder.id) || null
      );
      setScheduleDialogOpen(false);
      setDeliveryDate("");
      setDeliveryTime("");
    }
  };

  // Handle status update
  const handleStatusUpdate = () => {
    if (selectedOrder && newStatus) {
      const updatedOrders = orders.map((order) => {
        if (order.id === selectedOrder.id) {
          const newStatusHistoryItem: StatusHistoryItem = {
            status: newStatus as OrderStatus,
            timestamp: new Date().toISOString(),
            actor: order.assignedTo?.name || "Manager",
            note: statusNote,
          };

          return {
            ...order,
            status: newStatus as OrderStatus,
            updatedAt: new Date().toISOString(),
            statusHistory: [...order.statusHistory, newStatusHistoryItem],
          };
        }
        return order;
      });

      setOrders(updatedOrders);
      setSelectedOrder(
        updatedOrders.find((o) => o.id === selectedOrder.id) || null
      );
      setUpdateStatusDialogOpen(false);
      setNewStatus("");
      setStatusNote("");
    }
  };

  // Get available next statuses based on current status
  const getAvailableNextStatuses = (
    currentStatus: OrderStatus
  ): OrderStatus[] => {
    switch (currentStatus) {
      case "PENDING_ASSIGNMENT":
        return ["ASSIGNED"];
      case "ASSIGNED":
        return ["SCHEDULED", "CANCELLED"];
      case "SCHEDULED":
        return ["IN_PREPARATION", "CANCELLED"];
      case "IN_PREPARATION":
        return ["READY_FOR_PICKUP", "CANCELLED"];
      case "READY_FOR_PICKUP":
        return ["IN_TRANSIT"];
      case "IN_TRANSIT":
        return ["DELIVERED"];
      case "DELIVERED":
        return [];
      case "CANCELLED":
        return ["PENDING_ASSIGNMENT"];
      default:
        return [];
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 3,
          display: "flex",
          alignItems: "center",
          gap: 1,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <LocalShipping sx={{ mr: 1 }} />
        Quản lý Đơn hàng
      </Typography>

      <Grid container spacing={3}>
        {/* Order List */}
        <Grid size={{ xs: 12, md: 5 }}>
          <StyledPaper>
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
              <StyledTextField
                placeholder="Tìm kiếm đơn hàng..."
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Trạng thái</InputLabel>
                <StyledSelect
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(event) =>
                    setStatusFilter(event.target.value as OrderStatus | "ALL")
                  }
                >
                  <MenuItem value="ALL">Tất cả</MenuItem>
                  <MenuItem value="PENDING_ASSIGNMENT">Chờ phân công</MenuItem>
                  <MenuItem value="ASSIGNED">Đã phân công</MenuItem>
                  <MenuItem value="SCHEDULED">Đã lên lịch</MenuItem>
                  <MenuItem value="IN_PREPARATION">Đang chuẩn bị</MenuItem>
                  <MenuItem value="READY_FOR_PICKUP">
                    Sẵn sàng lấy hàng
                  </MenuItem>
                  <MenuItem value="IN_TRANSIT">Đang giao</MenuItem>
                  <MenuItem value="DELIVERED">Đã giao</MenuItem>
                  <MenuItem value="CANCELLED">Đã hủy</MenuItem>
                </StyledSelect>
              </FormControl>
              <IconButton>
                <FilterList />
              </IconButton>
            </Box>

            <List sx={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <ListItemButton
                    key={order.id}
                    selected={selectedOrder?.id === order.id}
                    onClick={() => handleOrderSelect(order)}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 4px 12px ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}`,
                      },
                      "&.Mui-selected": {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        "&:hover": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.15
                          ),
                        },
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {order.id}
                          </Typography>
                          <StatusChip
                            status={order.status}
                            label={order.status.split("_").join(" ")}
                            size="small"
                            icon={getStatusIcon(order.status)}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {order.customerName}
                          </Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            color="text.secondary"
                          >
                            {order.orderItems.length} sản phẩm • Cập nhật:{" "}
                            {formatDate(order.updatedAt)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItemButton>
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Không tìm thấy đơn hàng nào
                  </Typography>
                </Box>
              )}
            </List>
          </StyledPaper>
        </Grid>

        {/* Order Details */}
        <Grid size={{ xs: 12, md: 7 }}>
          <StyledPaper>
            {selectedOrder ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    Chi tiết đơn hàng #{selectedOrder.id}
                  </Typography>
                  <StatusChip
                    status={selectedOrder.status}
                    label={selectedOrder.status.split("_").join(" ")}
                    icon={getStatusIcon(selectedOrder.status)}
                  />
                </Box>

                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
                >
                  <Tab
                    label="Thông tin"
                    icon={<Person />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Lịch sử trạng thái"
                    icon={<Timeline />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Quản lý giao hàng"
                    icon={<LocalShipping />}
                    iconPosition="start"
                  />
                </Tabs>

                {/* Tab 1: Order Information */}
                {tabValue === 0 && (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledCard variant="outlined" sx={{ p: 2, mb: 2 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                          >
                            Thông tin khách hàng
                          </Typography>
                          <Typography variant="body1">
                            {selectedOrder.customerName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            <LocationOn
                              fontSize="small"
                              sx={{ verticalAlign: "middle", mr: 0.5 }}
                            />
                            {selectedOrder.address}
                          </Typography>
                        </StyledCard>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledCard variant="outlined" sx={{ p: 2, mb: 2 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                          >
                            Thông tin đơn hàng
                          </Typography>
                          <Typography variant="body2">
                            Ngày tạo: {formatDate(selectedOrder.createdAt)}
                          </Typography>
                          <Typography variant="body2">
                            Cập nhật: {formatDate(selectedOrder.updatedAt)}
                          </Typography>
                          {selectedOrder.scheduledDate &&
                            selectedOrder.scheduledTime && (
                              <Typography
                                variant="body2"
                                sx={{
                                  mt: 1,
                                  color: "primary.main",
                                  fontWeight: "medium",
                                }}
                              >
                                <CalendarMonth
                                  fontSize="small"
                                  sx={{ verticalAlign: "middle", mr: 0.5 }}
                                />
                                Lịch giao hàng: {selectedOrder.scheduledDate}{" "}
                                lúc {selectedOrder.scheduledTime}
                              </Typography>
                            )}
                        </StyledCard>
                      </Grid>
                    </Grid>

                    <StyledCard variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Danh sách sản phẩm
                      </Typography>
                      <List>
                        {selectedOrder.orderItems.map((item) => (
                          <ListItem key={item.id} divider>
                            <ListItemText
                              primary={item.name}
                              secondary={`Số lượng: ${item.quantity}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </StyledCard>

                    {selectedOrder.assignedTo && (
                      <StyledCard variant="outlined" sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Nhân viên giao hàng
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                            {selectedOrder.assignedTo.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1">
                              {selectedOrder.assignedTo.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedOrder.assignedTo.vehicle} •{" "}
                              {selectedOrder.assignedTo.contact}
                            </Typography>
                          </Box>
                          <Chip
                            label={selectedOrder.assignedTo.availability}
                            color={
                              selectedOrder.assignedTo.availability ===
                              "Available"
                                ? "success"
                                : selectedOrder.assignedTo.availability ===
                                  "On Delivery"
                                ? "warning"
                                : "error"
                            }
                            size="small"
                            sx={{ ml: "auto" }}
                          />
                        </Box>
                      </StyledCard>
                    )}
                  </Box>
                )}

                {/* Tab 2: Status History */}
                {tabValue === 1 && (
                  <Box>
                    <StyledStepper
                      activeStep={statusSteps.indexOf(selectedOrder.status)}
                      alternativeLabel
                      sx={{ mb: 4 }}
                    >
                      {[
                        "PENDING_ASSIGNMENT",
                        "ASSIGNED",
                        "SCHEDULED",
                        "IN_PREPARATION",
                        "READY_FOR_PICKUP",
                        "IN_TRANSIT",
                        "DELIVERED",
                      ].map((label) => (
                        <Step
                          key={label}
                          completed={
                            statusSteps.indexOf(selectedOrder.status) >=
                            statusSteps.indexOf(label as OrderStatus)
                          }
                        >
                          <StepLabel>{label.split("_").join(" ")}</StepLabel>
                        </Step>
                      ))}
                    </StyledStepper>

                    <StyledCard variant="outlined" sx={{ p: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Lịch sử trạng thái
                      </Typography>
                      <List>
                        {selectedOrder.statusHistory.map((history, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              borderLeft: `3px solid ${
                                history.status === "DELIVERED"
                                  ? theme.palette.success.main
                                  : history.status === "CANCELLED"
                                  ? theme.palette.error.main
                                  : theme.palette.primary.main
                              }`,
                              mb: 1,
                              borderRadius: "0 8px 8px 0",
                              bgcolor: alpha(
                                theme.palette.background.paper,
                                0.6
                              ),
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar
                                sx={{
                                  bgcolor: alpha(
                                    theme.palette.primary.main,
                                    0.1
                                  ),
                                  color: theme.palette.primary.main,
                                }}
                              >
                                {getStatusIcon(history.status)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="body1" fontWeight="medium">
                                  {history.status.split("_").join(" ")}
                                </Typography>
                              }
                              secondary={
                                <>
                                  <Typography variant="caption" display="block">
                                    {formatDate(history.timestamp)} •{" "}
                                    {history.actor}
                                  </Typography>
                                  {history.note && (
                                    <Typography
                                      variant="body2"
                                      sx={{ mt: 0.5 }}
                                    >
                                      {history.note}
                                    </Typography>
                                  )}
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </StyledCard>
                  </Box>
                )}

                {/* Tab 3: Delivery Management */}
                {tabValue === 2 && (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledCard variant="outlined" sx={{ p: 2, mb: 2 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                          >
                            Thông tin giao hàng
                          </Typography>

                          {selectedOrder.scheduledDate &&
                          selectedOrder.scheduledTime ? (
                            <>
                              <Typography variant="body2">
                                <CalendarMonth
                                  fontSize="small"
                                  sx={{ verticalAlign: "middle", mr: 0.5 }}
                                />
                                Ngày giao: {selectedOrder.scheduledDate}
                              </Typography>
                              <Typography variant="body2">
                                <Schedule
                                  fontSize="small"
                                  sx={{ verticalAlign: "middle", mr: 0.5 }}
                                />
                                Giờ giao: {selectedOrder.scheduledTime}
                              </Typography>
                            </>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Chưa lên lịch giao hàng
                            </Typography>
                          )}

                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <LocationOn
                              fontSize="small"
                              sx={{ verticalAlign: "middle", mr: 0.5 }}
                            />
                            Địa chỉ: {selectedOrder.address}
                          </Typography>
                        </StyledCard>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <StyledCard variant="outlined" sx={{ p: 2, mb: 2 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                          >
                            Nhân viên giao hàng
                          </Typography>

                          {selectedOrder.assignedTo ? (
                            <>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Avatar
                                  sx={{ bgcolor: theme.palette.primary.main }}
                                >
                                  {selectedOrder.assignedTo.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body1">
                                    {selectedOrder.assignedTo.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {selectedOrder.assignedTo.vehicle} •{" "}
                                    {selectedOrder.assignedTo.contact}
                                  </Typography>
                                </Box>
                              </Box>
                            </>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Chưa phân công nhân viên
                            </Typography>
                          )}
                        </StyledCard>
                      </Grid>
                    </Grid>

                    <StyledCard variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        gutterBottom
                      >
                        Quản lý trạng thái
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          mt: 2,
                        }}
                      >
                        {!selectedOrder.assignedTo && (
                          <AnimatedButton
                            variant="contained"
                            color="primary"
                            startIcon={<AssignmentInd />}
                            onClick={() => setAssignDialogOpen(true)}
                          >
                            Phân công nhân viên
                          </AnimatedButton>
                        )}

                        {selectedOrder.assignedTo &&
                          !selectedOrder.scheduledDate && (
                            <AnimatedButton
                              variant="contained"
                              color="secondary"
                              startIcon={<Schedule />}
                              onClick={() => setScheduleDialogOpen(true)}
                            >
                              Lên lịch giao hàng
                            </AnimatedButton>
                          )}

                        {getAvailableNextStatuses(selectedOrder.status).length >
                          0 && (
                          <AnimatedButton
                            variant="contained"
                            color="info"
                            startIcon={<Timeline />}
                            onClick={() => setUpdateStatusDialogOpen(true)}
                          >
                            Cập nhật trạng thái
                          </AnimatedButton>
                        )}
                      </Box>
                    </StyledCard>

                    {selectedOrder.status === "IN_TRANSIT" && (
                      <StyledCard variant="outlined" sx={{ p: 2 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Theo dõi giao hàng
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Typography variant="body2">
                            Đang giao hàng...
                          </Typography>
                          <Chip
                            label="Đang giao"
                            color="warning"
                            icon={<LocalShipping fontSize="small" />}
                          />
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={70}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            mb: 2,
                            bgcolor: alpha(theme.palette.grey[300], 0.5),
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 5,
                              background: `linear-gradient(90deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
                            },
                          }}
                        />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Đã rời kho
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Đang giao
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Đã giao
                          </Typography>
                        </Box>
                      </StyledCard>
                    )}
                  </Box>
                )}

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 3,
                    gap: 2,
                  }}
                >
                  {selectedOrder.status === "PENDING_ASSIGNMENT" && (
                    <AnimatedButton
                      variant="contained"
                      color="primary"
                      startIcon={<AssignmentInd />}
                      onClick={() => setAssignDialogOpen(true)}
                    >
                      Phân công nhân viên
                    </AnimatedButton>
                  )}

                  {selectedOrder.status === "ASSIGNED" && (
                    <AnimatedButton
                      variant="contained"
                      color="secondary"
                      startIcon={<Schedule />}
                      onClick={() => setScheduleDialogOpen(true)}
                    >
                      Lên lịch giao hàng
                    </AnimatedButton>
                  )}

                  {getAvailableNextStatuses(selectedOrder.status).length >
                    0 && (
                    <AnimatedButton
                      variant="contained"
                      color="info"
                      startIcon={<Timeline />}
                      onClick={() => setUpdateStatusDialogOpen(true)}
                    >
                      Cập nhật trạng thái
                    </AnimatedButton>
                  )}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 8,
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Chọn một đơn hàng để xem chi tiết
                </Typography>
                <LocalShipping
                  sx={{
                    fontSize: 60,
                    color: alpha(theme.palette.primary.main, 0.3),
                    my: 2,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Thông tin chi tiết sẽ hiển thị ở đây
                </Typography>
              </Box>
            )}
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Assign Staff Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Phân công nhân viên giao hàng
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Chọn nhân viên giao hàng cho đơn hàng #{selectedOrder?.id}
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Chọn nhân viên</InputLabel>
            <StyledSelect
              value={selectedStaff}
              label="Chọn nhân viên"
              onChange={(event) => setSelectedStaff(Number(event.target.value))}
            >
              {staff.map((s) => (
                <MenuItem
                  key={s.id}
                  value={s.id}
                  disabled={s.availability === "Off Duty"}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Avatar sx={{ mr: 2 }}>{s.name.charAt(0)}</Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1">{s.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {s.vehicle} • {s.assignedOrders} đơn hàng
                      </Typography>
                    </Box>
                    <Chip
                      label={s.availability}
                      size="small"
                      color={
                        s.availability === "Available"
                          ? "success"
                          : s.availability === "On Delivery"
                          ? "warning"
                          : "error"
                      }
                    />
                  </Box>
                </MenuItem>
              ))}
            </StyledSelect>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setAssignDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <AnimatedButton
            onClick={handleAssignStaff}
            variant="contained"
            color="primary"
            disabled={selectedStaff === ""}
          >
            Xác nhận
          </AnimatedButton>
        </DialogActions>
      </Dialog>

      {/* Schedule Delivery Dialog */}
      <Dialog
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Lên lịch giao hàng
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Đặt lịch giao hàng cho đơn hàng #{selectedOrder?.id}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                type="date"
                label="Ngày giao hàng"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                type="time"
                label="Giờ giao hàng"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          <StyledTextField
            fullWidth
            multiline
            rows={3}
            label="Địa chỉ giao hàng"
            value={selectedOrder?.address || ""}
            sx={{ mt: 2 }}
            InputProps={{
              readOnly: true,
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setScheduleDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <AnimatedButton
            onClick={handleScheduleDelivery}
            variant="contained"
            color="primary"
            disabled={!deliveryDate || !deliveryTime}
          >
            Xác nhận
          </AnimatedButton>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog
        open={updateStatusDialogOpen}
        onClose={() => setUpdateStatusDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Cập nhật trạng thái đơn hàng
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Cập nhật trạng thái cho đơn hàng #{selectedOrder?.id}
          </Typography>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Trạng thái mới</InputLabel>
            <StyledSelect
              value={newStatus}
              label="Trạng thái mới"
              onChange={(event) =>
                setNewStatus(event.target.value as OrderStatus)
              }
            >
              {selectedOrder &&
                getAvailableNextStatuses(selectedOrder.status).map((status) => (
                  <MenuItem key={status} value={status}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        sx={{
                          mr: 2,
                          bgcolor: alpha(
                            status === "DELIVERED"
                              ? theme.palette.success.main
                              : status === "CANCELLED"
                              ? theme.palette.error.main
                              : theme.palette.primary.main,
                            0.1
                          ),
                          color:
                            status === "DELIVERED"
                              ? theme.palette.success.main
                              : status === "CANCELLED"
                              ? theme.palette.error.main
                              : theme.palette.primary.main,
                        }}
                      >
                        {getStatusIcon(status)}
                      </Avatar>
                      {status.split("_").join(" ")}
                    </Box>
                  </MenuItem>
                ))}
            </StyledSelect>
          </FormControl>

          <StyledTextField
            fullWidth
            multiline
            rows={3}
            label="Ghi chú (tùy chọn)"
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setUpdateStatusDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Hủy
          </Button>
          <AnimatedButton
            onClick={handleStatusUpdate}
            variant="contained"
            color="primary"
            disabled={!newStatus}
          >
            Cập nhật
          </AnimatedButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageOrder;
