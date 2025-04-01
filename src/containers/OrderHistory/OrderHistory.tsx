import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import StorefrontIcon from "@mui/icons-material/Storefront";
import {
  Box,
  Button,
  Chip,
  Collapse,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { alpha, styled } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format } from "date-fns";
import React, { useMemo, useState } from "react";

// Enhanced interfaces
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  orderDate: Date;
  status: "Pending" | "Completed" | "Cancelled" | "Processing";
  type: "Delivery" | "Pickup";
  items?: OrderItem[];
  total: number;
  paymentMethod?: string;
  address?: string;
  notes?: string;
}

// Styled components
const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
  },
}));

const StatusChip = styled(Chip)<{ status: Order["status"] }>(
  ({ theme, status }) => ({
    borderRadius: 8,
    fontWeight: 600,
    "& .MuiChip-icon": {
      marginLeft: 4,
    },
    ...(status === "Completed" && {
      backgroundColor: alpha(theme.palette.success.main, 0.1),
      color: theme.palette.success.main,
      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
    }),
    ...(status === "Pending" && {
      backgroundColor: alpha(theme.palette.warning.main, 0.1),
      color: theme.palette.warning.main,
      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
    }),
    ...(status === "Processing" && {
      backgroundColor: alpha(theme.palette.info.main, 0.1),
      color: theme.palette.info.main,
      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
    }),
    ...(status === "Cancelled" && {
      backgroundColor: alpha(theme.palette.error.main, 0.1),
      color: theme.palette.error.main,
      border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
    }),
  })
);

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  "&.expanded": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  padding: theme.spacing(1.5),
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  "& .MuiTableCell-head": {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  },
}));

// Enhanced fake data
const fakeOrders: Order[] = [
  {
    id: "ORD001",
    customerName: "John Doe",
    customerEmail: "john.doe@example.com",
    customerPhone: "123-456-7890",
    orderDate: new Date("2024-03-15"),
    status: "Completed",
    type: "Delivery",
    items: [
      { name: "Product A", quantity: 2, price: 25.99 },
      { name: "Product B", quantity: 1, price: 34.5 },
    ],
    total: 86.48,
    paymentMethod: "Credit Card",
    address: "123 Main St, Anytown, CA 12345",
    notes: "Please leave at the front door",
  },
  {
    id: "ORD002",
    customerName: "Jane Smith",
    customerEmail: "jane.smith@example.com",
    customerPhone: "234-567-8901",
    orderDate: new Date("2024-03-16"),
    status: "Pending",
    type: "Pickup",
    items: [
      { name: "Product C", quantity: 3, price: 15.99 },
      { name: "Product D", quantity: 2, price: 12.5 },
    ],
    total: 72.97,
    paymentMethod: "PayPal",
    notes: "Will pick up after 5 PM",
  },
  {
    id: "ORD003",
    customerName: "Robert Johnson",
    customerEmail: "robert.j@example.com",
    customerPhone: "345-678-9012",
    orderDate: new Date("2024-03-14"),
    status: "Processing",
    type: "Delivery",
    items: [{ name: "Product E", quantity: 1, price: 99.99 }],
    total: 99.99,
    paymentMethod: "Credit Card",
    address: "456 Oak Ave, Somewhere, NY 67890",
  },
  {
    id: "ORD004",
    customerName: "Emily Davis",
    customerEmail: "emily.d@example.com",
    customerPhone: "456-789-0123",
    orderDate: new Date("2024-03-13"),
    status: "Cancelled",
    type: "Delivery",
    items: [
      { name: "Product F", quantity: 2, price: 45.0 },
      { name: "Product G", quantity: 1, price: 29.99 },
    ],
    total: 119.99,
    paymentMethod: "Debit Card",
    address: "789 Pine St, Nowhere, TX 54321",
    notes: "Customer requested cancellation",
  },
  {
    id: "ORD005",
    customerName: "Michael Wilson",
    customerEmail: "michael.w@example.com",
    customerPhone: "567-890-1234",
    orderDate: new Date("2024-03-17"),
    status: "Pending",
    type: "Pickup",
    items: [
      { name: "Product H", quantity: 4, price: 8.99 },
      { name: "Product I", quantity: 2, price: 12.5 },
      { name: "Product J", quantity: 1, price: 19.99 },
    ],
    total: 71.95,
    paymentMethod: "Cash",
    notes: "Will pick up tomorrow morning",
  },
];

