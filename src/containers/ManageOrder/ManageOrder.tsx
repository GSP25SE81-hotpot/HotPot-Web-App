// src/components/order-management/ManageOrder.tsx

import { LocalShipping } from "@mui/icons-material";
import {
  Alert,
  Box,
  LinearProgress,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import { useOrderManagement } from "../../hooks/useOrderManagement";
import OrderList from "./ManageOrderComponents/OrderList";
import OrderDetails from "./ManageOrderComponents/OrderDetails";

const ManageOrder: React.FC = () => {
  const theme = useTheme();
  const {
    orders,
    staffList,
    selectedOrder,
    loading,
    snackbar,
    setSelectedOrder,
    handleAssignStaff,
    handleScheduleDelivery,
    handleStatusUpdate,
    handleSnackbarClose,
  } = useOrderManagement();

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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <LinearProgress sx={{ width: "50%" }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Order List */}
          <Grid size={{ xs: 12, md: 5 }}>
            <OrderList
              orders={orders}
              selectedOrder={selectedOrder}
              onOrderSelect={setSelectedOrder}
            />
          </Grid>

          {/* Order Details */}
          <Grid size={{ xs: 12, md: 7 }}>
            <OrderDetails
              selectedOrder={selectedOrder}
              staffList={staffList}
              onAssignStaff={handleAssignStaff}
              onScheduleDelivery={handleScheduleDelivery}
              onUpdateStatus={handleStatusUpdate}
            />
          </Grid>
        </Grid>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageOrder;
