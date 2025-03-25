import InfoIcon from "@mui/icons-material/Info";
import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tooltip,
  alpha,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Order,
  orderManagementService,
  OrderStatus,
} from "../../../api/Services/orderManagementService";
import {
  formatCurrency,
  formatDate,
  getOrderStatusLabel,
} from "../../../utils/formatters";
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
  StyledTabPanel,
  StyledTableContainer,
  StyledTableRow,
  StyledTabs,
  UnallocatedChip,
  UpdateStatusButton,
  ViewDetailsButton,
} from "../../../components/manager/styles/OrdersByStatusListStyles";
import { ActionButton } from "../../../components/manager/styles/OrderDetailStyles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <StyledTabPanel
      role="tabpanel"
      hidden={value !== index}
      id={`status-tabpanel-${index}`}
      aria-labelledby={`status-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </StyledTabPanel>
  );
}

const OrdersByStatusList: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.Pending);
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const status = tabToStatus[activeTab];
        const data = await orderManagementService.getOrdersByStatus(status);
        // Ensure data is an array
        setOrders(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(`Failed to load orders. Please try again later.`);
        // Ensure orders is an empty array in case of error
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleUpdateStatusClick = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (event: SelectChangeEvent<number>) => {
    setNewStatus(Number(event.target.value) as OrderStatus);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      setUpdating(true);
      const updatedOrder = await orderManagementService.updateOrderStatus(
        selectedOrder.orderId,
        { status: newStatus }
      );
      // If the status changed to a different tab, remove from current list
      if (newStatus !== tabToStatus[activeTab]) {
        setOrders(
          orders.filter((order) => order.orderId !== updatedOrder.orderId)
        );
      } else {
        // Otherwise update the order in the list
        setOrders(
          orders.map((order) =>
            order.orderId === updatedOrder.orderId ? updatedOrder : order
          )
        );
      }
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

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleViewDetails = (orderId: number) => {
    window.open(`/orders/${orderId}`, "_blank");
  };

  return (
    <OrdersListContainer>
      <StyledPaper>
        <StyledTabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabToStatus.map((status) => (
            <StyledTab key={status} label={getOrderStatusLabel(status)} />
          ))}
        </StyledTabs>

        {tabToStatus.map((status, index) => (
          <TabPanel key={status} value={activeTab} index={index}>
            {loading ? (
              <LoadingContainer>
                <CircularProgress />
              </LoadingContainer>
            ) : error ? (
              <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            ) : orders.length === 0 ? (
              <EmptyStateContainer>
                <EmptyStateText variant="h6">
                  No {getOrderStatusLabel(status).toLowerCase()} orders found
                </EmptyStateText>
              </EmptyStateContainer>
            ) : (
              <StyledTableContainer>
                <Table stickyHeader>
                  //
                  src/pages/OrderManagement/ManageOrderComponents/OrdersByStatusList.tsx
                  (continued)
                  <TableHead>
                    <TableRow>
                      <StyledHeaderCell>Order ID</StyledHeaderCell>
                      <StyledHeaderCell>Customer</StyledHeaderCell>
                      <StyledHeaderCell>Date</StyledHeaderCell>
                      <StyledHeaderCell>Total</StyledHeaderCell>
                      <StyledHeaderCell>Items</StyledHeaderCell>
                      <StyledHeaderCell>Shipping</StyledHeaderCell>
                      <StyledHeaderCell>Actions</StyledHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(orders || []).map((order) => (
                      <StyledTableRow key={order.orderId}>
                        <OrderIdCell>#{order.orderId}</OrderIdCell>
                        <StyledHeaderCell>
                          <CustomerName variant="body2">
                            {order.user?.fullName || "Unknown"}
                          </CustomerName>
                          <CustomerPhone variant="caption">
                            {order.user?.phoneNumber || "No phone"}
                          </CustomerPhone>
                        </StyledHeaderCell>
                        <StyledHeaderCell>
                          {formatDate(order.createdAt)}
                        </StyledHeaderCell>
                        <StyledHeaderCell>
                          {formatCurrency(order.totalPrice)}
                        </StyledHeaderCell>
                        <StyledHeaderCell>
                          {order.hasSellItems && (
                            <OrderTypeChip label="Sell" size="small" />
                          )}
                          {order.hasRentItems && (
                            <OrderTypeChip
                              label="Rent"
                              size="small"
                              color="secondary"
                            />
                          )}
                        </StyledHeaderCell>
                        <StyledHeaderCell>
                          {order.shippingOrder ? (
                            <ShippingStatusChip
                              label={
                                order.shippingOrder.isDelivered
                                  ? "Delivered"
                                  : "Pending"
                              }
                              size="small"
                              delivered={order.shippingOrder.isDelivered}
                            />
                          ) : (
                            <UnallocatedChip label="Unallocated" size="small" />
                          )}
                        </StyledHeaderCell>
                        <StyledHeaderCell>
                          <ActionsContainer>
                            <UpdateStatusButton
                              variant="outlined"
                              size="small"
                              onClick={() => handleUpdateStatusClick(order)}
                            >
                              Update Status
                            </UpdateStatusButton>
                            <Tooltip title="View order details">
                              <ViewDetailsButton
                                size="small"
                                onClick={() => handleViewDetails(order.orderId)}
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
            )}
          </TabPanel>
        ))}
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
          <ActionButton onClick={handleCloseStatusDialog}>Cancel</ActionButton>
          <ActionButton
            onClick={handleUpdateStatus}
            variant="contained"
            disabled={
              updating ||
              (selectedOrder !== null && newStatus === selectedOrder.status)
            }
          >
            {updating ? <CircularProgress size={24} /> : "Update"}
          </ActionButton>
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

export default OrdersByStatusList;
