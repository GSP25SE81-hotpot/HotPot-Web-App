// src/components/order-management/utils/orderUtils.ts
import { format } from "date-fns";
import {
  Order as ApiOrder,
  Staff as ApiStaff,
  OrderDetail,
} from "../api/services/orderManagementService";
import {
  FrontendOrder,
  FrontendStaff,
  OrderItem,
  StatusHistoryItem,
} from "../types/orderManagement";
import { mapOrderStatus } from "./statusUtils";

export const convertApiOrderToFrontendOrder = (
  apiOrder: ApiOrder
): FrontendOrder => {
  const orderItems: OrderItem[] = apiOrder.orderDetails.map(
    (detail: OrderDetail) => ({
      id: detail.orderDetailId,
      name: detail.productName,
      quantity: detail.quantity,
      price: detail.price,
    })
  );

  let assignedTo: FrontendStaff | undefined = undefined;
  if (apiOrder.shippingOrder?.staff) {
    const staff = apiOrder.shippingOrder.staff;
    assignedTo = {
      id: staff.staffId,
      name: staff.userName || `Staff #${staff.staffId}`,
      role: "Delivery Staff",
      contact: staff.phoneNumber || apiOrder.userPhone || "N/A",
      availability: "On Delivery",
      assignedOrders: staff.assignedOrders || 1,
    };
  }

  // Extract date and time from deliveryTime if available
  let scheduledDate: string | undefined = undefined;
  let scheduledTime: string | undefined = undefined;
  if (apiOrder.shippingOrder?.deliveryTime) {
    const deliveryDate = new Date(apiOrder.shippingOrder.deliveryTime);
    scheduledDate = format(deliveryDate, "yyyy-MM-dd");
    scheduledTime = format(deliveryDate, "HH:mm");
  }

  // Create status history from the order data
  const statusHistory: StatusHistoryItem[] = [
    {
      status: mapOrderStatus(apiOrder.status),
      timestamp: apiOrder.updatedAt,
      actor: apiOrder.shippingOrder?.staff?.userName || "System",
      note: apiOrder.notes || undefined,
    },
  ];

  // If there's a shipping order with delivery notes, add it to history
  if (apiOrder.shippingOrder?.deliveryNotes) {
    statusHistory.push({
      status: apiOrder.shippingOrder.isDelivered ? "DELIVERED" : "IN_TRANSIT",
      timestamp: apiOrder.shippingOrder.updatedAt,
      actor: apiOrder.shippingOrder.staff?.userName || "Delivery Staff",
      note: apiOrder.shippingOrder.deliveryNotes,
    });
  }

  return {
    id: `ORD-${apiOrder.orderId}`,
    customerName: apiOrder.userName,
    orderItems,
    address: apiOrder.address,
    status: mapOrderStatus(apiOrder.status),
    assignedTo,
    scheduledDate,
    scheduledTime,
    createdAt: apiOrder.createdAt,
    updatedAt: apiOrder.updatedAt,
    totalPrice: apiOrder.totalPrice,
    statusHistory,
  };
};

export const convertApiStaffToFrontendStaff = (
  apiStaff: ApiStaff
): FrontendStaff => {
  return {
    id: apiStaff.staffId,
    name: apiStaff.userName || `Staff #${apiStaff.staffId}`,
    role: "Delivery Staff",
    contact: apiStaff.phoneNumber || "N/A",
    availability: apiStaff.assignedOrders >= 3 ? "On Delivery" : "Available",
    assignedOrders: apiStaff.assignedOrders || 0,
  };
};

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
};

// Re-export the service for convenience
export { default as orderManagementService } from "../api/services/orderManagementService";
