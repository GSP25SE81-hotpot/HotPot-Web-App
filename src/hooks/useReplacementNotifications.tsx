// src/hooks/useReplacementNotifications.ts
import { useEffect, useState } from "react";
import { equipmentHubService } from "../api/Services/hubServices";

interface ReplacementNotification {
  id: number;
  message: string;
  timestamp: Date;
  type: "review" | "assignment" | "update" | "direct";
}

export const useReplacementNotifications = (
  userId: number,
  userType: string
) => {
  const [notifications, setNotifications] = useState<ReplacementNotification[]>(
    []
  );
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connectToHub = async () => {
      try {
        await equipmentHubService.connect(userId, userType);
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setIsConnected(false);
        setError(
          err instanceof Error ? err.message : "Unknown error connecting to hub"
        );
      }
    };

    // Register event handlers
    const setupEventHandlers = () => {
      equipmentHubService.onReceiveReplacementReview(
        (id, isApproved, reviewNotes) => {
          const status = isApproved ? "approved" : "rejected";
          addNotification({
            id,
            message: `Replacement request #${id} was ${status}. Notes: ${reviewNotes}`,
            timestamp: new Date(),
            type: "review",
          });
        }
      );

      equipmentHubService.onReceiveAssignmentUpdate(
        (id, staffId, equipmentName, status, timestamp) => {
          addNotification({
            id,
            message: `Staff #${staffId} was assigned to replacement request #${id} for ${equipmentName}`,
            timestamp: new Date(timestamp),
            type: "assignment",
          });
        }
      );

      equipmentHubService.onReceiveReplacementUpdate(
        (id, equipmentName, status, message) => {
          addNotification({
            id,
            message: `Replacement request #${id} for ${equipmentName} is now ${status}. ${message}`,
            timestamp: new Date(),
            type: "update",
          });
        }
      );

      equipmentHubService.onReceiveDirectNotification(
        (conditionLogId, message, estimatedResolutionTime) => {
          addNotification({
            id: conditionLogId,
            message,
            timestamp: new Date(),
            type: "direct",
          });
        }
      );
    };

    const addNotification = (notification: ReplacementNotification) => {
      setNotifications((prev) => [notification, ...prev].slice(0, 20)); // Keep last 20 notifications
    };

    connectToHub();
    setupEventHandlers();

    return () => {
      equipmentHubService.disconnect();
    };
  }, [userId, userType]);

  return { notifications, isConnected, error };
};
