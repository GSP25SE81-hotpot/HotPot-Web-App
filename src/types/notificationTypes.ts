/* eslint-disable @typescript-eslint/no-explicit-any */
// notificationTypes.ts

// Main notification type that matches the C# NotificationDto
export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  timestamp: string; // ISO date string
  data: Record<string, any>; // Dictionary<string, object> in C#
  isRead: boolean;
  readAt: string | null; // DateTime? in C#
  isDelivered: boolean;
  deliveredAt: string | null; // DateTime? in C#
}

// Parameters for fetching notifications
export interface GetNotificationsParams {
  includeRead?: boolean;
  page?: number;
  pageSize?: number;
}

// Response type for notification count
export interface UnreadCountResponse {
  count: number;
}

// Notification types for type checking
export enum NotificationType {
  Order = "Order",
  Feedback = "Feedback",
  EquipmentCondition = "EquipmentCondition",
  EquipmentStock = "EquipmentStock",
  RentOrder = "RentOrder",
  Schedule = "Schedule",
  PrepOrder = "PrepOrder",
  ShipOrder = "ShipOrder",
  Ingredient = "Ingredient",
}

// Type definitions for specific notification data
export interface OrderNotificationData {
  orderId: number;
  status?: string;
  previousStatus?: string;
}

export interface FeedbackNotificationData {
  feedbackId: number;
  title?: string;
  responseMessage?: string;
  responderName?: string;
  responseDate?: string;
  rejectionReason?: string;
}

export interface ReplacementRequestNotificationData {
  requestId: number;
  equipmentName?: string;
  status?: string;
  reviewNotes?: string;
  nextSteps?: string;
  staffName?: string;
  isFaulty?: boolean;
  verificationNotes?: string;
  completionNotes?: string;
  completionDate?: string;
}

export interface RentalNotificationData {
  rentalId: number;
  originalReturnDate?: string;
  newReturnDate?: string;
  extensionDays?: number;
  equipmentSummary?: string;
  extensionDate?: string;
  adjustmentReason?: string;
  adjustmentType?: string;
  returnDate?: string;
  returnCondition?: string;
}

export interface AssignmentNotificationData {
  assignmentId: number;
  orderId: number;
  customerName?: string;
  pickupAddress?: string;
  notes?: string;
  assignmentType?: string;
}

// SignalR hub connection events
export interface NotificationHubEvents {
  ReceiveNotification: (notification: Notification) => void;
}

export interface NotificationCenterProps {
  userId?: number;
}

export interface PaginatedNotificationsResponse {
  notifications: Notification[];
  currentPage: number;
  pageSize: number;
  hasPreviousPage: boolean;
}

export interface NotificationCountResponse {
  unreadCount: number;
  totalCount: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
}
