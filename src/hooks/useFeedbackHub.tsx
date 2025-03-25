// src/hooks/useFeedbackHub.ts
import { useState, useEffect, useCallback } from "react";
import * as signalR from "@microsoft/signalr";

type FeedbackResponseCallback = (
  feedbackId: number,
  responseMessage: string,
  managerName: string,
  responseDate: Date
) => void;

type NewFeedbackCallback = (
  feedbackId: number,
  customerName: string,
  feedbackTitle: string,
  createdDate: Date
) => void;

type ApprovedFeedbackCallback = (
  feedbackId: number,
  feedbackTitle: string,
  adminName: string,
  approvalDate: Date
) => void;

export const useFeedbackHub = (userId: number, userType: string) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] =
    useState<signalR.HubConnectionState>(
      signalR.HubConnectionState.Disconnected
    );
  const [error, setError] = useState<Error | null>(null);

  // Initialize connection
  useEffect(() => {
    // Create the connection
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("/feedbackHub")
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Set up connection state change handlers
    newConnection.onreconnecting((error) => {
      console.log("Connection lost due to error. Reconnecting...", error);
      setConnectionState(signalR.HubConnectionState.Reconnecting);
      setIsConnected(false);
    });

    newConnection.onreconnected((connectionId) => {
      console.log("Connection reestablished. Connected with ID:", connectionId);
      setConnectionState(signalR.HubConnectionState.Connected);
      setIsConnected(true);

      // Re-register the connection with the server
      if (userId && userType) {
        newConnection
          .invoke("RegisterConnection", userId, userType)
          .catch((err) =>
            console.error("Error registering connection after reconnect:", err)
          );
      }
    });

    newConnection.onclose((error) => {
      console.log("Connection closed.", error);
      setConnectionState(signalR.HubConnectionState.Disconnected);
      setIsConnected(false);
    });

    setConnection(newConnection);

    // Start the connection
    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log("Connected to feedback hub");
        setConnectionState(signalR.HubConnectionState.Connected);
        setIsConnected(true);
        setError(null);

        // Register the connection with the server
        if (userId && userType) {
          await newConnection.invoke("RegisterConnection", userId, userType);
        }
      } catch (err) {
        console.error("Error starting connection:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to connect to feedback hub")
        );
        setTimeout(startConnection, 5000); // Try to reconnect after 5 seconds
      }
    };

    startConnection();

    // Clean up on unmount
    return () => {
      if (newConnection.state === signalR.HubConnectionState.Connected) {
        newConnection
          .stop()
          .catch((err) => console.error("Error stopping connection:", err));
      }
    };
  }, [userId, userType]);

  // Register for approved feedback notifications
  const onReceiveApprovedFeedback = useCallback(
    (callback: ApprovedFeedbackCallback) => {
      if (!connection) return () => {};

      connection.on("ReceiveApprovedFeedback", callback);

      // Return a cleanup function
      return () => {
        connection.off("ReceiveApprovedFeedback", callback);
      };
    },
    [connection]
  );

  // Register for feedback response notifications
  const onReceiveFeedbackResponse = useCallback(
    (callback: FeedbackResponseCallback) => {
      if (!connection) return () => {};

      connection.on("ReceiveFeedbackResponse", callback);

      // Return a cleanup function
      return () => {
        connection.off("ReceiveFeedbackResponse", callback);
      };
    },
    [connection]
  );

  // Register for new feedback notifications
  const onReceiveNewFeedback = useCallback(
    (callback: NewFeedbackCallback) => {
      if (!connection) return () => {};

      connection.on("ReceiveNewFeedback", callback);

      // Return a cleanup function
      return () => {
        connection.off("ReceiveNewFeedback", callback);
      };
    },
    [connection]
  );

  // Notify about feedback response
  const notifyFeedbackResponse = useCallback(
    async (
      targetUserId: number,
      feedbackId: number,
      responseMessage: string,
      managerName: string
    ) => {
      if (
        !connection ||
        connection.state !== signalR.HubConnectionState.Connected
      ) {
        throw new Error(
          "No connection to the server or connection is not in the Connected state"
        );
      }

      await connection.invoke(
        "NotifyFeedbackResponse",
        targetUserId,
        feedbackId,
        responseMessage,
        managerName
      );
    },
    [connection]
  );

  // Notify about new feedback
  const notifyNewFeedback = useCallback(
    async (feedbackId: number, customerName: string, feedbackTitle: string) => {
      if (
        !connection ||
        connection.state !== signalR.HubConnectionState.Connected
      ) {
        throw new Error(
          "No connection to the server or connection is not in the Connected state"
        );
      }

      await connection.invoke(
        "NotifyNewFeedback",
        feedbackId,
        customerName,
        feedbackTitle
      );
    },
    [connection]
  );

  return {
    isConnected,
    connectionState,
    error,
    onReceiveApprovedFeedback,
    onReceiveFeedbackResponse,
    onReceiveNewFeedback,
    notifyFeedbackResponse,
    notifyNewFeedback,
  };
};
