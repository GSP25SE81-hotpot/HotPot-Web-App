// // src/components/order-management/utils/statusUtils.ts

// import { OrderStatus } from "../types/orderManagement";
// import {
//   AssignmentInd,
//   Person,
//   Schedule,
//   Timeline,
//   LocalShipping,
//   CheckCircle,
// } from "@mui/icons-material";
// import React from "react";

// export const mapOrderStatus = (status: string): OrderStatus => {
//   switch (status.toLowerCase()) {
//     case "pending":
//       return "PENDING_ASSIGNMENT";
//     case "processing":
//       return "ASSIGNED";
//     case "shipping":
//       return "IN_TRANSIT";
//     case "delivered":
//       return "DELIVERED";
//     case "cancelled":
//       return "CANCELLED";
//     case "returning":
//       return "CANCELLED";
//     case "completed":
//       return "DELIVERED";
//     default:
//       return "PENDING_ASSIGNMENT";
//   }
// };

// export const mapToBackendStatus = (status: OrderStatus): string => {
//   switch (status) {
//     case "PENDING_ASSIGNMENT":
//       return "Pending";
//     case "ASSIGNED":
//     case "SCHEDULED":
//     case "IN_PREPARATION":
//     case "READY_FOR_PICKUP":
//       return "Processing";
//     case "IN_TRANSIT":
//       return "Shipping";
//     case "DELIVERED":
//       return "Delivered";
//     case "CANCELLED":
//       return "Cancelled";
//     default:
//       return "Pending";
//   }
// };

// export const getStatusIcon = (status: OrderStatus): React.ReactElement => {
//   switch (status) {
//     case "PENDING_ASSIGNMENT":
//       return <AssignmentInd />;
//     case "ASSIGNED":
//       return <Person />;
//     case "SCHEDULED":
//       return <Schedule />;
//     case "IN_PREPARATION":
//       return <Timeline />;
//     case "READY_FOR_PICKUP":
//       return <LocalShipping />;
//     case "IN_TRANSIT":
//       return <LocalShipping />;
//     case "DELIVERED":
//       return <CheckCircle />;
//     case "CANCELLED":
//       return <Schedule />;
//     default:
//       return <AssignmentInd />;
//   }
// };

// export const getAvailableNextStatuses = (
//   currentStatus: OrderStatus
// ): OrderStatus[] => {
//   switch (currentStatus) {
//     case "PENDING_ASSIGNMENT":
//       return ["ASSIGNED"];
//     case "ASSIGNED":
//       return ["SCHEDULED", "CANCELLED"];
//     case "SCHEDULED":
//       return ["IN_PREPARATION", "CANCELLED"];
//     case "IN_PREPARATION":
//       return ["READY_FOR_PICKUP", "CANCELLED"];
//     case "READY_FOR_PICKUP":
//       return ["IN_TRANSIT"];
//     case "IN_TRANSIT":
//       return ["DELIVERED"];
//     case "DELIVERED":
//       return [];
//     case "CANCELLED":
//       return ["PENDING_ASSIGNMENT"];
//     default:
//       return [];
//   }
// };

// export const statusSteps: OrderStatus[] = [
//   "PENDING_ASSIGNMENT",
//   "ASSIGNED",
//   "SCHEDULED",
//   "IN_PREPARATION",
//   "READY_FOR_PICKUP",
//   "IN_TRANSIT",
//   "DELIVERED",
// ];
