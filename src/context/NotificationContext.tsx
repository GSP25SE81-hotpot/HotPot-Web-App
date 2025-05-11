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
  GenericNotificationDto, // Assuming this is the DTO for incoming notifications
  ClientNotificationDto,
} from "../types/notifications"; // Ensure this path is correct
import useAuth from "../hooks/useAuth"; // Ensure this path is correct

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
    if (!auth?.accessToken || !auth?.user?.id) {
      console.log(
        "User not authenticated or userId missing, not connecting to SignalR"
      );
      if (hubConnection) {
        // Ensure any existing connection is stopped if auth disappears
        hubConnection.stop();
        setHubConnection(null);
        setConnectionState("disconnected");
        setRegistrationStatus("pending");
      }
      return;
    }

    // Ensure a new connection isn't created if one already exists and is not disconnected
    if (
      hubConnection &&
      hubConnection.state !== signalR.HubConnectionState.Disconnected
    ) {
      console.log("SignalR connection already exists and is not disconnected.");
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://hpty.vinhuser.one/notificationHub", {
        // Ensure this URL is correct
        accessTokenFactory: () => auth.accessToken || "",
      })
      .withAutomaticReconnect()
      .build();

    setHubConnection(connection);
    // `startConnection` is now called within the registration useEffect or when auth changes.
    // This avoids race conditions with `auth.user.id` potentially not being immediately available.

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [auth?.accessToken]); // Removed auth?.user?.id as start/register handles it.

  // Start connection and Register connection when user ID and hubConnection are available
  useEffect(() => {
    if (
      hubConnection &&
      auth?.accessToken &&
      auth?.user?.id &&
      connectionState === "disconnected" &&
      registrationStatus === "pending"
    ) {
      startConnection(hubConnection);
    } else if (
      hubConnection &&
      connectionState === "connected" &&
      auth?.user?.id &&
      registrationStatus === "pending"
    ) {
      // If already connected but not registered (e.g., after a quick auth update)
      console.log("Connection established, attempting to register.");
      hubConnection
        .invoke("RegisterConnection")
        .then(() => {
          console.log("SignalR Connection Registered (from effect).");
          setRegistrationStatus("registered");
        })
        .catch((err) => {
          console.error("Error registering connection (from effect):", err);
          setRegistrationStatus("failed");
        });
    }
  }, [
    hubConnection,
    connectionState,
    auth?.accessToken,
    auth?.user?.id,
    registrationStatus,
  ]);

  const startConnection = useCallback(
    async (connection: signalR.HubConnection) => {
      if (connection.state !== signalR.HubConnectionState.Disconnected) {
        console.log(
          "StartConnection called, but connection not in Disconnected state. Current state:",
          connection.state
        );
        // If it's already connected and registration is pending, try to register.
        if (
          connection.state === signalR.HubConnectionState.Connected &&
          auth?.user?.id &&
          registrationStatus === "pending"
        ) {
          console.log("Attempting to register on an already connected hub.");
          try {
            await connection.invoke("RegisterConnection");
            setRegistrationStatus("registered");
            console.log("SignalR Connection Re-Registered successfully.");
          } catch (err) {
            console.error("Error re-registering connection:", err);
            setRegistrationStatus("failed");
          }
        }
        return;
      }

      setConnectionState("connecting");
      try {
        if (!auth?.accessToken) {
          throw new Error("No access token available for starting connection.");
        }
        await connection.start();
        console.log("SignalR Connected successfully.");
        setConnectionState("connected");

        if (auth?.user?.id) {
          console.log("Attempting to register connection post-start.");
          await connection.invoke("RegisterConnection");
          setRegistrationStatus("registered");
          console.log("SignalR Connection Registered post-start.");
        } else {
          setRegistrationStatus("pending"); // User ID might not be available yet, will be picked up by useEffect
          console.warn(
            "User ID not available immediately after SignalR connection, registration pending."
          );
        }
      } catch (err) {
        console.error("SignalR Connection Error: ", {
          error: err,
          userId: auth?.user?.id,
          connectionState: "error", // local state before setting
          timestamp: new Date().toISOString(),
        });
        setConnectionState("error");
        setRegistrationStatus("failed");
        // It's generally better to let withAutomaticReconnect handle retries
        // unless specific UI feedback or logic is needed for manual retries.
        // If you keep setTimeout, ensure it doesn't conflict with withAutomaticReconnect.
        // For now, relying on withAutomaticReconnect.
      }
    },
    [auth?.accessToken, auth?.user?.id, registrationStatus] // Added registrationStatus
  );

  // Register SignalR event handlers
  useEffect(() => {
    if (!hubConnection) return;

    // Main notification handler for all server-sent notifications
    // The backend uses "ReceiveNotification" for user, role, and other notifications.
    hubConnection.on(
      "ReceiveNotification",
      (notification: GenericNotificationDto) => {
        // Ensure GenericNotificationDto matches server's NotificationDto
        console.log("Received notification from server:", notification);
        handleNotification(notification);
      }
    );

    // REMOVED: hubConnection.on("ReceiveRoleNotification", ...);
    // REMOVED: hubConnection.on("ReceiveBroadcastNotification", ...);
    // Backend sends all notifications via "ReceiveNotification"

    hubConnection.onreconnected(async (connectionId?: string) => {
      console.log("SignalR Reconnected. Connection ID:", connectionId);
      setConnectionState("connected");
      setRegistrationStatus("pending"); // Set to pending to trigger re-registration
      // Re-registration will be handled by the useEffect watching [hubConnection, connectionState, auth?.user?.id, registrationStatus]
      // or by startConnection if it's called during reconnect logic.
      // Explicitly invoking here can also work if the above effect doesn't cover all cases.
      if (auth?.user?.id) {
        try {
          await hubConnection.invoke("RegisterConnection");
          setRegistrationStatus("registered");
          console.log(
            "SignalR Connection Re-Registered successfully onreconnected."
          );
        } catch (err) {
          console.error("Error re-registering connection onreconnected: ", err);
          setRegistrationStatus("failed");
        }
      } else {
        console.warn(
          "Cannot re-register onreconnected: User ID not available."
        );
      }
    });

    hubConnection.onreconnecting((error?: Error) => {
      console.log("SignalR Reconnecting...", error || "");
      setConnectionState("reconnecting");
      setRegistrationStatus("pending"); // Connection is not stable yet
    });

    hubConnection.onclose((error?: Error) => {
      console.log("SignalR Connection Closed.", error || "");
      setConnectionState("disconnected");
      setRegistrationStatus("pending"); // Reset registration status on close
    });

    return () => {
      // Unregister all handlers when component unmounts or hubConnection changes
      hubConnection.off("ReceiveNotification");
      // No need to off "ReceiveRoleNotification" or "ReceiveBroadcastNotification" as they were removed
      hubConnection.off("onreconnected");
      hubConnection.off("onreconnecting");
      hubConnection.off("onclose");
    };
  }, [hubConnection, auth?.user?.id]); // Added auth.user.id for re-registration logic

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
    notification: GenericNotificationDto // Using GenericNotificationDto as received from server
  ): NotificationPriority => {
    if (notification.Data && notification.Data.priority) {
      const dataPriority = String(notification.Data.priority).toLowerCase();
      if (["high", "medium", "low"].includes(dataPriority)) {
        return dataPriority as NotificationPriority;
      }
    }
    if (
      notification.Type === "ConditionIssue" ||
      notification.Type === "Error" ||
      notification.Type === "OutOfStock" ||
      notification.Type === "Emergency" ||
      notification.Type.includes("Critical") ||
      notification.Type.includes("Urgent")
    ) {
      return "high";
    }
    if (
      notification.Type === "LowStock" ||
      notification.Type.includes("Status") ||
      notification.Type === "FeedbackResponse" ||
      notification.Type === "ReplacementVerified" ||
      notification.Type === "ReplacementCompleted" ||
      notification.Type === "DirectMessage"
    ) {
      return "medium";
    }
    return "low";
  };

  const handleNotification = useCallback(
    (notificationDto: GenericNotificationDto) => {
      // Check for duplicate notification before adding
      const isDuplicate = notifications.some(
        (n) => 
          n.type === notificationDto.Type &&
          n.title === notificationDto.Title &&
          n.message === notificationDto.Message &&
          new Date(n.timestamp).getTime() - new Date(notificationDto.Timestamp).getTime() < 1000
      );

      if (isDuplicate) return;

      const group = determineNotificationGroup(notificationDto.Type);
      const priority = determineNotificationPriority(notificationDto);

      const newNotification: Notification = {
        id: Date.now() + Math.random(),
        type: notificationDto.Type,
        title: notificationDto.Title,
        message: notificationDto.Message,
        data: notificationDto.Data || {},
        timestamp: new Date(notificationDto.Timestamp),
        read: false,
        group,
        priority,
      };

      setNotifications((prev) => [
        newNotification,
        ...prev.slice(0, MAX_STORED_NOTIFICATIONS - 1),
      ]);
    },
    [] // determineNotificationGroup and determineNotificationPriority are stable
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

  // Generic method to send notifications to the server
  const sendNotificationToServer = useCallback(
    // Renamed for clarity
    async (methodName: string, ...args: any[]): Promise<boolean> => {
      if (
        hubConnection &&
        hubConnection.state === signalR.HubConnectionState.Connected &&
        registrationStatus === "registered"
      ) {
        try {
          await hubConnection.invoke(methodName, ...args);
          console.log(`Successfully invoked ${methodName} on server.`);
          return true;
        } catch (error) {
          console.error(`Error invoking ${methodName} on server:`, {
            error,
            args,
            connectionState: hubConnection.state,
            registrationStatus,
            userId: auth?.user?.id,
            timestamp: new Date().toISOString(),
          });
          // Optionally, create a local error notification for the user
          handleNotification({
            Type: "Error",
            Title: `Failed to send: ${methodName}`,
            Message:
              error instanceof Error ? error.message : "Unknown server error",
            Timestamp: new Date().toISOString(), // Convert Date to ISO string format
            Data: { severity: "error", originalMethod: methodName },
          });
          return false;
        }
      } else {
        console.warn(
          "Cannot send notification: Hub not connected or not registered.",
          {
            methodName,
            connectionState: hubConnection?.state,
            registrationStatus,
            hasHub: !!hubConnection,
          }
        );
        // Optionally, create a local warning notification
        handleNotification({
          Type: "Warning",
          Title: "Cannot Send Notification",
          Message:
            "Connection to the notification server is not active. Please try again later.",
          Timestamp: new Date().toISOString(), // Use Date object
          Data: { severity: "warning" },
        });
        return false;
      }
    },
    [hubConnection, registrationStatus, auth?.user?.id, handleNotification] // Added handleNotification
  );

  // --- Client-to-Server Notification Methods ---

  const notifyUser = useCallback(
    async (
      userId: number,
      type: string,
      title: string,
      message: string,
      data?: Record<string, any>
    ): Promise<boolean> => {
      const notificationDto: ClientNotificationDto = {
        Type: type,
        Title: title,
        Message: message,
        Timestamp: new Date().toISOString(),
        Data: data || {},
      };
      // Server's Hub Method: public async Task SendUserNotification(int userId, NotificationDto notification)
      return sendNotificationToServer(
        "SendUserNotification", // Corrected method name
        userId,
        notificationDto // Pass DTO as the second argument
      );
    },
    [sendNotificationToServer]
  );

  const notifyRole = useCallback(
    async (
      role: string,
      type: string,
      title: string,
      message: string,
      data?: Record<string, any>
    ): Promise<boolean> => {
      const notificationDto: ClientNotificationDto = {
        Type: type,
        Title: title,
        Message: message,
        Timestamp: new Date().toISOString(),
        Data: data || {},
      };
      // Server's Hub Method: public async Task SendRoleNotification(string role, NotificationDto notification)
      return sendNotificationToServer(
        "SendRoleNotification", // Corrected method name
        role,
        notificationDto // Pass DTO as the second argument
      );
    },
    [sendNotificationToServer]
  );

  const notifyBroadcast = useCallback(
    async (
      type: string,
      title: string,
      message: string,
      data?: Record<string, any>
    ): Promise<boolean> => {
      const notificationDto: ClientNotificationDto = {
        Type: type,
        Title: title,
        Message: message,
        Timestamp: new Date().toISOString(),
        Data: data || {},
      };
      // IMPORTANT: "SendBroadcastNotification" method needs to be implemented on the backend NotificationHub.
      // Example backend hub method:
      // public async Task SendBroadcastNotification(NotificationDto notification)
      // {
      //     await Clients.All.ReceiveNotification(notification); // Or a specific group for broadcasts
      // }
      console.warn(
        "notifyBroadcast called. Ensure 'SendBroadcastNotification' method exists on the backend SignalR Hub and is configured to broadcast as intended."
      );
      return sendNotificationToServer(
        "SendBroadcastNotification",
        notificationDto // Pass DTO as the argument
      );
    },
    [sendNotificationToServer]
  );

  const value: NotificationContextType = {
    notifications,
    connectionState,
    registrationStatus, // Added for transparency
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    // sendNotification: sendNotificationToServer, // Expose generic sender if needed, or rely on specific methods
    getNotificationsByGroup,
    getNotificationsByPriority,
    notifyUser,
    notifyRole,
    notifyBroadcast,
    // Forcing a reconnect attempt if needed (use with caution, SignalR has auto-reconnect)
    // attemptReconnect: () => {
    //   if (hubConnection && hubConnection.state === signalR.HubConnectionState.Disconnected) {
    //     console.log("Attempting manual reconnect...");
    //     startConnection(hubConnection);
    //   }
    // }
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
