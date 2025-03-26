// src/pages/OrderManagement/OrderDetailView.tsx
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  alpha,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AllocateOrderRequest,
  DeliveryStatusUpdateRequest,
  DeliveryTimeUpdateRequest,
  OrderDetailDTO,
  OrderStatus,
  orderManagementService,
} from "../../api/Services/orderManagementService";
import staffService from "../../api/Services/staffService";
import {
  ActionButton,
  ActionButtonsContainer,
  BackButton,
  CustomerName,
  DeliveryChip,
  DetailCard,
  DetailPageContainer,
  EmptyStateContainer,
  EmptyStateText,
  ErrorContainer,
  HeaderContainer,
  HeaderPaper,
  InfoLabel,
  InfoValue,
  LoadingContainer,
  OrderInfoGrid,
  OrderInfoItem,
  OrderItemsContainer,
  OrderTitle,
  OrderTotal,
  OrderTotalContainer,
  SectionTitle,
  SectionValue,
  StatusChip,
  StyledCardContent,
  StyledCardHeader,
} from "../../components/manager/styles/OrderDetailStyles";
import { StaffAvailabilityDto } from "../../types/staff";
import {
  formatCurrency,
  formatDate,
  getOrderStatusLabel,
} from "../../utils/formatters";

const OrderDetailView: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetailDTO | null>(null);
  const [staff, setStaff] = useState<StaffAvailabilityDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openAllocateDialog, setOpenAllocateDialog] = useState(false);
  const [openDeliveryStatusDialog, setOpenDeliveryStatusDialog] =
    useState(false);
  const [openDeliveryTimeDialog, setOpenDeliveryTimeDialog] = useState(false);

  // Form states
  const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.Pending);
  const [selectedStaffId, setSelectedStaffId] = useState<number>(0);
  const [isDelivered, setIsDelivered] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [deliveryTime, setDeliveryTime] = useState<Date | null>(null);

  // Action states
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        // Get order details
        const orderData = await orderManagementService.getOrderWithDetails(
          parseInt(orderId)
        );
        setOrder(orderData);

        // Get available staff and handle both array and single object responses
        const staffData = await staffService.getAvailableStaff();
        // Check if staffData is an array, if not, convert it to an array
        if (Array.isArray(staffData)) {
          setStaff(staffData);
        } else if (staffData) {
          // If it's a single object, wrap it in an array
          setStaff([staffData]);
        } else {
          // If it's null or undefined, set an empty array
          setStaff([]);
        }

        // Initialize form states based on order data
        setNewStatus(orderData.status);
        if (orderData.shippingInfo) {
          setIsDelivered(orderData.shippingInfo.isDelivered);
          setDeliveryNotes(orderData.shippingInfo.deliveryNotes || "");
          setDeliveryTime(
            orderData.shippingInfo.deliveryTime
              ? new Date(orderData.shippingInfo.deliveryTime)
              : null
          );
          setSelectedStaffId(orderData.shippingInfo.staffId);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(`Failed to load order details. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orderId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Dialog open handlers
  const handleOpenStatusDialog = () => {
    setOpenStatusDialog(true);
  };

  const handleOpenAllocateDialog = () => {
    setOpenAllocateDialog(true);
  };

  const handleOpenDeliveryStatusDialog = () => {
    setOpenDeliveryStatusDialog(true);
  };

  const handleOpenDeliveryTimeDialog = () => {
    setOpenDeliveryTimeDialog(true);
  };

  // Dialog close handlers
  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
  };

  const handleCloseAllocateDialog = () => {
    setOpenAllocateDialog(false);
  };

  const handleCloseDeliveryStatusDialog = () => {
    setOpenDeliveryStatusDialog(false);
  };

  const handleCloseDeliveryTimeDialog = () => {
    setOpenDeliveryTimeDialog(false);
  };

  // Form change handlers
  const handleStatusChange = (event: SelectChangeEvent<number>) => {
    setNewStatus(Number(event.target.value) as OrderStatus);
  };

  const handleStaffChange = (event: SelectChangeEvent<number>) => {
    setSelectedStaffId(Number(event.target.value));
  };

  // Action handlers
  const handleUpdateStatus = async () => {
    if (!order) return;
    try {
      setUpdating(true);
      const updatedOrder = await orderManagementService.updateOrderStatus(
        order.orderId,
        newStatus
      );
      setOrder({ ...order, ...updatedOrder });
      setSnackbar({
        open: true,
        message: `Order status updated successfully`,
        severity: "success",
      });
      handleCloseStatusDialog();
    } catch (err) {
      console.error("Error updating order status:", err);
      setSnackbar({
        open: true,
        message: `Failed to update order status: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleAllocateOrder = async () => {
    if (!order || !selectedStaffId) {
      setSnackbar({
        open: true,
        message: "Please select a staff member",
        severity: "error",
      });
      return;
    }
    try {
      setUpdating(true);
      const request: AllocateOrderRequest = {
        orderId: order.orderId,
        staffId: selectedStaffId,
      };

      const shippingOrder = await orderManagementService.allocateOrderToStaff(
        request
      );

      // Update the order with the new shipping info
      setOrder({ ...order, shippingInfo: shippingOrder });

      setSnackbar({
        open: true,
        message: `Order successfully allocated to staff`,
        severity: "success",
      });

      handleCloseAllocateDialog();
    } catch (err) {
      console.error("Error allocating order:", err);
      setSnackbar({
        open: true,
        message: `Failed to allocate order: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateDeliveryStatus = async () => {
    if (!order?.shippingInfo) return;
    try {
      setUpdating(true);

      const request: DeliveryStatusUpdateRequest = {
        isDelivered,
        notes: deliveryNotes || undefined,
      };

      const updatedDeliveryStatus =
        await orderManagementService.updateDeliveryStatus(
          order.shippingInfo.shippingOrderId,
          request
        );

      // Merge the updated delivery status with the existing shipping info
      // instead of replacing the entire object
      const updatedShippingInfo = {
        ...order.shippingInfo,
        isDelivered: updatedDeliveryStatus.isDelivered,
        notes:
          updatedDeliveryStatus.deliveryNotes ||
          order.shippingInfo.deliveryNotes,
      };

      // Update the order with the merged shipping info
      setOrder({ ...order, shippingInfo: updatedShippingInfo });

      setSnackbar({
        open: true,
        message: `Delivery status updated successfully`,
        severity: "success",
      });

      handleCloseDeliveryStatusDialog();
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

  const handleUpdateDeliveryTime = async () => {
    if (!order?.shippingInfo || !deliveryTime) return;
    try {
      setUpdating(true);

      const request: DeliveryTimeUpdateRequest = {
        deliveryTime: deliveryTime.toISOString(),
      };

      const updatedDeliveryTime =
        await orderManagementService.updateDeliveryTime(
          order.shippingInfo.shippingOrderId,
          request
        );

      // Merge the updated delivery time with the existing shipping info
      // instead of replacing the entire object
      const updatedShippingInfo = {
        ...order.shippingInfo,
        deliveryTime: updatedDeliveryTime.deliveryTime,
      };

      // Update the order with the merged shipping info
      setOrder({ ...order, shippingInfo: updatedShippingInfo });

      setSnackbar({
        open: true,
        message: `Delivery time updated successfully`,
        severity: "success",
      });

      handleCloseDeliveryTimeDialog();
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
      <ErrorContainer>
        <BackButton startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
          Back
        </BackButton>
        <Alert severity="error">{error}</Alert>
      </ErrorContainer>
    );
  }

  if (!order) {
    return (
      <ErrorContainer>
        <BackButton startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
          Back
        </BackButton>
        <Alert severity="warning">Order not found</Alert>
      </ErrorContainer>
    );
  }

  return (
    <DetailPageContainer>
      <BackButton startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
        Back to Orders
      </BackButton>

      <Grid container spacing={3}>
        {/* Order Header */}
        <Grid size={{ xs: 12 }}>
          <HeaderPaper>
            <HeaderContainer>
              <OrderTitle variant="h5">Order #{order.orderId}</OrderTitle>
              <StatusChip
                label={getOrderStatusLabel(order.status)}
                status={order.status}
              />
            </HeaderContainer>
            <OrderInfoGrid>
              <OrderInfoItem>
                <InfoLabel>Order Date</InfoLabel>
                <InfoValue>
                  {formatDate(order.createdAt || new Date().toISOString())}
                </InfoValue>
              </OrderInfoItem>
              <OrderInfoItem>
                <InfoLabel>Total Amount</InfoLabel>
                <InfoValue>{formatCurrency(order.totalPrice)}</InfoValue>
              </OrderInfoItem>
            </OrderInfoGrid>
            <ActionButtonsContainer>
              <ActionButton
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleOpenStatusDialog}
              >
                Update Status
              </ActionButton>
              {!order.shippingInfo ? (
                <ActionButton
                  variant="contained"
                  color="primary"
                  onClick={handleOpenAllocateDialog}
                >
                  Allocate to Staff
                </ActionButton>
              ) : (
                <>
                  <ActionButton
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenDeliveryStatusDialog}
                  >
                    Update Delivery Status
                  </ActionButton>
                  <ActionButton
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenDeliveryTimeDialog}
                  >
                    Set Delivery Time
                  </ActionButton>
                </>
              )}
            </ActionButtonsContainer>
          </HeaderPaper>
        </Grid>

        {/* Customer Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <DetailCard>
            <StyledCardHeader title="Customer Information" />
            <Divider />
            <StyledCardContent>
              <CustomerName>
                {order.userName || "Unknown Customer"}
              </CustomerName>
              <SectionTitle>User ID</SectionTitle>
              <SectionValue>{order.userId || "No ID provided"}</SectionValue>
              <SectionTitle>Shipping Address</SectionTitle>
              <SectionValue>
                {order.address || "No address provided"}
              </SectionValue>
              {order.notes && (
                <>
                  <SectionTitle>Order Notes</SectionTitle>
                  <SectionValue>{order.notes}</SectionValue>
                </>
              )}
            </StyledCardContent>
          </DetailCard>
        </Grid>

        {/* Shipping Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <DetailCard>
            <StyledCardHeader
              title="Shipping Information"
              action={
                !order.shippingInfo && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleOpenAllocateDialog}
                    sx={{
                      borderRadius: 8,
                      textTransform: "none",
                      fontWeight: 600,
                      px: 2,
                    }}
                  >
                    Allocate
                  </Button>
                )
              }
            />
            <Divider />
            <StyledCardContent>
              {order.shippingInfo ? (
                <>
                  <SectionTitle>Assigned Staff</SectionTitle>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {order.shippingInfo.staffName || "Unknown Staff"}
                  </Typography>
                  <SectionTitle>Delivery Status</SectionTitle>
                  <DeliveryChip
                    label={
                      order.shippingInfo.isDelivered
                        ? "Delivered"
                        : "Pending Delivery"
                    }
                    delivered={order.shippingInfo.isDelivered}
                  />
                  <SectionTitle>Scheduled Delivery Time</SectionTitle>
                  <SectionValue>
                    {order.shippingInfo.deliveryTime
                      ? formatDate(order.shippingInfo.deliveryTime)
                      : "Not scheduled yet"}
                  </SectionValue>
                  {order.shippingInfo.deliveryNotes && (
                    <>
                      <SectionTitle>Delivery Notes</SectionTitle>
                      <SectionValue>
                        {order.shippingInfo.deliveryNotes}
                      </SectionValue>
                    </>
                  )}
                  <ActionButtonsContainer>
                    <ActionButton
                      variant="outlined"
                      size="small"
                      onClick={handleOpenDeliveryStatusDialog}
                    >
                      Update Status
                    </ActionButton>
                    <ActionButton
                      variant="outlined"
                      size="small"
                      onClick={handleOpenDeliveryTimeDialog}
                    >
                      Set Time
                    </ActionButton>
                  </ActionButtonsContainer>
                </>
              ) : (
                <EmptyStateContainer>
                  <EmptyStateText>
                    This order has not been allocated to a staff member yet.
                  </EmptyStateText>
                  <ActionButton
                    variant="contained"
                    onClick={handleOpenAllocateDialog}
                  >
                    Allocate to Staff
                  </ActionButton>
                </EmptyStateContainer>
              )}
            </StyledCardContent>
          </DetailCard>
        </Grid>

        {/* Order Items */}
        <Grid size={{ xs: 12 }}>
          <DetailCard>
            <StyledCardHeader title="Order Items" />
            <Divider />
            <StyledCardContent>
              <OrderItemsContainer>
                {/* Order Summary */}
                <OrderTotalContainer>
                  <OrderTotal>
                    Total: {formatCurrency(order.totalPrice)}
                  </OrderTotal>
                </OrderTotalContainer>
              </OrderItemsContainer>
            </StyledCardContent>
          </DetailCard>
        </Grid>
      </Grid>

      {/* Update Status Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
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
          Update Order Status
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
          <Box sx={{ mt: 1, minWidth: 300 }}>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                value={newStatus}
                label="Status"
                onChange={handleStatusChange}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <MenuItem value={OrderStatus.Pending}>Pending</MenuItem>
                <MenuItem value={OrderStatus.Processing}>Processing</MenuItem>
                <MenuItem value={OrderStatus.Shipping}>Shipping</MenuItem>
                <MenuItem value={OrderStatus.Delivered}>Delivered</MenuItem>
                <MenuItem value={OrderStatus.Completed}>Completed</MenuItem>
                <MenuItem value={OrderStatus.Cancelled}>Cancelled</MenuItem>
                <MenuItem value={OrderStatus.Returning}>Returning</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseStatusDialog}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={updating || newStatus === order.status}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {updating ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Allocate Order Dialog */}
      <Dialog
        open={openAllocateDialog}
        onClose={handleCloseAllocateDialog}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
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
          Allocate Order to Staff
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
          <Box sx={{ mt: 1, minWidth: 300 }}>
            <FormControl fullWidth>
              <InputLabel id="staff-select-label">Select Staff</InputLabel>
              <Select
                labelId="staff-select-label"
                value={selectedStaffId}
                label="Select Staff"
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
                  Select a staff member
                </MenuItem>
                {staff.map((staffMember) => (
                  <MenuItem key={staffMember.id} value={staffMember.id}>
                    {staffMember.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseAllocateDialog}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAllocateOrder}
            variant="contained"
            disabled={updating || !selectedStaffId}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {updating ? <CircularProgress size={24} /> : "Allocate"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Delivery Status Dialog */}
      <Dialog
        open={openDeliveryStatusDialog}
        onClose={handleCloseDeliveryStatusDialog}
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
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="delivery-status-label">
                Delivery Status
              </InputLabel>
              <Select
                labelId="delivery-status-label"
                value={isDelivered ? 1 : 0}
                label="Delivery Status"
                onChange={(e) => setIsDelivered(e.target.value === 1)}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <MenuItem value={0}>Pending</MenuItem>
                <MenuItem value={1}>Delivered</MenuItem>
              </Select>
            </FormControl>
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
          <Button
            onClick={handleCloseDeliveryStatusDialog}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 2,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateDeliveryStatus}
            variant="contained"
            disabled={
              updating ||
              (order.shippingInfo?.isDelivered === isDelivered &&
                order.shippingInfo?.deliveryNotes === deliveryNotes)
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {updating ? <CircularProgress size={24} /> : "Update"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Delivery Time Dialog */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Dialog
          open={openDeliveryTimeDialog}
          onClose={handleCloseDeliveryTimeDialog}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
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
            <Button
              onClick={handleCloseDeliveryTimeDialog}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 2,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateDeliveryTime}
              variant="contained"
              disabled={updating || !deliveryTime}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {updating ? <CircularProgress size={24} /> : "Update"}
            </Button>
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
    </DetailPageContainer>
  );
};

export default OrderDetailView;
