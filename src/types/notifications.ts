/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/notifications.ts

// New simplified notification DTO
export interface GenericNotificationDto {
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  data?: any;
}

// Legacy notification DTOs (kept for backward compatibility)
export interface EquipmentAlertDto {
  conditionLogId: number;
  equipmentType: string;
  equipmentName: string;
  issueName: string;
  description: string;
  scheduleType: string;
}

export interface EquipmentStatusDto {
  equipmentType: string;
  equipmentId: number;
  equipmentName: string;
  isAvailable: boolean;
  reason: string;
}

export interface StockAlertDto {
  equipmentType: string;
  equipmentName: string;
  currentQuantity: number;
  threshold: number;
}

export interface FeedbackResponseDto {
  feedbackId: number;
  responseMessage: string;
  responderName: string;
}

export interface ScheduleUpdateDto {
  userId: number;
  shiftDate: Date;
}

export type NotificationPriority = "high" | "medium" | "low";

export type NotificationGroup =
  | "equipment"
  | "feedback"
  | "rental"
  | "replacement"
  | "schedule"
  | "system";

// Updated frontend notification model
export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data: any;
  timestamp: Date;
  read: boolean;
  priority: NotificationPriority;
  group: NotificationGroup;
}

// Connection state type
export type ConnectionState =
  | "connected"
  | "disconnected"
  | "reconnecting"
  | "error";

// Notification context type
export interface NotificationContextType {
  notifications: Notification[];
  connectionState: ConnectionState;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: number) => void;
  clearAllNotifications: () => void;
  sendNotification: (methodName: string, ...args: any[]) => Promise<boolean>;
  getNotificationsByGroup: (group: NotificationGroup) => Notification[];
  getNotificationsByPriority: (
    priority: NotificationPriority
  ) => Notification[];

  // New simplified notification methods
  notifyUser: (
    userId: number,
    type: string,
    title: string,
    message: string,
    data?: any
  ) => Promise<boolean>;
  notifyRole: (
    role: string,
    type: string,
    title: string,
    message: string,
    data?: any
  ) => Promise<boolean>;
  notifyBroadcast: (
    type: string,
    title: string,
    message: string,
    data?: any
  ) => Promise<boolean>;
}
