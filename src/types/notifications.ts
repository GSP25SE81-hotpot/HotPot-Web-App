/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/notifications.ts

// New simplified notification DTO
export interface GenericNotificationDto {
  Type: string;
  Title: string;
  Message: string;
  Timestamp: string; // Server sends string, client will parse to Date
  Data?: Record<string, any>;
}

export interface ClientNotificationDto {
  Type: string;
  Title: string;
  Message: string;
  Timestamp: string; // ISO string format for DateTime
  Data: Record<string, any>;
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
export const notificationTranslations: Record<string, { title: string; message: string }> = {
  "ConditionIssue": {
    title: "Vấn đề về thiết bị",
    message: "Thiết bị {equipmentName} có vấn đề: {issue}"
  },
  "LowStock": {
    title: "Hàng tồn kho thấp",
    message: "Thiết bị {equipmentName} sắp hết hàng. Số lượng hiện tại: {currentQuantity}"
  },
  "FeedbackResponse": {
    title: "Phản hồi từ quản lý",
    message: "Bạn đã nhận được phản hồi về góp ý của mình"
  },
  // Add more translations as needed
};

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  translatedTitle?: string; // Add translated fields
  translatedMessage?: string;
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
  | "connecting" // Added "connecting"
  | "error";

// Notification context type
export interface NotificationContextType {
  notifications: Notification[];
  connectionState: ConnectionState;
  registrationStatus: "pending" | "registered" | "failed"; // Added registrationStatus
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: number) => void;
  clearAllNotifications: () => void;
  // sendNotification: (methodName: string, ...args: any[]) => Promise<boolean>; // This was commented out in the provided context, keeping it so. If needed, it can be uncommented.
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
