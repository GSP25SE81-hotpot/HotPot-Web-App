/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/notifications.ts

// Base notification DTO
export interface GeneralNotificationDto {
  type: string;
  title: string;
  message: string;
  timestamp: Date;
}

// Equipment notifications
export interface EquipmentAlertDto extends GeneralNotificationDto {
  conditionLogId: number;
  equipmentType: string;
  equipmentName: string;
  issueName: string;
  description: string;
  scheduleType: string;
}

export interface EquipmentStatusDto extends GeneralNotificationDto {
  equipmentType: string;
  equipmentId: number;
  equipmentName: string;
  isAvailable: boolean;
  reason: string;
}

export interface StockAlertDto extends GeneralNotificationDto {
  equipmentType: string;
  equipmentName: string;
  currentQuantity: number;
  threshold: number;
}

export interface FeedbackResponseDto extends GeneralNotificationDto {
  feedbackId: number;
  responseMessage: string;
  responderName: string;
}

export interface ScheduleUpdateDto extends GeneralNotificationDto {
  userId: number;
  shiftDate: Date;
}

export interface EquipmentStatusUpdateDto extends GeneralNotificationDto {
  conditionLogId: number;
  equipmentType?: string;
  equipmentName?: string;
  issueName?: string;
  status: string;
}

// Rental notifications
export interface RentalExtendedDto extends GeneralNotificationDto {
  rentalId: number;
  newReturnDate: Date;
}

export interface RentalReturnedDto extends GeneralNotificationDto {
  rentalId: number;
}

export interface StaffAssignmentDto extends GeneralNotificationDto {
  assignmentId: number;
  assignment: any;
}

export interface AssignmentCompletedDto extends GeneralNotificationDto {
  assignmentId: number;
}

export interface ManagerPickupRequestDto extends GeneralNotificationDto {
  rentalId: number;
  customerName: string;
}

export interface ManagerAssignmentCompletedDto extends GeneralNotificationDto {
  assignmentId: number;
  staffId: number;
  staffName: string;
}

export interface PendingPickupDto extends GeneralNotificationDto {
  rentalId: number;
  customerName: string;
}

// Replacement notifications
export interface ReplacementRequestNotificationDto
  extends GeneralNotificationDto {
  replacementRequestId: number;
  equipmentType: string;
  equipmentName: string;
  requestReason: string;
  customerName: string;
  status: string;
  requestDate: Date;
}

export interface ReplacementStatusUpdateDto extends GeneralNotificationDto {
  replacementRequestId: number;
  equipmentType: string;
  equipmentName: string;
  status: string;
  statusMessage: string;
  reviewNotes?: string;
  updateDate: Date;
}

export interface CustomerReplacementUpdateDto extends GeneralNotificationDto {
  replacementRequestId: number;
  equipmentName: string;
  status: string;
  notes: string;
}

export interface StaffReplacementAssignmentDto extends GeneralNotificationDto {
  replacementRequestId: number;
  equipmentName: string;
  requestReason: string;
  status: string;
}

export interface CustomerDirectNotificationDto extends GeneralNotificationDto {
  conditionLogId: number;
  estimatedResolutionTime: Date;
}

// Add the missing types below:

// Frontend notification model
export interface Notification {
  id: number;
  type: string;
  data: any;
  timestamp: Date;
  read: boolean;
}

// Connection state type
export type ConnectionState =
  | "connected"
  | "disconnected"
  | "reconnecting"
  | "error";

// Toast notification type
export interface ToastNotification {
  id: number;
  open: boolean;
  severity: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  autoHideDuration: number;
}

// Notification context type
export interface NotificationContextType {
  notifications: Notification[];
  connectionState: ConnectionState;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: number) => void;
  clearAllNotifications: () => void;
  sendNotification: (methodName: string, ...args: any[]) => Promise<boolean>;

  // Specific notification methods
  notifyConditionIssue: (alert: EquipmentAlertDto) => Promise<boolean>;
  notifyStatusChange: (status: EquipmentStatusDto) => Promise<boolean>;
  notifyLowStock: (alert: StockAlertDto) => Promise<boolean>;
  notifyFeedbackResponse: (
    userId: number,
    response: FeedbackResponseDto
  ) => Promise<boolean>;
  notifyNewFeedback: (
    feedbackId: number,
    customerName: string,
    feedbackTitle: string
  ) => Promise<boolean>;
  notifyFeedbackApproved: (
    feedbackId: number,
    adminName: string,
    feedbackTitle: string
  ) => Promise<boolean>;
  notifyScheduleUpdate: (update: ScheduleUpdateDto) => Promise<boolean>;
  notifyAllScheduleUpdates: () => Promise<boolean>;
  sendResolutionUpdate: (
    conditionLogId: number,
    status: string,
    estimatedResolutionTime: Date,
    message: string
  ) => Promise<boolean>;
  sendCustomerUpdate: (
    customerId: number,
    conditionLogId: number,
    equipmentName: string,
    status: string,
    estimatedResolutionTime: Date,
    message: string
  ) => Promise<boolean>;
}
