/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/contexts/NotificationContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import * as signalR from "@microsoft/signalr";
import {
  Notification,
  NotificationContextType,
  ConnectionState,
  NotificationGroup,
  NotificationPriority,
  GenericNotificationDto,
} from "../types/notifications";
import useAuth from "../hooks/useAuth";

const STORAGE_KEY = "hotpot_notifications";
const MAX_STORED_NOTIFICATIONS = 50;

// Helper to load notifications from localStorage
const loadStoredNotifications = (): Notification[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Error loading stored notifications:", error);
    return [];
  }
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    loadStoredNotifications()
  );
  const [hubConnection, setHubConnection] =
    useState<signalR.HubConnection | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const { auth } = useAuth();
  const [registrationStatus, setRegistrationStatus] = useState<
    "pending" | "registered" | "failed"
  >("pending");

  // Persist notifications to localStorage
  useEffect(() => {
    try {
      // Only store the most recent notifications to prevent storage issues
      const recentNotifications = notifications.slice(
        0,
        MAX_STORED_NOTIFICATIONS
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentNotifications));
    } catch (error) {
      console.error("Error saving notifications to storage:", error);
    }
  }, [notifications]);

  // Initialize SignalR connection
  useEffect(() => {
    // Wait for both accessToken and userId to be available
    if (!auth?.accessToken || !auth?.user?.id) {
      console.log(
        "User not authenticated or userId missing, not connecting to SignalR"
      );
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      // https://localhost:7163
      // https://hpty.vinhuser.one
      .withUrl("https://hpty.vinhuser.one/notificationHub", {
        accessTokenFactory: () => auth.accessToken || "",
      })
      .withAutomaticReconnect()
      .build();

    setHubConnection(connection);
    startConnection(connection);

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [auth?.accessToken, auth?.user?.id]);

  // Register connection when user ID becomes available
  useEffect(() => {
    if (
      hubConnection &&
      connectionState === "connected" &&
      auth?.user?.id &&
      registrationStatus === "pending"
    ) {
      hubConnection
        .invoke("RegisterConnection")
        .then(() => {
          setRegistrationStatus("registered");
        })
        .catch((err) => {
          console.error("Error registering connection:", err);
          setRegistrationStatus("failed");
        });
    }
  }, [hubConnection, connectionState, auth?.user?.id, registrationStatus]);

  const startConnection = useCallback(
    async (connection: signalR.HubConnection) => {
      try {
        if (!auth?.accessToken) {
          throw new Error("No access token available");
        }
        // Only start if the connection is disconnected
        if (connection.state === signalR.HubConnectionState.Disconnected) {
          await connection.start();
          console.log("SignalR Connected");
          setConnectionState("connected");
          if (auth?.user?.id) {
            await connection.invoke("RegisterConnection");
            setRegistrationStatus("registered");
          } else {
            throw new Error("User ID not available for SignalR connection");
          }
        } else {
          console.log(
            "SignalR connection is not in 'Disconnected' state, current state:",
            connection.state
          );
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown connection error";
        console.error("SignalR Connection Error: ", {
          error: err,
          userId: auth?.user?.id,
          connectionState,
          timestamp: new Date().toISOString(),
        });
        setConnectionState("error");
        setRegistrationStatus("failed");
        handleNotification({
          type: "Error",
          title: "Connection Error",
          message: errorMessage,
          timestamp: new Date(),
          data: { severity: "error" },
        });

        // Retry connection after delay
        setTimeout(() => {
          if (auth?.accessToken) {
            startConnection(connection);
          }
        }, 5000);
      }
    },
    [auth]
  );

  // Register the new simplified notification handlers
  useEffect(() => {
    if (!hubConnection) return;

    // Main notification handler for user-specific notifications
    hubConnection.on(
      "ReceiveNotification",
      (notification: GenericNotificationDto) => {
        handleNotification(notification);
      }
    );

    // Role-based notification handler
    hubConnection.on(
      "ReceiveRoleNotification",
      (notification: GenericNotificationDto) => {
        handleNotification(notification);
      }
    );

    // Broadcast notification handler
    hubConnection.on(
      "ReceiveBroadcastNotification",
      (notification: GenericNotificationDto) => {
        handleNotification(notification);
      }
    );

    // Handle reconnection
    hubConnection.onreconnected(() => {
      setConnectionState("connected");
      // Re-register connection
      hubConnection
        .invoke("RegisterConnection")
        .catch((err) =>
          console.error("Error re-registering connection: ", err)
        );
    });

    hubConnection.onreconnecting(() => {
      setConnectionState("reconnecting");
    });

    hubConnection.onclose(() => {
      setConnectionState("disconnected");
    });

    return () => {
      // Unregister all handlers when component unmounts
      hubConnection.off("ReceiveNotification");
      hubConnection.off("ReceiveRoleNotification");
      hubConnection.off("ReceiveBroadcastNotification");
    };
  }, [hubConnection]);

  const determineNotificationGroup = (type: string): NotificationGroup => {
    if (
      type.includes("Equipment") ||
      type.includes("Stock") ||
      type.includes("Condition") ||
      type.includes("Utensil") ||
      type.includes("HotPot") ||
      type.includes("Inventory") ||
      type.includes("OutOfStock") ||
      type.includes("LowStock")
    ) {
      return "equipment";
    }
    if (type.includes("Feedback")) {
      return "feedback";
    }
    if (
      type.includes("Rental") ||
      type.includes("Return") ||
      type.includes("Pickup")
    ) {
      return "rental";
    }
    if (type.includes("Replacement")) {
      return "replacement";
    }
    if (
      type.includes("Schedule") ||
      type.includes("Shift") ||
      type.includes("WorkDay")
    ) {
      return "schedule";
    }
    return "system";
  };

  const determineNotificationPriority = (
    notification: GenericNotificationDto
  ): NotificationPriority => {
    // Check if priority is explicitly set in the data
    if (notification.data && notification.data.priority) {
      const dataPriority = notification.data.priority.toLowerCase();
      if (
        dataPriority === "high" ||
        dataPriority === "medium" ||
        dataPriority === "low"
      ) {
        return dataPriority as NotificationPriority;
      }
    }

    // High priority for critical equipment issues and urgent matters
    if (
      notification.type === "ConditionIssue" ||
      notification.type === "Error" ||
      notification.type === "OutOfStock" ||
      notification.type === "Emergency" ||
      notification.type.includes("Critical") ||
      notification.type.includes("Urgent")
    ) {
      return "high";
    }

    // Medium priority for important but not critical notifications
    if (
      notification.type === "LowStock" ||
      notification.type.includes("Status") ||
      notification.type === "FeedbackResponse" ||
      notification.type === "ReplacementVerified" ||
      notification.type === "ReplacementCompleted" ||
      notification.type === "DirectMessage"
    ) {
      return "medium";
    }

    // Low priority for routine updates and informational notifications
    return "low";
  };

  const handleNotification = useCallback(
    (notification: GenericNotificationDto) => {
      const group = determineNotificationGroup(notification.type);
      const priority = determineNotificationPriority(notification);

      const newNotification: Notification = {
        id: Date.now(),
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
        timestamp: new Date(notification.timestamp),
        read: false,
        group,
        priority,
      };

      setNotifications((prev) => [newNotification, ...prev]);
    },
    []
  );

  const getNotificationsByGroup = useCallback(
    (group: NotificationGroup) => {
      return notifications.filter(
        (notification) => notification.group === group
      );
    },
    [notifications]
  );

  const getNotificationsByPriority = useCallback(
    (priority: NotificationPriority) => {
      return notifications.filter(
        (notification) => notification.priority === priority
      );
    },
    [notifications]
  );

  const markAsRead = useCallback((notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  }, []);

  const clearNotification = useCallback((notificationId: number) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Methods to send notifications to the server
  const sendNotification = useCallback(
    async (methodName: string, ...args: any[]): Promise<boolean> => {
      if (hubConnection && connectionState === "connected") {
        try {
          await hubConnection.invoke(methodName, ...args);
          return true;
        } catch (error) {
          console.error(`Error in ${methodName}:`, {
            error,
            args,
            connectionState,
            userId: auth?.user?.id,
            timestamp: new Date().toISOString(),
          });
          handleNotification({
            type: "Error",
            title: `Failed to send ${methodName}`,
            message:
              error instanceof Error ? error.message : "Unknown error occurred",
            timestamp: new Date(),
            data: { severity: "error" },
          });
          return false;
        }
      } else {
        console.warn("Cannot send notification: Hub not connected", {
          methodName,
          connectionState,
          hasHub: !!hubConnection,
        });
        return false;
      }
    },
    [hubConnection, connectionState, auth?.user?.id]
  );

  // New simplified notification methods
  const notifyUser = useCallback(
    (
      userId: number,
      type: string,
      title: string,
      message: string,
      data?: any
    ) => {
      return sendNotification(
        "NotifyUser",
        userId,
        type,
        title,
        message,
        data || {}
      );
    },
    [sendNotification]
  );

  const notifyRole = useCallback(
    (
      role: string,
      type: string,
      title: string,
      message: string,
      data?: any
    ) => {
      return sendNotification(
        "NotifyRole",
        role,
        type,
        title,
        message,
        data || {}
      );
    },
    [sendNotification]
  );

  const notifyBroadcast = useCallback(
    (type: string, title: string, message: string, data?: any) => {
      return sendNotification(
        "NotifyBroadcast",
        type,
        title,
        message,
        data || {}
      );
    },
    [sendNotification]
  );

  const value: NotificationContextType = {
    notifications,
    connectionState,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    sendNotification,
    getNotificationsByGroup,
    getNotificationsByPriority,

    // New simplified notification methods
    notifyUser,
    notifyRole,
    notifyBroadcast,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
