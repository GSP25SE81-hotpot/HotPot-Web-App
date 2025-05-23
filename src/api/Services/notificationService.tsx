/* eslint-disable @typescript-eslint/no-explicit-any */
// notificationService.ts
import axiosClient from "../axiosInstance";
import {
  Notification,
  GetNotificationsParams,
  NotificationType,
  OrderNotificationData,
  FeedbackNotificationData,
  ReplacementRequestNotificationData,
  RentalNotificationData,
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

      // Since axiosClient.interceptors.response.use() returns response.data directly,
      // the 'apiData' here is already the data part, not the full axios response
      const apiData = await axiosClient.get<
        any,
        PaginatedNotificationsResponse,
        any
      >("/notifications", config);

      console.log("API data received for notifications:", apiData); // Updated log message for clarity

      // Return the apiData directly since it's already the PaginatedNotificationsResponse we need
      return apiData; // <--- CORRECTED LINE
    } catch (error) {
      console.error("Error fetching notifications:", error);

      return {
        notifications: [],
        currentPage: params.page || 1,
        pageSize: params.pageSize || 20,
        hasPreviousPage: (params.page || 1) > 1,
        // Consider adding other default fields from PaginatedNotificationsResponse if necessary
        // totalPages: 0,
        // totalCount: 0,
        // hasNextPage: false,
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

  // Handle notification click based on type with proper type checking
  handleNotificationClick(notification: Notification): void {
    // Type guard function to check if data matches a specific interface
    const hasOrderData = (data: any): data is OrderNotificationData =>
      data && typeof data.orderId === "number";

    const hasFeedbackData = (data: any): data is FeedbackNotificationData =>
      data && typeof data.feedbackId === "number";

    const hasReplacementData = (
      data: any
    ): data is ReplacementRequestNotificationData =>
      data && typeof data.requestId === "number";

    const hasRentalData = (data: any): data is RentalNotificationData =>
      data && typeof data.rentalId === "number";

    // Navigate or perform actions based on notification type
    switch (notification.type as NotificationType) {
      case NotificationType.OrderCreated:
      case NotificationType.OrderStatusChanged:
        if (hasOrderData(notification.data)) {
          // Navigate to order details
          window.location.href = `/orders/${notification.data.orderId}`;
        }
        break;

      case NotificationType.NewFeedback:
      case NotificationType.FeedbackApproved:
      case NotificationType.FeedbackResponse:
        if (hasFeedbackData(notification.data)) {
          // Navigate to feedback details
          window.location.href = `/feedback`;
        }
        break;

      case NotificationType.ReplacementRequestReceived:
      case NotificationType.ReplacementRequestStatusChanged:
      case NotificationType.ReplacementReviewed:
      case NotificationType.ReplacementStatusUpdate:
      case NotificationType.ReplacementCompleted:
      case NotificationType.EquipmentVerification:
        if (hasReplacementData(notification.data)) {
          // Navigate to replacement request details
          window.location.href = `/replacement-requests/${notification.data.requestId}`;
        }
        break;

      case NotificationType.RentalExtended:
      case NotificationType.RentalDateAdjusted:
      case NotificationType.RentalReturned:
        if (hasRentalData(notification.data)) {
          // Navigate to rental details
          window.location.href = `/rentals/${notification.data.rentalId}`;
        }
        break;

      case NotificationType.NewAssignment:
      case NotificationType.StaffReplacementAssignment:
        // Handle staff assignments
        if (notification.data && notification.data.assignmentId) {
          window.location.href = `/assignments/${notification.data.assignmentId}`;
        }
        break;

      default:
        // Default action or no action
        console.log(
          "No specific action for notification type:",
          notification.type
        );
        break;
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
      case NotificationType.OrderCreated:
      case NotificationType.OrderStatusChanged:
        return "shopping_cart";

      case NotificationType.NewFeedback:
      case NotificationType.FeedbackApproved:
      case NotificationType.FeedbackResponse:
        return "feedback";

      case NotificationType.ReplacementRequestReceived:
      case NotificationType.ReplacementRequestStatusChanged:
      case NotificationType.ReplacementReviewed:
      case NotificationType.ReplacementStatusUpdate:
      case NotificationType.ReplacementCompleted:
        return "swap_horiz";

      case NotificationType.RentalExtended:
      case NotificationType.RentalDateAdjusted:
      case NotificationType.RentalReturned:
        return "event_available";

      case NotificationType.NewAssignment:
      case NotificationType.StaffReplacementAssignment:
        return "assignment";

      case NotificationType.EquipmentVerification:
        return "verified";

      default:
        return "notifications";
    }
  }

  // Get color for notification type (for UI styling)
  getNotificationColor(type: string): string {
    switch (type as NotificationType) {
      case NotificationType.OrderCreated:
        return "success";

      case NotificationType.OrderStatusChanged:
        return "primary";

      case NotificationType.NewFeedback:
      case NotificationType.FeedbackApproved:
        return "secondary";

      case NotificationType.ReplacementRequestReceived:
      case NotificationType.ReplacementRequestStatusChanged:
        return "warning";

      case NotificationType.ReplacementCompleted:
        return "success";

      case NotificationType.RentalExtended:
      case NotificationType.RentalDateAdjusted:
        return "info";

      default:
        return "default";
    }
  }
}

export default new NotificationService();
