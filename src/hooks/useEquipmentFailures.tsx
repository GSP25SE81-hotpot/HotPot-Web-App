// src/hooks/useEquipmentFailures.tsx
import { useEffect, useState } from "react";
import {
  ConditionLog,
  MaintenanceStatus,
  NewEquipmentFailure,
  NotificationState,
} from "../types/equipmentFailure";
import equipmentService from "../api/Services/equipmentService";
import { format } from "date-fns";
import signalRService, { HubCallback } from "../api/Services/signalrService";

export const useEquipmentFailures = () => {
  const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | "All">(
    "All"
  );
  const [requests, setRequests] = useState<ConditionLog[]>([]);
  const filteredRequests = requests
    ? statusFilter === "All"
      ? requests
      : requests.filter((req) => req.status === statusFilter)
    : [];

  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(
    null
  );
  const [selectedDates, setSelectedDates] = useState<
    Record<number, Date | null>
  >({});
  const [resolutionMessages, setResolutionMessages] = useState<
    Record<number, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [newReport, setNewReport] = useState<NewEquipmentFailure>({
    name: "",
    description: "",
    equipmentType: "",
    equipmentId: "",
  });
  const [notification, setNotification] = useState<NotificationState | null>(
    null
  );
  const [error, setError] = useState<Error | null>(null);

  // Fetch active equipment failures
  useEffect(() => {
    const EQUIPMENT_HUB = `/equipmentHub`;
    const fetchEquipmentFailures = async () => {
      try {
        setLoading(true);
        const data = await equipmentService.getActiveConditionLogs();
        // Ensure data is an array before setting it
        setRequests(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching equipment failures:", error);
        setNotification({
          message: "Failed to load equipment failures",
          severity: "error",
        });
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("Failed to load equipment failures"));
        }
        // Important: Set requests to empty array on error
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipmentFailures();

    // Set up SignalR connection for real-time updates
    const setupSignalR = async () => {
      try {
        // Get token from localStorage or your auth context
        const loginInfoString = localStorage.getItem("loginInfo");
        if (!loginInfoString) {
          console.warn("No login info found, skipping SignalR connection");
          return;
        }

        let loginInfo;
        try {
          loginInfo = JSON.parse(loginInfoString);
        } catch (e) {
          console.error("Error parsing login info:", e);
          return;
        }

        if (!loginInfo || !loginInfo.data) {
          console.warn("Invalid login info, skipping SignalR connection");
          return;
        }

        // Start the SignalR connection directly using signalRService
        await signalRService.startConnection(EQUIPMENT_HUB);

        // Register user connection if needed
        const userId = loginInfo.data.userId || 0;
        const userType = loginInfo.data.role || "manager";
        await signalRService.registerUserConnection(
          EQUIPMENT_HUB,
          userId,
          userType
        );

        // Handler for new failures
        const handleNewFailure: HubCallback = (...args) => {
          try {
            // Cast the args to their expected types
            const [id, name, description, status, loggedDate] = args as [
              number,
              string,
              string,
              string,
              string
            ];

            setRequests((prev) => [
              ...prev,
              {
                conditionLogId: id,
                name,
                description,
                status: status as MaintenanceStatus,
                loggedDate,
              },
            ]);
            setNotification({
              message: `New equipment failure reported: ${name}`,
              severity: "info",
            });
          } catch (error) {
            console.error("Error in handleNewFailure:", error);
          }
        };

        // Handler for resolution updates
        const handleResolutionUpdate: HubCallback = (...args) => {
          try {
            // Cast the args to their expected types
            const [id, status, estimatedTime, message] = args as [
              number,
              string,
              string,
              string
            ];

            setRequests((prev) =>
              prev.map((req) =>
                req.conditionLogId === id
                  ? {
                      ...req,
                      status: status as MaintenanceStatus,
                      estimatedResolutionTime: estimatedTime,
                      resolutionNotes: message,
                    }
                  : req
              )
            );
            setNotification({
              message: `Equipment status updated: ${status}`,
              severity: "info",
            });
          } catch (error) {
            console.error("Error in handleResolutionUpdate:", error);
          }
        };

        // Register the handlers directly with signalRService
        signalRService.on(EQUIPMENT_HUB, "ReceiveNewFailure", handleNewFailure);
        signalRService.on(
          EQUIPMENT_HUB,
          "ReceiveResolutionUpdate",
          handleResolutionUpdate
        );
      } catch (error) {
        console.error("SignalR setup error:", error);
        // Don't set error state here as SignalR is not critical for the component to function
      }
    };
    setupSignalR();

    return () => {
      // Clean up SignalR connection when component unmounts
      try {
        signalRService.off(EQUIPMENT_HUB, "ReceiveNewFailure");
        signalRService.off(EQUIPMENT_HUB, "ReceiveResolutionUpdate");
        signalRService
          .stopConnection(EQUIPMENT_HUB)
          .catch((err) => console.error("Error stopping connection:", err));
      } catch (error) {
        console.error("Error cleaning up SignalR connection:", error);
      }
    };
  }, []);

  // Feature 1: Log failure reports
  const handleLogFailure = async () => {
    if (
      !newReport.name ||
      !newReport.description ||
      !newReport.equipmentType ||
      !newReport.equipmentId
    ) {
      setNotification({
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }
    try {
      const failureData = {
        name: newReport.name,
        description: newReport.description,
        ...(newReport.equipmentType === "utensil"
          ? { utensilID: parseInt(newReport.equipmentId) }
          : { hotPotInventoryId: parseInt(newReport.equipmentId) }),
      };
      const result = await equipmentService.logEquipmentFailure(failureData);
      setRequests([...requests, result]);
      setNewReport({
        name: "",
        description: "",
        equipmentType: "",
        equipmentId: "",
      });
      setNotification({
        message: "New failure report logged successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error logging failure:", error);
      setNotification({
        message: "Failed to log equipment failure",
        severity: "error",
      });
    }
  };

  // Feature 2: Schedule replacements
  const handleScheduleReplacement = async (requestId: number) => {
    const selectedDate = selectedDates[requestId];
    if (!selectedDate) {
      setNotification({
        message: "Please select a replacement date",
        severity: "error",
      });
      return;
    }
    try {
      const result = await equipmentService.updateResolutionTimeline(
        requestId,
        {
          status: MaintenanceStatus.Scheduled,
          estimatedResolutionTime: selectedDate.toISOString(),
          message: `Replacement scheduled for ${format(selectedDate, "PPpp")}`,
        }
      );
      setRequests(
        requests.map((req) => (req.conditionLogId === requestId ? result : req))
      );
      setSelectedDates((prev) => ({ ...prev, [requestId]: null }));
      setNotification({
        message: "Replacement scheduled successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error scheduling replacement:", error);
      setNotification({
        message: "Failed to schedule replacement",
        severity: "error",
      });
    }
  };

  // Feature 3: Communicate resolution timelines
  const handleResolveRequest = async (requestId: number) => {
    const resolutionMessage = resolutionMessages[requestId];
    if (!resolutionMessage) {
      setNotification({
        message: "Please enter resolution notes",
        severity: "error",
      });
      return;
    }
    try {
      await equipmentService.markAsResolved(requestId, resolutionMessage);
      setRequests(
        requests.map((req) =>
          req.conditionLogId === requestId
            ? {
                ...req,
                status: MaintenanceStatus.Resolved,
                resolutionNotes: resolutionMessage,
                resolutionDate: new Date().toISOString(),
              }
            : req
        )
      );
      setResolutionMessages((prev) => ({ ...prev, [requestId]: "" }));
      setNotification({
        message: "Request resolved and customer notified",
        severity: "success",
      });
    } catch (error) {
      console.error("Error resolving request:", error);
      setNotification({
        message: "Failed to resolve request",
        severity: "error",
      });
    }
  };

  return {
    requests,
    expandedRequestId,
    setExpandedRequestId,
    selectedDates,
    setSelectedDates,
    resolutionMessages,
    setResolutionMessages,
    loading,
    newReport,
    setNewReport,
    notification,
    setNotification,
    handleLogFailure,
    handleScheduleReplacement,
    handleResolveRequest,
    statusFilter,
    setStatusFilter,
    filteredRequests,
    error, // Return the error state
  };
};
