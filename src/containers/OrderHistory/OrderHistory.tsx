import React, { useState } from "react";
import {
  Box,
  Chip,
  Container,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

interface Order {
  id: string;
  customerName: string;
  orderDate: Date;
  status: "Pending" | "Completed" | "Cancelled" | "Processing";
  type: "Delivery" | "Pickup";
}

// Temporary fake data
const fakeOrders: Order[] = [
  {
    id: "ORD001",
    customerName: "John Doe",
    orderDate: new Date("2024-03-15"),
    status: "Completed",
    type: "Delivery",
  },
  {
    id: "ORD002",
    customerName: "Jane Smith",
    orderDate: new Date("2024-03-16"),
    status: "Pending",
    type: "Pickup",
  },
  // Add more sample orders as needed
];

// A custom status chip styled similarly to RepairRequests
const OrderStatusChip = ({ status }: { status: Order["status"] }) => {
  const theme = useTheme();
  const statusColors: Record<Order["status"], string> = {
    Completed: theme.palette.success.main,
    Pending: theme.palette.warning.main,
    Processing: theme.palette.info.main,
    Cancelled: theme.palette.error.main,
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: statusColors[status] || theme.palette.grey[500],
        color: "white",
      }}
    />
  );
};

const OrderHistory: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Filter orders based on the selected criteria
  const filteredOrders = fakeOrders.filter((order) => {
    const dateMatch =
      !selectedDate ||
      order.orderDate.toDateString() === selectedDate.toDateString();
    const statusMatch =
      selectedStatus === "all" || order.status === selectedStatus;
    const typeMatch = selectedType === "all" || order.type === selectedType;
    return dateMatch && statusMatch && typeMatch;
  });

  // Define DataGrid columns
  const columns: GridColDef[] = [
    { field: "id", headerName: "Order ID", width: 140 },
    { field: "customerName", headerName: "Customer Name", width: 200 },
    {
      field: "orderDate",
      headerName: "Order Date",
      width: 170,
      valueFormatter: () => new Date().toLocaleDateString(),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => <OrderStatusChip status={params.value} />,
    },
    { field: "type", headerName: "Type", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 170,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Chip
          label="View Details"
          color="primary"
          clickable
          size="small"
          onClick={() => console.log("View order:", params.row.id)}
        />
      ),
    },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Order History
        </Typography>

        {/* Filters */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <DatePicker
              label="Filter by Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select
              label="Filter by Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              select
              label="Filter by Type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              fullWidth
            >
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="Delivery">Delivery</MenuItem>
              <MenuItem value="Pickup">Pickup</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Orders DataGrid */}
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredOrders}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            disableRowSelectionOnClick
            initialState={{
              sorting: {
                sortModel: [{ field: "orderDate", sort: "desc" }],
              },
            }}
            sx={{
              "& .MuiDataGrid-cell": { py: 2 },
              "& .MuiDataGrid-row": { maxHeight: "none !important" },
            }}
          />
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default OrderHistory;
