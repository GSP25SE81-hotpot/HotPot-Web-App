import signalRService, { HubCallback } from "./signalrService";
import { MaintenanceScheduleType } from "./equipmentConditionService";
import { disconnectHubs, ensureHubConnection } from "./hubConnectionService";
// Hub URLs
const CHAT_HUB = "/chatHub";
const NOTIFICATION_HUB = "/notificationHub";

// Define specific callback types for each hub
type ChatMessageCallback = (user: string, message: string) => void;
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
type ConnectionRegisteredCallback = (userId: number) => void;
type NotificationCallback = (
  notificationId: number,
  title: string,
  message: string,
  type: string,
  createdAt: Date
) => void;
type LowStockAlertCallback = (
  equipmentType: string,
  equipmentName: string,
  currentQuantity: number,
  threshold: number,
  timestamp: Date
) => void;
type StatusChangeAlertCallback = (
  equipmentType: string,
  equipmentId: number,
  equipmentName: string,
  isAvailable: boolean,
  reason: string,
  timestamp: Date
) => void;
type ConditionAlertCallback = (
  conditionLogId: number,
  equipmentType: string,
  equipmentName: string,
  issueName: string,
  description: string,
  scheduleType: string,
  timestamp: Date
) => void;

type StatusUpdateCallback = (
  conditionLogId: number,
  equipmentType: string,
  equipmentName: string,
  issueName: string,
  status: string,
  timestamp: Date
) => void;

type DirectNotificationCallback = (
  conditionLogId: number,
  equipmentType: string,
  equipmentName: string,
  issueName: string,
  description: string,
  scheduleType: string,
  timestamp: Date
) => void;

// Chat Hub Service
export const chatHubService = {
  connect: async () => {
    await signalRService.startConnection(CHAT_HUB);
    await signalRService.registerUserConnection(CHAT_HUB);
  },

  onReceiveMessage: (callback: ChatMessageCallback) => {
    signalRService.on(CHAT_HUB, "ReceiveMessage", callback as HubCallback);
  },

  sendMessage: async (user: string, message: string) => {
    await signalRService.invoke(CHAT_HUB, "SendMessage", user, message);
  },

  disconnect: async () => {
    await signalRService.stopConnection(CHAT_HUB);
  },
};

// Feedback Hub Service
export const feedbackHubService = {
  connect: async () => {
    await signalRService.startConnection(NOTIFICATION_HUB);
    await signalRService.registerUserConnection(NOTIFICATION_HUB);
  },

  // Listen for connection registration confirmation
  onConnectionRegistered: (callback: ConnectionRegisteredCallback) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ConnectionRegistered",
      callback as HubCallback
    );
  },

  // Listen for feedback response notifications
  onReceiveFeedbackResponse: (callback: FeedbackResponseCallback) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveFeedbackResponse",
      callback as HubCallback
    );
  },

  // Listen for new feedback notifications (for admins)
  onReceiveNewFeedback: (callback: NewFeedbackCallback) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveNewFeedback",
      callback as HubCallback
    );
  },

  // Listen for approved feedback notifications (for managers)
  onReceiveApprovedFeedback: (callback: ApprovedFeedbackCallback) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveApprovedFeedback",
      callback as HubCallback
    );
  },

  // Send feedback response notification
  notifyFeedbackResponse: async (
    userId: number,
    feedbackId: number,
    responseMessage: string,
    managerName: string
  ) => {
    await signalRService.invoke(
      NOTIFICATION_HUB,
      "NotifyFeedbackResponse",
      userId,
      feedbackId,
      responseMessage,
      managerName
    );
  },

  // Send new feedback notification
  notifyNewFeedback: async (
    feedbackId: number,
    customerName: string,
    feedbackTitle: string
  ) => {
    await signalRService.invoke(
      NOTIFICATION_HUB,
      "NotifyNewFeedback",
      feedbackId,
      customerName,
      feedbackTitle
    );
  },

  // Send feedback approved notification
  notifyFeedbackApproved: async (
    feedbackId: number,
    adminName: string,
    feedbackTitle: string
  ) => {
    await signalRService.invoke(
      NOTIFICATION_HUB,
      "NotifyFeedbackApproved",
      feedbackId,
      adminName,
      feedbackTitle
    );
  },

  disconnect: async () => {
    await signalRService.stopConnection(NOTIFICATION_HUB);
  },
};

