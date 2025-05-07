/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/notifications.ts

// New simplified notification DTO
export interface GenericNotificationDto {
  type: string;
  title: string;
  message: string;
  timestamp: Date; // Stays as Date, client will receive string and parse to Date
  data?: any;
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
