import signalRService, { HubCallback } from "./signalrService";
import { MaintenanceScheduleType } from "./equipmentConditionService";
// Hub URLs
const CHAT_HUB = "/chatHub";
const EQUIPMENT_HUB = "/equipmentHub";
const FEEDBACK_HUB = "/feedbackHub";
const SCHEDULE_HUB = "/scheduleHub";
const EQUIPMENT_CONDITION_HUB = "/equipmentConditionHub";
const EQUIPMENT_STOCK_HUB = "/equipmentStockHub";
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
  connect: async (userId: number, userType: string) => {
    await signalRService.startConnection(CHAT_HUB);
    await signalRService.registerUserConnection(CHAT_HUB, userId, userType);
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
  connect: async (userId: number, userType: string) => {
    await signalRService.startConnection(FEEDBACK_HUB);
    await signalRService.registerUserConnection(FEEDBACK_HUB, userId, userType);
  },

  // Listen for connection registration confirmation
  onConnectionRegistered: (callback: ConnectionRegisteredCallback) => {
    signalRService.on(
      FEEDBACK_HUB,
      "ConnectionRegistered",
      callback as HubCallback
    );
  },

  // Listen for feedback response notifications
  onReceiveFeedbackResponse: (callback: FeedbackResponseCallback) => {
    signalRService.on(
      FEEDBACK_HUB,
      "ReceiveFeedbackResponse",
      callback as HubCallback
    );
  },

  // Listen for new feedback notifications (for admins)
  onReceiveNewFeedback: (callback: NewFeedbackCallback) => {
    signalRService.on(
      FEEDBACK_HUB,
      "ReceiveNewFeedback",
      callback as HubCallback
    );
  },

  // Listen for approved feedback notifications (for managers)
  onReceiveApprovedFeedback: (callback: ApprovedFeedbackCallback) => {
    signalRService.on(
      FEEDBACK_HUB,
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
      FEEDBACK_HUB,
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
      FEEDBACK_HUB,
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
      FEEDBACK_HUB,
      "NotifyFeedbackApproved",
      feedbackId,
      adminName,
      feedbackTitle
    );
  },

  disconnect: async () => {
    await signalRService.stopConnection(FEEDBACK_HUB);
  },
};

// Equipment Hub Service
export const equipmentHubService = {
  connect: async (userId: number, userType: string) => {
    await signalRService.startConnection(EQUIPMENT_HUB);
    await signalRService.registerUserConnection(
      EQUIPMENT_HUB,
      userId,
      userType
    );
  },

  // Register for replacement-related events
  onReceiveReplacementReview: (
    callback: (id: number, isApproved: boolean, reviewNotes: string) => void
  ) => {
    signalRService.on(
      EQUIPMENT_HUB,
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
      EQUIPMENT_HUB,
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
      EQUIPMENT_HUB,
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
      EQUIPMENT_HUB,
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
      EQUIPMENT_HUB,
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
      EQUIPMENT_HUB,
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
      EQUIPMENT_HUB,
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
      EQUIPMENT_HUB,
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
      EQUIPMENT_HUB,
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
    await signalRService.stopConnection(EQUIPMENT_HUB);
  },
};

// Schedule Hub Service
export const scheduleHubService = {
  connect: async (userId: number, userType: string) => {
    await signalRService.startConnection(SCHEDULE_HUB);
    await signalRService.registerUserConnection(SCHEDULE_HUB, userId, userType);
  },

  // Add schedule-specific methods here

  disconnect: async () => {
    await signalRService.stopConnection(SCHEDULE_HUB);
  },
};

// Equipment Condition Hub Service
export const equipmentConditionHubService = {
  connect: async (userId: number, userType: string) => {
    await signalRService.startConnection(EQUIPMENT_CONDITION_HUB);
    await signalRService.registerUserConnection(
      EQUIPMENT_CONDITION_HUB,
      userId,
      userType
    );

    // If user is an admin, register as admin
    if (
      userType.toLowerCase() === "admin" ||
      userType.toLowerCase() === "administrator"
    ) {
      await signalRService.invoke(
        EQUIPMENT_CONDITION_HUB,
        "RegisterAdminConnection",
        userId
      );
    }
  },

  // Listen for connection registration confirmation
  onConnectionRegistered: (callback: (userId: number) => void) => {
    signalRService.on(
      EQUIPMENT_CONDITION_HUB,
      "ConnectionRegistered",
      callback as HubCallback
    );
  },

  // Listen for condition alerts
  onReceiveConditionAlert: (callback: ConditionAlertCallback) => {
    signalRService.on(
      EQUIPMENT_CONDITION_HUB,
      "ReceiveConditionAlert",
      callback as HubCallback
    );
  },

  // Listen for status updates
  onReceiveStatusUpdate: (callback: StatusUpdateCallback) => {
    signalRService.on(
      EQUIPMENT_CONDITION_HUB,
      "ReceiveStatusUpdate",
      callback as HubCallback
    );
  },

  // Listen for direct notifications
  onReceiveDirectNotification: (callback: DirectNotificationCallback) => {
    signalRService.on(
      EQUIPMENT_CONDITION_HUB,
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
      EQUIPMENT_CONDITION_HUB,
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
      EQUIPMENT_CONDITION_HUB,
      "JoinGroup",
      "Administrators"
    );
  },

  disconnect: async () => {
    await signalRService.stopConnection(EQUIPMENT_CONDITION_HUB);
  },
};

// Equipment Stock Hub Service
export const equipmentStockHubService = {
  connect: async (userId: number, userType: string) => {
    await signalRService.startConnection(EQUIPMENT_STOCK_HUB);
    await signalRService.registerUserConnection(
      EQUIPMENT_STOCK_HUB,
      userId,
      userType
    );
  },

  // Register as admin to receive notifications
  registerAdminConnection: async (adminId: number) => {
    await signalRService.invoke(
      EQUIPMENT_STOCK_HUB,
      "RegisterAdminConnection",
      adminId
    );
  },

  // Listen for low stock alerts
  onReceiveLowStockAlert: (callback: LowStockAlertCallback) => {
    signalRService.on(
      EQUIPMENT_STOCK_HUB,
      "ReceiveLowStockAlert",
      callback as HubCallback
    );
  },

  // Listen for status change alerts
  onReceiveStatusChangeAlert: (callback: StatusChangeAlertCallback) => {
    signalRService.on(
      EQUIPMENT_STOCK_HUB,
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
      EQUIPMENT_STOCK_HUB,
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
      EQUIPMENT_STOCK_HUB,
      "NotifyStatusChange",
      equipmentType,
      equipmentId,
      equipmentName,
      isAvailable,
      reason
    );
  },

  disconnect: async () => {
    await signalRService.stopConnection(EQUIPMENT_STOCK_HUB);
  },
};

// Notification Hub Service
export const notificationHubService = {
  connect: async (userId: number, userType: string) => {
    await signalRService.startConnection(NOTIFICATION_HUB);
    await signalRService.registerUserConnection(
      NOTIFICATION_HUB,
      userId,
      userType
    );
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