// Equipment Hub Service
export const equipmentHubService = {
  connect: async () => {
    await ensureHubConnection(NOTIFICATION_HUB);
  },

  // Register for replacement-related events
  onReceiveReplacementReview: (
    callback: (id: number, isApproved: boolean, reviewNotes: string) => void
  ) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveReplacementReview",
      callback as HubCallback
    );
  },

  onReceiveAssignmentUpdate: (
    callback: (
      id: number,
      staffId: number,
      equipmentName: string,
      status: string,
      timestamp: Date
    ) => void
  ) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveAssignmentUpdate",
      callback as HubCallback
    );
  },

  onReceiveNewAssignment: (
    callback: (
      id: number,
      equipmentName: string,
      requestReason: string,
      status: string
    ) => void
  ) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveNewAssignment",
      callback as HubCallback
    );
  },

  onReceiveReplacementUpdate: (
    callback: (
      id: number,
      equipmentName: string,
      status: string,
      message: string
    ) => void
  ) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveReplacementUpdate",
      callback as HubCallback
    );
  },

  onReceiveDirectNotification: (
    callback: (
      conditionLogId: number,
      message: string,
      estimatedResolutionTime: Date
    ) => void
  ) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveDirectNotification",
      callback as HubCallback
    );
  },

  onReceiveResolutionUpdate: (
    callback: (
      conditionLogId: number,
      status: string,
      estimatedResolutionTime: Date,
      message: string
    ) => void
  ) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveResolutionUpdate",
      callback as HubCallback
    );
  },

  onReceiveEquipmentUpdate: (
    callback: (
      conditionLogId: number,
      equipmentName: string,
      status: string,
      estimatedResolutionTime: Date,
      message: string
    ) => void
  ) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveEquipmentUpdate",
      callback as HubCallback
    );
  },

  // Methods to send updates
  sendResolutionUpdate: async (
    conditionLogId: number,
    status: string,
    estimatedResolutionTime: Date,
    message: string
  ) => {
    await signalRService.invoke(
      NOTIFICATION_HUB,
      "SendResolutionUpdate",
      conditionLogId,
      status,
      estimatedResolutionTime,
      message
    );
  },

  sendCustomerUpdate: async (
    customerId: number,
    conditionLogId: number,
    equipmentName: string,
    status: string,
    estimatedResolutionTime: Date,
    message: string
  ) => {
    await signalRService.invoke(
      NOTIFICATION_HUB,
      "SendCustomerUpdate",
      customerId,
      conditionLogId,
      equipmentName,
      status,
      estimatedResolutionTime,
      message
    );
  },

  disconnect: async () => {
    await signalRService.stopConnection(NOTIFICATION_HUB);
  },
};

// Schedule Hub Service
export const scheduleHubService = {
  connect: async () => {
    await signalRService.startConnection(NOTIFICATION_HUB);
    await signalRService.registerUserConnection(NOTIFICATION_HUB);
  },

  // Add schedule-specific methods here

  disconnect: async () => {
    await signalRService.stopConnection(NOTIFICATION_HUB);
  },
};

