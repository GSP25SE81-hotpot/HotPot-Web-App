// src/pages/OrderManagement/components/UnallocatedOrdersList.tsx
import React, { useState, useEffect } from "react";
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
  alpha,
} from "@mui/material";
import { Order } from "../../../api/Services/orderManagementService";
import { orderManagementService } from "../../../api/Services/orderManagementService";
import staffService from "../../../api/Services/staffService";
import { StaffAvailabilityDto } from "../../../types/staff";
import {
  formatDate,
  formatCurrency,
  getOrderStatusLabel,
  getOrderStatusColor,
} from "../../../utils/formatters";
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
  StyledTableContainer,
  StyledTableRow,
} from "../../../components/manager/styles/UnallocatedOrdersListStyles";

const UnallocatedOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [staff, setStaff] = useState<StaffAvailabilityDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allocating, setAllocating] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get unallocated orders
        const ordersData = await orderManagementService.getUnallocatedOrders();
        // Ensure ordersData is an array
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        // Get available staff - handle both array and single object responses
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
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load unallocated orders. Please try again later.");
        // Ensure orders is an empty array in case of error
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAllocateClick = (order: Order) => {
    setSelectedOrder(order);
    setSelectedStaffId(0);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handleStaffChange = (event: SelectChangeEvent<number>) => {
    setSelectedStaffId(Number(event.target.value));
  };

  const handleAllocateOrder = async () => {
    if (!selectedOrder || !selectedStaffId) {
      setSnackbar({
        open: true,
        message: "Please select a staff member",
        severity: "error",
      });
      return;
    }
    try {
      setAllocating(true);
      await orderManagementService.allocateOrderToStaff({
        orderId: selectedOrder.orderId,
        staffId: selectedStaffId,
      });
      // Remove the allocated order from the list
      setOrders(
        orders.filter((order) => order.orderId !== selectedOrder.orderId)
      );
      setSnackbar({
        open: true,
        message: `Order #${selectedOrder.orderId} successfully allocated`,
        severity: "success",
      });
      handleCloseDialog();
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
      setAllocating(false);
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

  // Safe check for orders array
  const ordersList = orders || [];

  if (ordersList.length === 0) {
    return (
      <EmptyStateContainer>
        <EmptyStateTitle variant="h6">
          No unallocated orders found
        </EmptyStateTitle>
        <EmptyStateSubtitle variant="body2">
          All orders have been allocated to staff members
        </EmptyStateSubtitle>
      </EmptyStateContainer>
    );
  }

  return (
    <OrdersListContainer>
      <ListTitle variant="h6">
        Unallocated Orders <CountBadge>{ordersList.length}</CountBadge>
      </ListTitle>

      <StyledPaper>
        <StyledTableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledHeaderCell>Order ID</StyledHeaderCell>
                <StyledHeaderCell>Customer</StyledHeaderCell>
                <StyledHeaderCell>Date</StyledHeaderCell>
                <StyledHeaderCell>Total</StyledHeaderCell>
                <StyledHeaderCell>Status</StyledHeaderCell>
                <StyledHeaderCell>Items</StyledHeaderCell>
                <StyledHeaderCell>Actions</StyledHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordersList.map((order) => (
                <StyledTableRow key={order.orderId}>
                  <IdCell>#{order.orderId}</IdCell>
                  <StyledHeaderCell>
                    <CustomerName>
                      {order.user?.fullName || "Unknown"}
                    </CustomerName>
                    <CustomerPhone>
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
                    <StatusChip
                      label={getOrderStatusLabel(order.status)}
                      size="small"
                      statuscolor={getOrderStatusColor(order.status)}
                    />
                  </StyledHeaderCell>
                  <StyledHeaderCell>
                    {order.hasSellItems && (
                      <OrderTypeChip label="Sell" size="small" />
                    )}
                    {order.hasRentItems && (
                      // src/pages/OrderManagement/components/UnallocatedOrdersList.tsx (continued)
                      <OrderTypeChip
                        label="Rent"
                        size="small"
                        color="secondary"
                      />
                    )}
                  </StyledHeaderCell>
                  <StyledHeaderCell>
                    <AllocateButton
                      variant="contained"
                      size="small"
                      onClick={() => handleAllocateClick(order)}
                    >
                      Allocate
                    </AllocateButton>
                  </StyledHeaderCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledPaper>

      {/* Allocation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
            padding: 1,
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
          Allocate Order #{selectedOrder?.orderId}
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
                  <MenuItem
                    key={staffMember.staffId}
                    value={staffMember.staffId}
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
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            Cancel
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
            {allocating ? <CircularProgress size={24} /> : "Allocate"}
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
