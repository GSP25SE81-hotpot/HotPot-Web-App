// src/pages/OrderManagement/components/PendingDeliveriesList.tsx
import InfoIcon from "@mui/icons-material/Info";
import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Snackbar,
  Switch,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  alpha,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import {
  orderManagementService,
  ShippingOrder,
} from "../../../api/Services/orderManagementService";
import { formatDate } from "../../../utils/formatters";
import {
  ActionButton,
  ActionsContainer,
  CountBadge,
  CustomerName,
  CustomerPhone,
  DeliveriesListContainer,
  DeliveryTime,
  EmptyStateContainer,
  EmptyStateSubtitle,
  EmptyStateTitle,
  IdCell,
  ListTitle,
  LoadingContainer,
  StaffName,
  StatusChip,
  StyledHeaderCell,
  StyledPaper,
  StyledTableContainer,
  StyledTableRow,
  ViewDetailsButton,
} from "../../../components/manager/styles/PendingDeliveriesListStyles";

const PendingDeliveriesList: React.FC = () => {
  const [deliveries, setDeliveries] = useState<ShippingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [selectedDelivery, setSelectedDelivery] =
    useState<ShippingOrder | null>(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openTimeDialog, setOpenTimeDialog] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [deliveryTime, setDeliveryTime] = useState<Date | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        const data = await orderManagementService.getPendingDeliveries();
        // Ensure data is an array
        setDeliveries(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching pending deliveries:", err);
        setError("Failed to load pending deliveries. Please try again later.");
        // Ensure deliveries is an empty array in case of error
        setDeliveries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const handleUpdateStatusClick = (delivery: ShippingOrder) => {
    setSelectedDelivery(delivery);
    setIsDelivered(delivery.isDelivered);
    setDeliveryNotes(delivery.deliveryNotes || "");
    setOpenStatusDialog(true);
  };

  const handleUpdateTimeClick = (delivery: ShippingOrder) => {
    setSelectedDelivery(delivery);
    setDeliveryTime(
      delivery.deliveryTime ? new Date(delivery.deliveryTime) : new Date()
    );
    setOpenTimeDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedDelivery(null);
  };

  const handleCloseTimeDialog = () => {
    setOpenTimeDialog(false);
    setSelectedDelivery(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedDelivery) return;
    try {
      setUpdating(true);
      const updatedDelivery = await orderManagementService.updateDeliveryStatus(
        selectedDelivery.shippingOrderId,
        {
          isDelivered,
          notes: deliveryNotes,
        }
      );
      // Update the delivery in the list
      setDeliveries(
        deliveries.map((delivery) =>
          delivery.shippingOrderId === updatedDelivery.shippingOrderId
            ? updatedDelivery
            : delivery
        )
      );
      setSnackbar({
        open: true,
        message: `Delivery status updated successfully`,
        severity: "success",
      });
      handleCloseStatusDialog();
    } catch (err) {
      console.error("Error updating delivery status:", err);
      setSnackbar({
        open: true,
        message: `Failed to update delivery status: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateTime = async () => {
    if (!selectedDelivery || !deliveryTime) return;
    try {
      setUpdating(true);
      const updatedDelivery = await orderManagementService.updateDeliveryTime(
        selectedDelivery.shippingOrderId,
        {
          deliveryTime: deliveryTime.toISOString(),
        }
      );
      // Update the delivery in the list
      setDeliveries(
        deliveries.map((delivery) =>
          delivery.shippingOrderId === updatedDelivery.shippingOrderId
            ? updatedDelivery
            : delivery
        )
      );
      setSnackbar({
        open: true,
        message: `Delivery time updated successfully`,
        severity: "success",
      });
      handleCloseTimeDialog();
    } catch (err) {
      console.error("Error updating delivery time:", err);
      setSnackbar({
        open: true,
        message: `Failed to update delivery time: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
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

  // Safe check for deliveries array
  const deliveriesList = deliveries || [];

  if (deliveriesList.length === 0) {
    return (
      <EmptyStateContainer>
        <EmptyStateTitle variant="h6">
          No pending deliveries found
        </EmptyStateTitle>
        <EmptyStateSubtitle variant="body2">
          All deliveries have been completed
        </EmptyStateSubtitle>
      </EmptyStateContainer>
    );
  }

  return (
    <DeliveriesListContainer>
      <ListTitle variant="h6">
        Pending Deliveries <CountBadge>{deliveriesList.length}</CountBadge>
        // src/pages/OrderManagement/components/PendingDeliveriesList.tsx
        (continued)
      </ListTitle>

      <StyledPaper>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledHeaderCell>Shipping ID</StyledHeaderCell>
                <StyledHeaderCell>Order ID</StyledHeaderCell>
                <StyledHeaderCell>Customer</StyledHeaderCell>
                <StyledHeaderCell>Staff</StyledHeaderCell>
                <StyledHeaderCell>Delivery Time</StyledHeaderCell>
                <StyledHeaderCell>Status</StyledHeaderCell>
                <StyledHeaderCell>Actions</StyledHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveriesList.map((delivery) => (
                <StyledTableRow key={delivery.shippingOrderId}>
                  <IdCell>#{delivery.shippingOrderId}</IdCell>
                  <IdCell>#{delivery.orderId}</IdCell>
                  <StyledHeaderCell>
                    <CustomerName>
                      {delivery.order?.user?.fullName || "Unknown"}
                    </CustomerName>
                    <CustomerPhone>
                      {delivery.order?.user?.phoneNumber || "No phone"}
                    </CustomerPhone>
                  </StyledHeaderCell>
                  <StyledHeaderCell>
                    <StaffName>
                      {delivery.staff?.fullName || "Unassigned"}
                    </StaffName>
                  </StyledHeaderCell>
                  <StyledHeaderCell>
                    <DeliveryTime>
                      {delivery.deliveryTime
                        ? formatDate(delivery.deliveryTime)
                        : "Not scheduled"}
                    </DeliveryTime>
                  </StyledHeaderCell>
                  <StyledHeaderCell>
                    <StatusChip
                      label={delivery.isDelivered ? "Delivered" : "Pending"}
                      size="small"
                      delivered={delivery.isDelivered}
                    />
                  </StyledHeaderCell>
                  <StyledHeaderCell>
                    <ActionsContainer>
                      <ActionButton
                        variant="outlined"
                        size="small"
                        onClick={() => handleUpdateStatusClick(delivery)}
                      >
                        Update Status
                      </ActionButton>
                      <ActionButton
                        variant="outlined"
                        size="small"
                        onClick={() => handleUpdateTimeClick(delivery)}
                      >
                        Set Time
                      </ActionButton>
                      <Tooltip title="View order details">
                        <ViewDetailsButton
                          size="small"
                          onClick={() =>
                            window.open(`/orders/${delivery.orderId}`, "_blank")
                          }
                        >
                          <InfoIcon fontSize="small" />
                        </ViewDetailsButton>
                      </Tooltip>
                    </ActionsContainer>
                  </StyledHeaderCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledPaper>

      {/* Update Status Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
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
          Update Delivery Status
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
          <Box sx={{ mt: 1, minWidth: 300 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isDelivered}
                  onChange={(e) => setIsDelivered(e.target.checked)}
                  color="primary"
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: (theme) => theme.palette.success.main,
                      "&:hover": {
                        backgroundColor: (theme) =>
                          alpha(theme.palette.success.main, 0.08),
                      },
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: (theme) => theme.palette.success.main,
                    },
                  }}
                />
              }
              label={
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: (theme) =>
                      isDelivered
                        ? theme.palette.success.main
                        : theme.palette.warning.main,
                  }}
                >
                  {isDelivered ? "Delivered" : "Pending"}
                </Typography>
              }
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Delivery Notes"
              fullWidth
              multiline
              rows={4}
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.2),
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <ActionButton onClick={handleCloseStatusDialog}>Cancel</ActionButton>
          <ActionButton
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={updating}
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              color: "white",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.primary.dark,
              },
            }}
          >
            {updating ? <CircularProgress size={24} /> : "Update"}
          </ActionButton>
        </DialogActions>
      </Dialog>

      {/* Update Time Dialog */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Dialog
          open={openTimeDialog}
          onClose={handleCloseTimeDialog}
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
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
            Set Delivery Time
          </DialogTitle>
          <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
            <Box sx={{ mt: 1, minWidth: 300 }}>
              <DateTimePicker
                label="Delivery Time"
                value={deliveryTime}
                onChange={(newValue) => setDeliveryTime(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.2),
                        },
                      },
                    },
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <ActionButton onClick={handleCloseTimeDialog}>Cancel</ActionButton>
            <ActionButton
              onClick={handleUpdateTime}
              variant="contained"
              disabled={updating || !deliveryTime}
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                color: "white",
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              {updating ? <CircularProgress size={24} /> : "Update"}
            </ActionButton>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>

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
    </DeliveriesListContainer>
  );
};

export default PendingDeliveriesList;