// Equipment Condition Hub Service
export const equipmentConditionHubService = {
  connect: async (userId: number, userType: string) => {
    await signalRService.startConnection(NOTIFICATION_HUB);
    await signalRService.registerUserConnection(NOTIFICATION_HUB);

    // If user is an admin, register as admin
    if (
      userType.toLowerCase() === "admin" ||
      userType.toLowerCase() === "administrator"
    ) {
      await signalRService.invoke(
        NOTIFICATION_HUB,
        "RegisterAdminConnection",
        userId
      );
    }
  },

  // Listen for connection registration confirmation
  onConnectionRegistered: (callback: (userId: number) => void) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ConnectionRegistered",
      callback as HubCallback
    );
  },

  // Listen for condition alerts
  onReceiveConditionAlert: (callback: ConditionAlertCallback) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveConditionAlert",
      callback as HubCallback
    );
  },

  // Listen for status updates
  onReceiveStatusUpdate: (callback: StatusUpdateCallback) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveStatusUpdate",
      callback as HubCallback
    );
  },

  // Listen for direct notifications
  onReceiveDirectNotification: (callback: DirectNotificationCallback) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveDirectNotification",
      callback as HubCallback
    );
  },

  // Send condition issue notification
  notifyConditionIssue: async (
    conditionLogId: number,
    equipmentType: string,
    equipmentName: string,
    issueName: string,
    description: string,
    scheduleType: MaintenanceScheduleType
  ) => {
    await signalRService.invoke(
      NOTIFICATION_HUB,
      "NotifyConditionIssue",
      conditionLogId,
      equipmentType,
      equipmentName,
      issueName,
      description,
      scheduleType
    );
  },

  // Join administrator group
  joinAdministratorGroup: async () => {
    await signalRService.invoke(
      NOTIFICATION_HUB,
      "JoinGroup",
      "Administrators"
    );
  },

  disconnect: async () => {
    await signalRService.stopConnection(NOTIFICATION_HUB);
  },
};

// Equipment Stock Hub Service
export const equipmentStockHubService = {
  connect: async () => {
    // Just use the shared connection service
    await ensureHubConnection(NOTIFICATION_HUB);

    // Get the user info from localStorage
    const userDataLocal = localStorage.getItem("userInfor");
    const userData = userDataLocal ? JSON.parse(userDataLocal) : null;

    // Register as admin if the user is an admin or manager
    if (
      userData &&
      userData.userId &&
      (userData.role === "Admin" || userData.role === "Manager")
    ) {
      await equipmentStockHubService.registerAdminConnection(userData.userId);
    }
  },

  // Register as admin to receive notifications
  registerAdminConnection: async (adminId: number) => {
    await signalRService.invoke(
      NOTIFICATION_HUB,
      "RegisterAdminConnection",
      adminId
    );
  },

  // Listen for low stock alerts
  onReceiveLowStockAlert: (callback: LowStockAlertCallback) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveLowStockAlert",
      callback as HubCallback
    );
  },

  // Listen for status change alerts
  onReceiveStatusChangeAlert: (callback: StatusChangeAlertCallback) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveStatusChangeAlert",
      callback as HubCallback
    );
  },

  // Send low stock notification directly
  notifyLowStock: async (
    equipmentType: string,
    equipmentName: string,
    currentQuantity: number,
    threshold: number
  ) => {
    await signalRService.invoke(
      NOTIFICATION_HUB,
      "NotifyLowStock",
      equipmentType,
      equipmentName,
      currentQuantity,
      threshold
    );
  },

  // Send status change notification directly
  notifyStatusChange: async (
    equipmentType: string,
    equipmentId: number,
    equipmentName: string,
    isAvailable: boolean,
    reason: string
  ) => {
    await signalRService.invoke(
      NOTIFICATION_HUB,
      "NotifyStatusChange",
      equipmentType,
      equipmentId,
      equipmentName,
      isAvailable,
      reason
    );
  },

  disconnect: async () => {
    // Use the shared disconnection method
    await disconnectHubs();
  },
};

// Notification Hub Service
export const notificationHubService = {
  connect: async () => {
    await signalRService.startConnection(NOTIFICATION_HUB);
    await signalRService.registerUserConnection(NOTIFICATION_HUB);
  },

  onReceiveNotification: (callback: NotificationCallback) => {
    signalRService.on(
      NOTIFICATION_HUB,
      "ReceiveNotification",
      callback as HubCallback
    );
  },

  disconnect: async () => {
    await signalRService.stopConnection(NOTIFICATION_HUB);
  },
};
