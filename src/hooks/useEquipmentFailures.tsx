import { useEffect, useState } from "react";
import {
  ConditionLog,
  MaintenanceStatus,
  NewEquipmentFailure,
  NotificationState,
} from "../types/equipmentFailure";
import equipmentService from "../api/services/equipmentService";
import { format } from "date-fns";
import {
  getSignalRConnection,
  startSignalRConnection,
} from "../utils/signalRService";

export const useEquipmentFailures = () => {
  const [statusFilter, setStatusFilter] = useState<MaintenanceStatus | "All">(
    "All"
  );
  const [requests, setRequests] = useState<ConditionLog[]>([]);
  const filteredRequests =
    statusFilter === "All"
      ? requests
      : requests.filter((req) => req.status === statusFilter);

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

  // Fetch active equipment failures
  useEffect(() => {
    const fetchEquipmentFailures = async () => {
      try {
        setLoading(true);
        const data = await equipmentService.getActiveConditionLogs();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching equipment failures:", error);
        setNotification({
          message: "Failed to load equipment failures",
          severity: "error",
        });
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
        if (!loginInfoString) return;

        const loginInfo = JSON.parse(loginInfoString);
        const token = loginInfo.data.token;

        const connection = await startSignalRConnection(token);

        // Listen for new failures
        connection.on(
          "ReceiveNewFailure",
          (id, name, description, status, loggedDate) => {
            setRequests((prev) => [
              ...prev,
              {
                conditionLogId: id,
                name,
                description,
                status,
                loggedDate,
              },
            ]);

            setNotification({
              message: `New equipment failure reported: ${name}`,
              severity: "info",
            });
          }
        );

        // Listen for resolution updates
        connection.on(
          "ReceiveResolutionUpdate",
          (id, status, estimatedTime, message) => {
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
          }
        );
      } catch (error) {
        console.error("SignalR setup error:", error);
      }
    };

    setupSignalR();

    return () => {
      // Clean up SignalR connection when component unmounts
      const connection = getSignalRConnection();
      if (connection) {
        connection.off("ReceiveNewFailure");
        connection.off("ReceiveResolutionUpdate");
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
  };
};
