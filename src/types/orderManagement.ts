export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface FrontendOrder {
  id: string;
  customerName: string;
  orderItems: OrderItem[];
  address: string;
  status: OrderStatus;
  assignedTo?: FrontendStaff;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryItem[];
  totalPrice: number;
}

export interface FrontendStaff {
  id: number;
  name: string;
  avatar?: string;
  role: string;
  vehicle?: string;
  contact: string;
  availability: "Available" | "On Delivery" | "Off Duty";
  assignedOrders: number;
}

export interface StatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  actor: string;
  note?: string;
}

export type OrderStatus =
  | "PENDING_ASSIGNMENT"
  | "ASSIGNED"
  | "SCHEDULED"
  | "IN_PREPARATION"
  | "READY_FOR_PICKUP"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}
