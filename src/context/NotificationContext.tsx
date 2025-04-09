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
} from "../types/notifications";

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hubConnection, setHubConnection] =
    useState<signalR.HubConnection | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");

  // Initialize SignalR connection
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7163/notificationHub", {
        accessTokenFactory: () => localStorage.getItem("jwt_token") || "",
      })
      .withAutomaticReconnect()
      .build();

    setHubConnection(connection);

    // Start the connection
    startConnection(connection);

    // Clean up on unmount
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  const startConnection = useCallback(
    async (connection: signalR.HubConnection) => {
      try {
        await connection.start();
        console.log("SignalR Connected");
        setConnectionState("connected");

        // Register connection with the hub
        await connection.invoke("RegisterConnection");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        setConnectionState("error");
        // Retry after 5 seconds
        setTimeout(() => startConnection(connection), 5000);
      }
    },
    []
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

  const handleNotification = useCallback((type: string, data: any) => {
    const newNotification: Notification = {
      id: Date.now(), // Simple unique ID
      type,
      data,
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // You could also trigger a toast here
  }, []);

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
          console.error(`Error sending ${methodName}:`, error);
          return false;
        }
      } else {
        console.warn("Cannot send notification: Hub not connected");
        return false;
      }
    },
    [hubConnection, connectionState]
  );

  const value: NotificationContextType = {
    notifications,
    connectionState,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    sendNotification,
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
