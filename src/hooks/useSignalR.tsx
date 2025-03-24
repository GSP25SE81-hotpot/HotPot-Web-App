// src/hooks/useSignalR.ts
import { useState, useEffect, useCallback } from "react";
import signalRService from "../api/services/signalrService";
import { HubConnectionState } from "@microsoft/signalr";

/**
 * Custom hook for using SignalR in React components
 * @param hubUrl The URL of the hub to connect to
 * @param userId The user ID for registration with the hub
 * @param userType The user type (e.g., 'manager', 'admin', 'customer')
 * @returns An object with connection state and methods
 */
export const useSignalR = (
  hubUrl: string,
  userId: number,
  userType: string
) => {
  const [connectionState, setConnectionState] = useState<HubConnectionState>(
    signalRService.getConnectionState(hubUrl)
  );
  const [error, setError] = useState<Error | null>(null);

  // Connect to the hub
  const connect = useCallback(async () => {
    try {
      await signalRService.startConnection(hubUrl);
      await signalRService.registerUserConnection(hubUrl, userId, userType);
      setConnectionState(signalRService.getConnectionState(hubUrl));
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to connect to hub")
      );
      console.error(`Error connecting to hub ${hubUrl}:`, err);
    }
  }, [hubUrl, userId, userType]);

  // Disconnect from the hub
  const disconnect = useCallback(async () => {
    try {
      await signalRService.stopConnection(hubUrl);
      setConnectionState(signalRService.getConnectionState(hubUrl));
    } catch (err) {
      console.error(`Error disconnecting from hub ${hubUrl}:`, err);
    }
  }, [hubUrl]);

  // Register a callback for a hub method
  const on = useCallback(
    (methodName: string, callback: (...args: unknown[]) => void) => {
      signalRService.on(hubUrl, methodName, callback);
    },
    [hubUrl]
  );

  // Remove a callback for a hub method
  const off = useCallback(
    (methodName: string, callback?: (...args: unknown[]) => void) => {
      signalRService.off(hubUrl, methodName, callback);
    },
    [hubUrl]
  );

  // Invoke a hub method
  const invoke = useCallback(
    async (methodName: string, ...args: unknown[]) => {
      try {
        await signalRService.invoke(hubUrl, methodName, ...args);
      } catch (err) {
        console.error(
          `Error invoking method ${methodName} on hub ${hubUrl}:`,
          err
        );
        throw err;
      }
    },
    [hubUrl]
  );

  // Invoke a hub method and get a result
  const invokeWithResult = useCallback(
    async <T,>(methodName: string, ...args: unknown[]): Promise<T> => {
      try {
        return await signalRService.invokeWithResult<T>(
          hubUrl,
          methodName,
          ...args
        );
      } catch (err) {
        console.error(
          `Error invoking method ${methodName} on hub ${hubUrl}:`,
          err
        );
        throw err;
      }
    },
    [hubUrl]
  );

  // Connect to the hub when the component mounts
  useEffect(() => {
    connect();

    // Disconnect when the component unmounts
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    connectionState,
    isConnected: connectionState === HubConnectionState.Connected,
    error,
    connect,
    disconnect,
    on,
    off,
    invoke,
    invokeWithResult,
  };
};
