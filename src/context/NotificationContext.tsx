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
  EquipmentAlertDto,
  EquipmentStatusDto,
  StockAlertDto,
  FeedbackResponseDto,
  ScheduleUpdateDto,
  NotificationGroup,
  NotificationPriority,
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
    if (!auth?.accessToken) {
      console.log("User not authenticated, not connecting to SignalR");
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
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
  }, [auth?.accessToken]);

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
          // console.log("Connection registered for user:", auth?.user?.id);
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

        await connection.start();
        console.log("SignalR Connected");
        setConnectionState("connected");

        if (auth?.user?.id) {
          await connection.invoke("RegisterConnection");
          setRegistrationStatus("registered");
        } else {
          throw new Error("User ID not available for SignalR connection");
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

        handleNotification("Error", {
          type: "Error",
          title: "Connection Error",
          message: errorMessage,
          timestamp: new Date(),
          severity: "error",
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

  // Register all notification handlers
  useEffect(() => {
    if (!hubConnection) return;

    // Equipment notifications
    hubConnection.on("ReceiveConditionAlert", (alert: EquipmentAlertDto) => {
      handleNotification("ConditionAlert", alert);
    });

    hubConnection.on("ReceiveLowStockAlert", (alert: StockAlertDto) => {
      handleNotification("LowStockAlert", alert);
    });

    hubConnection.on(
      "ReceiveStatusChangeAlert",
      (status: EquipmentStatusDto) => {
        handleNotification("StatusChange", status);
      }
    );

    hubConnection.on("ReceiveStatusUpdate", (statusUpdate: any) => {
      handleNotification("StatusUpdate", statusUpdate);
    });

    // Feedback notifications
    hubConnection.on(
      "ReceiveFeedbackResponse",
      (response: FeedbackResponseDto) => {
        handleNotification("FeedbackResponse", response);
      }
    );

    hubConnection.on(
      "ReceiveNewFeedback",
      (
        feedbackId: number,
        customerName: string,
        feedbackTitle: string,
        timestamp: Date
      ) => {
        handleNotification("NewFeedback", {
          feedbackId,
          customerName,
          feedbackTitle,
          timestamp,
        });
      }
    );

    hubConnection.on(
      "ReceiveApprovedFeedback",
      (
        feedbackId: number,
        feedbackTitle: string,
        adminName: string,
        timestamp: Date
      ) => {
        handleNotification("ApprovedFeedback", {
          feedbackId,
          feedbackTitle,
          adminName,
          timestamp,
        });
      }
    );

    // Schedule notifications
    hubConnection.on("ReceiveScheduleUpdate", (update: ScheduleUpdateDto) => {
      handleNotification("ScheduleUpdate", update);
    });

    hubConnection.on("ReceiveAllScheduleUpdates", () => {
      handleNotification("AllScheduleUpdates", {
        message: "All schedules have been updated",
      });
    });

    // Resolution notifications
    hubConnection.on(
      "ReceiveResolutionUpdate",
      (
        conditionLogId: number,
        status: string,
        estimatedResolutionTime: Date,
        message: string
      ) => {
        handleNotification("ResolutionUpdate", {
          conditionLogId,
          status,
          estimatedResolutionTime,
          message,
        });
      }
    );

    hubConnection.on(
      "ReceiveEquipmentUpdate",
      (
        conditionLogId: number,
        equipmentName: string,
        status: string,
        estimatedResolutionTime: Date,
        message: string
      ) => {
        handleNotification("EquipmentUpdate", {
          conditionLogId,
          equipmentName,
          status,
          estimatedResolutionTime,
          message,
        });
      }
    );

    // Rental notifications
    hubConnection.on("ReceiveRentalNotification", (notification: any) => {
      handleNotification("RentalNotification", notification);
    });

    // Replacement notifications
    hubConnection.on("ReceiveReplacementNotification", (notification: any) => {
      handleNotification("ReplacementNotification", notification);
    });

    hubConnection.on("ReceiveDirectNotification", (notification: any) => {
      handleNotification("DirectNotification", notification);
    });

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
      hubConnection.off("ReceiveConditionAlert");
      hubConnection.off("ReceiveLowStockAlert");
      hubConnection.off("ReceiveStatusChangeAlert");
      hubConnection.off("ReceiveStatusUpdate");
      hubConnection.off("ReceiveFeedbackResponse");
      hubConnection.off("ReceiveNewFeedback");
      hubConnection.off("ReceiveApprovedFeedback");
      hubConnection.off("ReceiveScheduleUpdate");
      hubConnection.off("ReceiveAllScheduleUpdates");
      hubConnection.off("ReceiveResolutionUpdate");
      hubConnection.off("ReceiveEquipmentUpdate");
      hubConnection.off("ReceiveRentalNotification");
      hubConnection.off("ReceiveReplacementNotification");
      hubConnection.off("ReceiveDirectNotification");
    };
  }, [hubConnection]);

  const determineNotificationGroup = (type: string): NotificationGroup => {
    if (
      type.includes("Equipment") ||
      type.includes("Stock") ||
      type.includes("Condition")
    ) {
      return "equipment";
    }
    if (type.includes("Feedback")) {
      return "feedback";
    }
    if (type.includes("Rental")) {
      return "rental";
    }
    if (type.includes("Replacement")) {
      return "replacement";
    }
    if (type.includes("Schedule")) {
      return "schedule";
    }
    return "system";
  };

  const determineNotificationPriority = (
    type: string,
    data: any
  ): NotificationPriority => {
    // High priority for critical equipment issues and urgent matters
    if (
      type === "ConditionAlert" ||
      type === "Error" ||
      data?.status === "critical" ||
      data?.priority === "high" ||
      type.includes("Emergency")
    ) {
      return "high";
    }

    // Medium priority for important but not critical notifications
    if (
      type === "LowStockAlert" ||
      type.includes("Status") ||
      type === "NewFeedback" ||
      type.includes("Resolution")
    ) {
      return "medium";
    }

    // Low priority for routine updates and informational notifications
    return "low";
  };

  const handleNotification = useCallback((type: string, data: any) => {
    const group = determineNotificationGroup(type);
    const priority = determineNotificationPriority(type, data);

    const newNotification: Notification = {
      id: Date.now(),
      type,
      data,
      timestamp: new Date(),
      read: false,
      group,
      priority,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

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

          handleNotification("Error", {
            type: "Error",
            title: `Failed to send ${methodName}`,
            message:
              error instanceof Error ? error.message : "Unknown error occurred",
            timestamp: new Date(),
            severity: "error",
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
    // Specific notification methods
    notifyConditionIssue: (alert: any) =>
      sendNotification("NotifyConditionIssue", alert),
    notifyStatusChange: (status: any) =>
      sendNotification("NotifyStatusChange", status),
    notifyLowStock: (alert: any) => sendNotification("NotifyLowStock", alert),
    notifyFeedbackResponse: (userId: any, response: any) =>
      sendNotification("NotifyFeedbackResponse", userId, response),
    notifyNewFeedback: (
      feedbackId: any,
      customerName: any,
      feedbackTitle: any
    ) =>
      sendNotification(
        "NotifyNewFeedback",
        feedbackId,
        customerName,
        feedbackTitle
      ),
    notifyFeedbackApproved: (
      feedbackId: any,
      adminName: any,
      feedbackTitle: any
    ) =>
      sendNotification(
        "NotifyFeedbackApproved",
        feedbackId,
        adminName,
        feedbackTitle
      ),
    notifyScheduleUpdate: (update: any) =>
      sendNotification("NotifyScheduleUpdate", update),
    notifyAllScheduleUpdates: () =>
      sendNotification("NotifyAllScheduleUpdates"),
    sendResolutionUpdate: (
      conditionLogId: any,
      status: any,
      estimatedResolutionTime: any,
      message: any
    ) =>
      sendNotification(
        "SendResolutionUpdate",
        conditionLogId,
        status,
        estimatedResolutionTime,
        message
      ),
    sendCustomerUpdate: (
      customerId: any,
      conditionLogId: any,
      equipmentName: any,
      status: any,
      estimatedResolutionTime: any,
      message: any
    ) =>
      sendNotification(
        "SendCustomerUpdate",
        customerId,
        conditionLogId,
        equipmentName,
        status,
        estimatedResolutionTime,
        message
      ),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
