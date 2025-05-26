/* eslint-disable @typescript-eslint/no-explicit-any */
// notificationService.ts
import axiosClient from "../axiosInstance";
import {
  GetNotificationsParams,
  NotificationType,
  PaginatedNotificationsResponse,
} from "../../types/notificationTypes";

class NotificationService {
  // Fetch all notifications with optional filtering
  async getNotifications(
    params: GetNotificationsParams = {}
  ): Promise<PaginatedNotificationsResponse> {
    try {
      const { includeRead = false, page = 1, pageSize = 20 } = params;
      console.log("Requesting notifications with params:", {
        includeRead,
        page,
        pageSize,
      });
      const config = {
        params: { includeRead, page, pageSize },
        timeout: 10000,
        headers: {
          Accept: "application/json",
        },
      };
      console.log("Making request to:", "/notifications", config);

      const apiData = await axiosClient.get<
        any,
        PaginatedNotificationsResponse,
        any
      >("/notifications", config);
      console.log("API data received for notifications:", apiData);

      return apiData;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return {
        notifications: [],
        currentPage: params.page || 1,
        pageSize: params.pageSize || 20,
        hasPreviousPage: (params.page || 1) > 1,
      };
    }
  }

  // Fetch unread notification count
  async getUnreadCount(): Promise<number> {
    try {
      const response = await axiosClient.get("/notifications/count");
      // Handle different response structures
      if (response.data) {
        // Direct number response
        if (typeof response.data === "number") {
          return response.data;
        }
        // Object with count property
        if (response.data.count !== undefined) {
          return response.data.count;
        }
        // Object with unreadCount property
        if (response.data.unreadCount !== undefined) {
          return response.data.unreadCount;
        }
        // Nested data object with unreadCount
        if (
          response.data.data &&
          response.data.data.unreadCount !== undefined
        ) {
          return response.data.data.unreadCount;
        }
        console.log("Unexpected count response structure:", response.data);
      }
      return 0;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return 0;
    }
  }

  // Mark a notification as read
  async markAsRead(id: number): Promise<void> {
    try {
      await axiosClient.put(`/notifications/${id}/read`, {});
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    try {
      await axiosClient.put("/notifications/read-all", {});
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  // Format notification timestamp to a user-friendly string
  formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  // Get appropriate icon for notification type
  getNotificationIcon(type: string): string {
    switch (type as NotificationType) {
      case NotificationType.Order:
        return "shopping_cart";
      case NotificationType.Feedback:
        return "feedback";
      case NotificationType.RentOrder:
        return "event_available";
      case NotificationType.PrepOrder:
        return "kitchen";
      case NotificationType.ShipOrder:
        return "local_shipping";
      case NotificationType.Ingredient:
        return "restaurant";
      case NotificationType.EquipmentCondition:
      case NotificationType.EquipmentStock:
        return "inventory";
      case NotificationType.Schedule:
        return "calendar_today";
      default:
        return "notifications";
    }
  }

  // Get color for notification type (for UI styling)
  getNotificationColor(type: string): string {
    switch (type as NotificationType) {
      case NotificationType.Order:
        return "primary";
      case NotificationType.Feedback:
        return "secondary";
      case NotificationType.RentOrder:
        return "info";
      case NotificationType.PrepOrder:
        return "warning";
      case NotificationType.ShipOrder:
        return "success";
      case NotificationType.EquipmentCondition:
        return "error";
      case NotificationType.EquipmentStock:
        return "warning";
      case NotificationType.Ingredient:
        return "info";
      case NotificationType.Schedule:
        return "default";
      default:
        return "default";
    }
  }
}

export default new NotificationService();
