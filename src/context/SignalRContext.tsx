// src/contexts/SignalRContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
// import unifiedHubService from "../api/services/unifiedHubService";
// import { useAuthContext } from "./AuthContext";
import { Role } from "../routes/Roles";
import useAuth from "../hooks/useAuth";
import unifiedHubService from "../api/Services/unifiedHubService";

interface SignalRContextType {
  isInitialized: boolean;
  isConnecting: boolean;
  error: Error | null;
  hubService: typeof unifiedHubService;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const SignalRProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { auth } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize hub connections when the user logs in
  useEffect(() => {
    // Don't try to initialize if still loading auth state
    // if (isLoading) {
    //   return;
    // }

    const initializeHubs = async () => {
      if (auth) {
        setIsConnecting(true);
        setError(null);

        try {
          // Determine which hubs to connect to based on user role
          const hubsToConnect: string[] = ["notification"]; // Everyone gets notifications

          if (auth?.user?.role === Role.Manager) {
            hubsToConnect.push("feedback", "equipment", "equipmentStock");
          } else if (auth?.user?.role === Role.Admin) {
            hubsToConnect.push(
              "feedback",
              "equipment",
              "equipmentStock",
              "equipmentCondition"
            );
          }

          // Parse auth as number if it's a string
          const userId =
            typeof auth?.user?.userId === "string" ? parseInt(auth?.user?.userId, 10) : auth?.user?.userId;

          await unifiedHubService.initializeHubs(
            userId,
            auth?.user?.role || "guest",
            hubsToConnect
          );
          setIsInitialized(true);
        } catch (err) {
          setError(
            err instanceof Error
              ? err
              : new Error("Failed to initialize SignalR hubs")
          );
          console.error("Error initializing SignalR hubs:", err);
        } finally {
          setIsConnecting(false);
        }
      } else {
        // Disconnect when user logs out
        if (isInitialized) {
          try {
            await unifiedHubService.disconnectAll();
          } catch (err) {
            console.error("Error disconnecting from SignalR hubs:", err);
          }
          setIsInitialized(false);
        }
      }
    };

    initializeHubs();

    // Clean up connections when component unmounts
    return () => {
      if (isInitialized) {
        unifiedHubService.disconnectAll().catch((err) => {
          console.error(
            "Error disconnecting from SignalR hubs during cleanup:",
            err
          );
        });
      }
    };
  }, [auth, isInitialized]);

  return (
    <SignalRContext.Provider
      value={{
        isInitialized,
        isConnecting,
        error,
        hubService: unifiedHubService,
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = (): SignalRContextType => {
  const context = useContext(SignalRContext);
  if (context === undefined) {
    throw new Error("useSignalR must be used within a SignalRProvider");
  }
  return context;
};
