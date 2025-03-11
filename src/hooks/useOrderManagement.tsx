// src/components/order-management/hooks/useOrderManagement.ts

import { useState, useEffect } from "react";
import orderManagementService from "../api/services/orderManagementService";
import {
  FrontendOrder,
  FrontendStaff,
  OrderStatus,
  SnackbarState,
} from "../types/orderManagement";
import {
  convertApiOrderToFrontendOrder,
  convertApiStaffToFrontendStaff,
} from "../utils/orderUtils";
import { mapToBackendStatus } from "../utils/statusUtils";

export const useOrderManagement = () => {
  const [orders, setOrders] = useState<FrontendOrder[]>([]);
  const [staffList, setStaffList] = useState<FrontendStaff[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<FrontendOrder | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch orders and staff data
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch unallocated orders
      const unallocatedOrders =
        await orderManagementService.getUnallocatedOrders();
      // Fetch pending deliveries
      const pendingDeliveries =
        await orderManagementService.getPendingDeliveries();
      // Combine and convert to frontend format
      const allOrders = [...unallocatedOrders, ...pendingDeliveries];
      const frontendOrders = allOrders.map(convertApiOrderToFrontendOrder);
      setOrders(frontendOrders);

      // Fetch available statuses
      const statuses = await orderManagementService.getAvailableStatuses();
      setAvailableStatuses(statuses);

      // Fetch staff
      try {
        const apiStaff = await orderManagementService.getAllStaff();
        const frontendStaff = apiStaff.map(convertApiStaffToFrontendStaff);
        setStaffList(frontendStaff);
      } catch (staffError) {
        console.error("Error fetching staff:", staffError);
        // If we can't get staff, we'll just have an empty list
        setStaffList([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setSnackbar({
        open: true,
        message: "Failed to load orders. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle staff assignment
  const handleAssignStaff = async (orderId: string, staffId: number) => {
    try {
      const orderIdNumber = parseInt(orderId.replace("ORD-", ""));
      // Call API to allocate order to staff
      await orderManagementService.allocateOrderToStaff({
        orderId: orderIdNumber,
        staffId: staffId,
      });

      // Get updated order details
      const updatedOrderDetails = await orderManagementService.getOrderDetails(
        orderIdNumber
      );
      const updatedOrder = convertApiOrderToFrontendOrder(updatedOrderDetails);

      // Update orders list
      setOrders(
        orders.map((order) => (order.id === orderId ? updatedOrder : order))
      );

      // Update selected order
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }

      // Show success message
      setSnackbar({
        open: true,
        message: "Order successfully assigned to staff",
        severity: "success",
      });

      // Refresh data to get updated staff workloads
      fetchData();

      return true;
    } catch (error) {
      console.error("Error assigning staff:", error);
      setSnackbar({
        open: true,
        message: "Failed to assign staff. Please try again.",
        severity: "error",
      });
      return false;
    }
  };

  // Handle schedule delivery
  const handleScheduleDelivery = async (
    orderId: string,
    deliveryDate: string,
    deliveryTime: string
  ) => {
    try {
      const orderIdNumber = parseInt(orderId.replace("ORD-", ""));
      const deliveryDateTime = `${deliveryDate}T${deliveryTime}:00Z`;

      // Call API to update delivery time
      await orderManagementService.updateDeliveryTime(orderIdNumber, {
        deliveryTime: deliveryDateTime,
      });

      // Get updated order details
      const updatedOrderDetails = await orderManagementService.getOrderDetails(
        orderIdNumber
      );
      const updatedOrder = convertApiOrderToFrontendOrder(updatedOrderDetails);

      // Update orders list
      setOrders(
        orders.map((order) => (order.id === orderId ? updatedOrder : order))
      );

      // Update selected order
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }

      // Show success message
      setSnackbar({
        open: true,
        message: "Delivery schedule updated successfully",
        severity: "success",
      });

      return true;
    } catch (error) {
      console.error("Error scheduling delivery:", error);
      setSnackbar({
        open: true,
        message: "Failed to schedule delivery. Please try again.",
        severity: "error",
      });
      return false;
    }
  };

  // Handle status update
  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus,
    statusNote: string
  ) => {
    try {
      const orderIdNumber = parseInt(orderId.replace("ORD-", ""));
      const backendStatus = mapToBackendStatus(newStatus);

      // Call API to update order status
      await orderManagementService.updateOrderStatus(orderIdNumber, {
        status: backendStatus,
      });

      // If status is DELIVERED, also update delivery status
      if (newStatus === "DELIVERED") {
        await orderManagementService.updateDeliveryStatus(orderIdNumber, {
          isDelivered: true,
          notes: statusNote || "Order delivered successfully",
        });
      }

      // Get updated order details
      const updatedOrderDetails = await orderManagementService.getOrderDetails(
        orderIdNumber
      );
      const updatedOrder = convertApiOrderToFrontendOrder(updatedOrderDetails);

      // Add status history item
      if (selectedOrder) {
        const newStatusHistoryItem = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          actor: "Manager",
          note: statusNote,
        };
        updatedOrder.statusHistory = [
          ...selectedOrder.statusHistory,
          newStatusHistoryItem,
        ];
      }

      // Update orders list
      setOrders(
        orders.map((order) => (order.id === orderId ? updatedOrder : order))
      );

      // Update selected order
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }

      // Show success message
      setSnackbar({
        open: true,
        message: "Order status updated successfully",
        severity: "success",
      });

      // Refresh data to get updated orders
      fetchData();

      return true;
    } catch (error) {
      console.error("Error updating status:", error);
      setSnackbar({
        open: true,
        message: "Failed to update status. Please try again.",
        severity: "error",
      });
      return false;
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return {
    orders,
    staffList,
    selectedOrder,
    loading,
    availableStatuses,
    snackbar,
    setSelectedOrder,
    fetchData,
    handleAssignStaff,
    handleScheduleDelivery,
    handleStatusUpdate,
    handleSnackbarClose,
  };
};
