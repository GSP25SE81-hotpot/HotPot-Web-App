// src/hooks/useEquipmentNotifications.ts
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { equipmentStockHubService } from "../api/Services/hubServices";

export interface EquipmentNotification {
  id: number;
  type: "LowStock" | "StatusChange";
  equipmentType: string;
  equipmentName: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface UseEquipmentNotificationsOptions {
  showToasts?: boolean;
  autoConnect?: boolean;
}

export const useEquipmentNotifications = (
  options: UseEquipmentNotificationsOptions = {}
) => {
  const { showToasts = true, autoConnect = true } = options;
  const [notifications, setNotifications] = useState<EquipmentNotification[]>(
    []
  );
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Connect to the hub
  const connect = useCallback(async () => {
    try {
      setLoading(true);

      // Debug localStorage contents
      console.log("All localStorage keys:", Object.keys(localStorage));

      // Get the user info from localStorage
      const userDataLocal = localStorage.getItem("userInfor");
      console.log("Raw user data from localStorage:", userDataLocal);

      const userData = userDataLocal ? JSON.parse(userDataLocal) : null;
      console.log("Parsed user data:", userData);

      if (userData && userData.id) {
        // Connect to the hub
        await equipmentStockHubService.connect();

        // Register as admin if the user is an admin or manager
        if (userData.role === "Admin" || userData.role === "Manager") {
          await equipmentStockHubService.registerAdminConnection(userData.id);
        }

        setConnected(true);
        if (showToasts) {
          toast.success("Connected to equipment notifications");
        }
      } else {
        // More detailed error message
        if (!userDataLocal) {
          console.error(
            "User information not found in localStorage. Key 'userInfor' is missing."
          );
        } else if (!userData) {
          console.error("Failed to parse user information from localStorage.");
        } else if (!userData.id) {
          console.error(
            "User ID is missing in the user information:",
            userData
          );
        }
      }
    } catch (error) {
      console.error("Error connecting to equipment stock hub:", error);
      if (showToasts) {
        toast.error("Failed to connect to equipment notifications");
      }
    } finally {
      setLoading(false);
    }
  }, [showToasts]);

  // Disconnect from the hub
  const disconnect = useCallback(async () => {
    try {
      await equipmentStockHubService.disconnect();
      setConnected(false);
    } catch (error) {
      console.error("Error disconnecting from equipment stock hub:", error);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true }))
    );
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Add a new notification
  const addNotification = useCallback(
    (notification: Omit<EquipmentNotification, "id" | "isRead">) => {
      const newNotification: EquipmentNotification = {
        ...notification,
        id: Date.now(),
        isRead: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);

      if (showToasts) {
        const toastMessage = notification.message;
        if (notification.type === "LowStock") {
          toast.warning(toastMessage);
        } else if (notification.type === "StatusChange") {
          if (notification.message.includes("Available")) {
            toast.success(toastMessage);
          } else {
            toast.error(toastMessage);
          }
        }
      }
    },
    [showToasts]
  );

  // Add this effect to check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const userDataLocal = localStorage.getItem("userInfor");
      const userData = userDataLocal ? JSON.parse(userDataLocal) : null;
      setIsAuthenticated(!!userData && !!userData.id);
    };

    checkAuth();

    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Modify your auto-connect effect
  useEffect(() => {
    if (autoConnect && isAuthenticated) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, isAuthenticated, connect, disconnect]);

  // Set up listeners for notifications
  useEffect(() => {
    if (connected) {
      // Listen for low stock alerts
      equipmentStockHubService.onReceiveLowStockAlert(
        (
          equipmentType,
          equipmentName,
          currentQuantity,
          threshold,
          timestamp
        ) => {
          addNotification({
            type: "LowStock",
            equipmentType,
            equipmentName,
            message: `Low Stock Alert: ${equipmentName} is running low (${currentQuantity}/${threshold})`,
            timestamp: new Date(timestamp),
          });
        }
      );

      // Listen for status change alerts
      equipmentStockHubService.onReceiveStatusChangeAlert(
        (
          equipmentType,
          equipmentId,
          equipmentName,
          isAvailable,
          reason,
          timestamp
        ) => {
          const status =
            typeof isAvailable === "string"
              ? isAvailable
              : isAvailable
              ? "Available"
              : "Unavailable";

          addNotification({
            type: "StatusChange",
            equipmentType,
            equipmentName,
            message: `Status Change: ${equipmentName} is now ${status}${
              reason ? `. Reason: ${reason}` : ""
            }`,
            timestamp: new Date(timestamp),
          });
        }
      );
    }
  }, [connected, addNotification]);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    // Disconnect when component unmounts
    return () => {
      disconnect();
    };
  }, [autoConnect, connect, disconnect]);

  // Get unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications,
    unreadCount,
    connected,
    loading,
    connect,
    disconnect,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
  };
};
