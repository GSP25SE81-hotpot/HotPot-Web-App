// // src/components/order-management/utils/orderUtils.ts
// import { format } from "date-fns";
// import {
//   Order as ApiOrder,
//   StaffDto as ApiStaff,
//   OrderDetail,
// } from "../api/Services/orderManagementService";
// import {
//   FrontendOrder,
//   FrontendStaff,
//   OrderItem,
//   StatusHistoryItem,
// } from "../types/orderManagement";
// import { mapOrderStatus } from "./statusUtils";

// export const convertApiOrderToFrontendOrder = (
//   apiOrder: ApiOrder
// ): FrontendOrder => {
//   const orderItems: OrderItem[] = apiOrder.orderDetails.map(
//     (detail: OrderDetail) => ({
//       id: detail.orderDetailId,
//       name: detail.productName,
//       quantity: detail.quantity,
//       price: detail.price,
//     })
//   );

//   let assignedTo: FrontendStaff | undefined = undefined;
//   if (apiOrder.shippingOrder?.staff) {
//     const staff = apiOrder.shippingOrder.staff;
//     // Calculate the number of assigned orders
//     const assignedOrdersCount = staff.shippingOrders
//       ? staff.shippingOrders.length
//       : 1;

//     assignedTo = {
//       id: staff.id,
//       name: staff.user.name || `Staff #${staff.id}`,
//       role: "Delivery Staff",
//       contact: staff.user.phoneNumber || apiOrder.userPhone || "N/A",
//       availability: "On Delivery",
//       assignedOrders: assignedOrdersCount,
//     };
//   }

//   // Extract date and time from deliveryTime if available
//   let scheduledDate: string | undefined = undefined;
//   let scheduledTime: string | undefined = undefined;
//   if (apiOrder.shippingOrder?.deliveryTime) {
//     const deliveryDate = new Date(apiOrder.shippingOrder.deliveryTime);
//     scheduledDate = format(deliveryDate, "yyyy-MM-dd");
//     scheduledTime = format(deliveryDate, "HH:mm");
//   }

//   // Create status history from the order data
//   const statusHistory: StatusHistoryItem[] = [
//     {
//       status: mapOrderStatus(apiOrder.status),
//       timestamp: apiOrder.updatedAt,
//       actor: apiOrder.shippingOrder?.staff?.user.name || "System",
//       note: apiOrder.notes || undefined,
//     },
//   ];

//   // If there's a shipping order with delivery notes, add it to history
//   if (apiOrder.shippingOrder?.deliveryNotes) {
//     statusHistory.push({
//       status: apiOrder.shippingOrder.isDelivered ? "DELIVERED" : "IN_TRANSIT",
//       timestamp: apiOrder.shippingOrder.updatedAt,
//       actor: apiOrder.shippingOrder.staff?.user.name || "Delivery Staff",
//       note: apiOrder.shippingOrder.deliveryNotes,
//     });
//   }

//   return {
//     id: `ORD-${apiOrder.orderId}`,
//     customerName: apiOrder.userName,
//     orderItems,
//     address: apiOrder.address,
//     status: mapOrderStatus(apiOrder.status),
//     assignedTo,
//     scheduledDate,
//     scheduledTime,
//     createdAt: apiOrder.createdAt,
//     updatedAt: apiOrder.updatedAt,
//     totalPrice: apiOrder.totalPrice,
//     statusHistory,
//   };
// };

// export const convertApiStaffToFrontendStaff = (
//   apiStaff: ApiStaff
// ): FrontendStaff => {
//   // Calculate the number of assigned orders
//   const assignedOrdersCount = apiStaff.shippingOrders
//     ? apiStaff.shippingOrders.length
//     : 0;

//   // Determine availability based on the count
//   const availability: "Available" | "On Delivery" | "Off Duty" =
//     assignedOrdersCount >= 3 ? "On Delivery" : "Available";

//   return {
//     id: apiStaff.id,
//     name: apiStaff.user.name || `Staff #${apiStaff.id}`,
//     role: "Delivery Staff",
//     contact: apiStaff.user.phoneNumber || "N/A",
//     availability: availability,
//     assignedOrders: assignedOrdersCount,
//   };
// };

// export const formatDate = (dateString: string): string => {
//   try {
//     return new Date(dateString).toLocaleString();
//   } catch {
//     return dateString;
//   }
// };

// // Re-export the service for convenience
// export { default as orderManagementService } from "../api/Services/orderManagementService";