// A custom status chip component
const OrderStatusChip = ({ status }: { status: Order["status"] }) => {
  return <StatusChip status={status} label={status} size="small" />;
};

// Order type icon component
const OrderTypeIcon = ({ type }: { type: Order["type"] }) => {
  const theme = useTheme();
  return (
    <Tooltip title={type}>
      {type === "Delivery" ? (
        <LocalShippingIcon
          fontSize="small"
          sx={{ color: theme.palette.primary.main }}
        />
      ) : (
        <StorefrontIcon
          fontSize="small"
          sx={{ color: theme.palette.secondary.main }}
        />
      )}
    </Tooltip>
  );
};

type SortDirection = "asc" | "desc";
type SortField = keyof Order | "";

const OrderHistory: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [sortField, setSortField] = useState<SortField>("orderDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Calculate order statistics
  const orderStats = useMemo(() => {
    return {
      total: fakeOrders.length,
      completed: fakeOrders.filter((order) => order.status === "Completed")
        .length,
      pending: fakeOrders.filter((order) => order.status === "Pending").length,
      processing: fakeOrders.filter((order) => order.status === "Processing")
        .length,
      cancelled: fakeOrders.filter((order) => order.status === "Cancelled")
        .length,
      delivery: fakeOrders.filter((order) => order.type === "Delivery").length,
      pickup: fakeOrders.filter((order) => order.type === "Pickup").length,
      totalRevenue: fakeOrders.reduce((sum, order) => sum + order.total, 0),
    };
  }, []);

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    // First filter the orders
    const filtered = fakeOrders.filter((order) => {
      const dateMatch =
        !selectedDate ||
        order.orderDate.toDateString() === selectedDate.toDateString();
      const statusMatch =
        selectedStatus === "all" || order.status === selectedStatus;
      const typeMatch = selectedType === "all" || order.type === selectedType;
      const searchMatch =
        !searchQuery ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customerEmail &&
          order.customerEmail
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      return dateMatch && statusMatch && typeMatch && searchMatch;
    });

    // Then sort the filtered orders
    if (sortField) {
      return [...filtered].sort((a, b) => {
        if (sortField === "orderDate") {
          return sortDirection === "asc"
            ? a.orderDate.getTime() - b.orderDate.getTime()
            : b.orderDate.getTime() - a.orderDate.getTime();
        }

        if (sortField === "total") {
          return sortDirection === "asc"
            ? a.total - b.total
            : b.total - a.total;
        }

        const aValue = a[sortField] as string;
        const bValue = b[sortField] as string;

        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }

    return filtered;
  }, [
    selectedDate,
    selectedStatus,
    selectedType,
    searchQuery,
    sortField,
    sortDirection,
  ]);

  // Paginate the orders
  const paginatedOrders = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredAndSortedOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredAndSortedOrders, page, rowsPerPage]);

  // Handle order expansion
  const handleExpandOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Handle sort request
  const handleRequestSort = (field: SortField) => {
    const isAsc = sortField === field && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortField(field);
  };

  // Handle page change
  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Header with title and toggle filters button */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          mb={3}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Order History
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage all customer orders
            </Typography>
          </Box>

          {isMobile && (
            <AnimatedButton
              variant="outlined"
              startIcon={<FilterAltIcon />}
              onClick={() => setShowFilters(!showFilters)}
              size="small"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </AnimatedButton>
          )}
        </Stack>
        {/* Search and Filters */}
        <Collapse in={showFilters}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
            }}
          >
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Filter Orders
            </Typography>

            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <StyledTextField
                  fullWidth
                  size="small"
                  placeholder="Search by order ID or customer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <DatePicker
                  label="Filter by Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
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
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StyledTextField
                  select
                  label="Filter by Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="Pending">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StatusChip
                        status="Pending"
                        label="Pending"
                        size="small"
                      />
                      <Typography variant="body2">Pending</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Processing">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StatusChip
                        status="Processing"
                        label="Processing"
                        size="small"
                      />
                      <Typography variant="body2">Processing</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Completed">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StatusChip
                        status="Completed"
                        label="Completed"
                        size="small"
                      />
                      <Typography variant="body2">Completed</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Cancelled">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StatusChip
                        status="Cancelled"
                        label="Cancelled"
                        size="small"
                      />
                      <Typography variant="body2">Cancelled</Typography>
                    </Stack>
                  </MenuItem>
                </StyledTextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <StyledTextField
                  select
                  label="Filter by Type"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="Delivery">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <DeliveryDiningIcon fontSize="small" color="primary" />
                      <Typography variant="body2">Delivery</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem value="Pickup">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StorefrontIcon fontSize="small" color="secondary" />
                      <Typography variant="body2">Pickup</Typography>
                    </Stack>
                  </MenuItem>
                </StyledTextField>
              </Grid>
            </Grid>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ mt: 2 }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedStatus("all");
                  setSelectedType("all");
                  setSearchQuery("");
                }}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                }}
              >
                Clear Filters
              </Button>
              <AnimatedButton
                variant="contained"
                size="small"
                startIcon={<FilterAltIcon />}
              >
                Apply Filters
              </AnimatedButton>
            </Stack>
          </Paper>
        </Collapse>

        {/* Orders Table */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            borderRadius: 2,
            overflow: "hidden",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <StyledTableHead>
                <TableRow>
                  <StyledTableCell>
                    <TableSortLabel
                      active={sortField === "id"}
                      direction={sortField === "id" ? sortDirection : "asc"}
                      onClick={() => handleRequestSort("id")}
                    >
                      Order ID
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TableSortLabel
                      active={sortField === "customerName"}
                      direction={
                        sortField === "customerName" ? sortDirection : "asc"
                      }
                      onClick={() => handleRequestSort("customerName")}
                    >
                      Customer
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TableSortLabel
                      active={sortField === "orderDate"}
                      direction={
                        sortField === "orderDate" ? sortDirection : "asc"
                      }
                      onClick={() => handleRequestSort("orderDate")}
                    >
                      Order Date
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TableSortLabel
                      active={sortField === "type"}
                      direction={sortField === "type" ? sortDirection : "asc"}
                      onClick={() => handleRequestSort("type")}
                    >
                      Type
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TableSortLabel
                      active={sortField === "status"}
                      direction={sortField === "status" ? sortDirection : "asc"}
                      onClick={() => handleRequestSort("status")}
                    >
                      Status
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell>
                    <TableSortLabel
                      active={sortField === "total"}
                      direction={sortField === "total" ? sortDirection : "asc"}
                      onClick={() => handleRequestSort("total")}
                    >
                      Total
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <StyledTableRow
                      className={expandedOrderId === order.id ? "expanded" : ""}
                      onClick={() => handleExpandOrder(order.id)}
                      sx={{ cursor: "pointer" }}
                    >
                      <StyledTableCell>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color="primary"
                        >
                          {order.id}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Tooltip
                          title={`${order.customerEmail || ""}\n${
                            order.customerPhone || ""
                          }`}
                        >
                          <Typography variant="body2">
                            {order.customerName}
                          </Typography>
                        </Tooltip>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarMonthIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {format(new Date(order.orderDate), "MMM dd, yyyy")}
                          </Typography>
                        </Stack>
                      </StyledTableCell>
                      <StyledTableCell>
                        <OrderTypeIcon type={order.type} />
                      </StyledTableCell>
                      <StyledTableCell>
                        <OrderStatusChip status={order.status} />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(order.total)}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          sx={{
                            bgcolor:
                              expandedOrderId === order.id
                                ? alpha(theme.palette.primary.main, 0.1)
                                : "transparent",
                          }}
                        >
                          {expandedOrderId === order.id ? (
                            <KeyboardArrowUpIcon fontSize="small" />
                          ) : (
                            <KeyboardArrowDownIcon fontSize="small" />
                          )}
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>

                    {/* Expanded row for order details */}
                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={7}
                      >
                        <Collapse
                          in={expandedOrderId === order.id}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box
                            sx={{
                              p: 3,
                              bgcolor: alpha(theme.palette.primary.main, 0.03),
                            }}
                          >
                            <Grid container spacing={3}>
                              <Grid size={{ xs: 12 }}>
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Typography variant="h6" fontWeight="bold">
                                    Order Details: {order.id}
                                  </Typography>
                                  <OrderStatusChip status={order.status} />
                                </Stack>
                                <Divider sx={{ my: 2 }} />
                              </Grid>

                              <Grid size={{ xs: 12, md: 6 }}>
                                <Stack spacing={2}>
                                  <Box>
                                    <Typography
                                      variant="subtitle2"
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      Customer Information
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      fontWeight="medium"
                                    >
                                      {order.customerName}
                                    </Typography>
                                    {order.customerEmail && (
                                      <Typography variant="body2">
                                        Email: {order.customerEmail}
                                      </Typography>
                                    )}
                                    {order.customerPhone && (
                                      <Typography variant="body2">
                                        Phone: {order.customerPhone}
                                      </Typography>
                                    )}
                                  </Box>

                                  {order.type === "Delivery" &&
                                    order.address && (
                                      <Box>
                                        <Typography
                                          variant="subtitle2"
                                          color="text.secondary"
                                          gutterBottom
                                        >
                                          Delivery Address
                                        </Typography>
                                        <Typography variant="body2">
                                          {order.address}
                                        </Typography>
                                      </Box>
                                    )}

                                  {order.notes && (
                                    <Box>
                                      <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        Order Notes
                                      </Typography>
                                      <Paper
                                        variant="outlined"
                                        sx={{
                                          p: 2,
                                          borderRadius: 2,
                                          bgcolor: alpha(
                                            theme.palette.background.default,
                                            0.5
                                          ),
                                        }}
                                      >
                                        <Typography variant="body2">
                                          {order.notes}
                                        </Typography>
                                      </Paper>
                                    </Box>
                                  )}
                                </Stack>
                              </Grid>

                              <Grid size={{ xs: 12, md: 6 }}>
                                <Stack spacing={2}>
                                  <Box>
                                    <Typography
                                      variant="subtitle2"
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      Order Summary
                                    </Typography>
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                      mb={1}
                                    >
                                      <OrderTypeIcon type={order.type} />
                                      <Typography variant="body2">
                                        {order.type} Order
                                      </Typography>
                                    </Stack>
                                    <Typography variant="body2">
                                      Date:{" "}
                                      {format(
                                        new Date(order.orderDate),
                                        "MMMM dd, yyyy"
                                      )}
                                    </Typography>
                                    {order.paymentMethod && (
                                      <Typography variant="body2">
                                        Payment: {order.paymentMethod}
                                      </Typography>
                                    )}
                                  </Box>

                                  {order.items && order.items.length > 0 && (
                                    <Box>
                                      <Typography
                                        variant="subtitle2"
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        Order Items
                                      </Typography>
                                      <Paper
                                        variant="outlined"
                                        sx={{ borderRadius: 2 }}
                                      >
                                        {order.items.map((item, index) => (
                                          <React.Fragment key={index}>
                                            {index > 0 && <Divider />}
                                            <Box sx={{ p: 2 }}>
                                              <Stack
                                                direction="row"
                                                justifyContent="space-between"
                                              >
                                                <Stack
                                                  direction="row"
                                                  spacing={1}
                                                  alignItems="center"
                                                >
                                                  <Typography
                                                    variant="body2"
                                                    fontWeight="medium"
                                                  >
                                                    {item.name}
                                                  </Typography>
                                                  <Chip
                                                    label={`x${item.quantity}`}
                                                    size="small"
                                                    sx={{ height: 20 }}
                                                  />
                                                </Stack>
                                                <Typography
                                                  variant="body2"
                                                  fontWeight="medium"
                                                >
                                                  {new Intl.NumberFormat(
                                                    "en-US",
                                                    {
                                                      style: "currency",
                                                      currency: "USD",
                                                    }
                                                  ).format(
                                                    item.price * item.quantity
                                                  )}
                                                </Typography>
                                              </Stack>
                                              <Typography
                                                variant="caption"
                                                color="text.secondary"
                                              >
                                                ${item.price.toFixed(2)} each
                                              </Typography>
                                            </Box>
                                          </React.Fragment>
                                        ))}
                                        <Divider />
                                        <Box
                                          sx={{
                                            p: 2,
                                            bgcolor: alpha(
                                              theme.palette.background.default,
                                              0.5
                                            ),
                                          }}
                                        >
                                          <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                          >
                                            <Typography variant="subtitle2">
                                              Total
                                            </Typography>
                                            <Typography
                                              variant="subtitle1"
                                              fontWeight="bold"
                                            >
                                              {new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "USD",
                                              }).format(order.total)}
                                            </Typography>
                                          </Stack>
                                        </Box>
                                      </Paper>
                                    </Box>
                                  )}
                                </Stack>
                              </Grid>

                              <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 2 }} />
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  justifyContent="flex-end"
                                >
                                  <Button
                                    variant="outlined"
                                    onClick={() => setExpandedOrderId(null)}
                                    sx={{
                                      borderRadius: 2,
                                      textTransform: "none",
                                    }}
                                  >
                                    Close Details
                                  </Button>

                                  {order.status === "Pending" && (
                                    <AnimatedButton
                                      variant="contained"
                                      color="primary"
                                      sx={{ borderRadius: 2 }}
                                    >
                                      Process Order
                                    </AnimatedButton>
                                  )}

                                  {order.status === "Processing" && (
                                    <AnimatedButton
                                      variant="contained"
                                      color="success"
                                      sx={{ borderRadius: 2 }}
                                    >
                                      Mark as Completed
                                    </AnimatedButton>
                                  )}

                                  {(order.status === "Pending" ||
                                    order.status === "Processing") && (
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                      }}
                                    >
                                      Cancel Order
                                    </Button>
                                  )}

                                  <AnimatedButton
                                    variant="contained"
                                    color="secondary"
                                    sx={{ borderRadius: 2 }}
                                  >
                                    Print Invoice
                                  </AnimatedButton>
                                </Stack>
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}

                {paginatedOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Stack spacing={2} alignItems="center">
                        <ShoppingBagIcon
                          sx={{
                            fontSize: 48,
                            color: alpha(theme.palette.text.secondary, 0.4),
                          }}
                        />
                        <Typography variant="h6" color="text.secondary">
                          No orders found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Try adjusting your filters or search criteria
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setSelectedDate(null);
                            setSelectedStatus("all");
                            setSelectedType("all");
                            setSearchQuery("");
                          }}
                          sx={{
                            mt: 1,
                            borderRadius: 2,
                            textTransform: "none",
                          }}
                        >
                          Clear Filters
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {paginatedOrders.length} of{" "}
              {filteredAndSortedOrders.length} orders
            </Typography>
            <Pagination
              count={Math.ceil(filteredAndSortedOrders.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
              size={isMobile ? "small" : "medium"}
            />
          </Box>
        </Paper>

        {/* Order summary footer */}
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.background.default, 0.6),
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {filteredAndSortedOrders.length} of {fakeOrders.length}{" "}
                total orders
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack
                direction="row"
                spacing={2}
                justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              >
                <Chip
                  icon={<DeliveryDiningIcon fontSize="small" />}
                  label={`${orderStats.delivery} Delivery`}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Chip
                  icon={<StorefrontIcon fontSize="small" />}
                  label={`${orderStats.pickup} Pickup`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Export options */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="flex-end"
          sx={{ mt: 3 }}
        >
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Export to CSV
          </Button>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Export to PDF
          </Button>
          <AnimatedButton variant="contained" size="small" color="primary">
            Generate Report
          </AnimatedButton>
        </Stack>
      </Container>
    </LocalizationProvider>
  );
};

export default OrderHistory;
