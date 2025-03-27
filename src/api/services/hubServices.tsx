import signalRService, { HubCallback } from "./signalrService";

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

  onReceiveFeedbackResponse: (callback: FeedbackResponseCallback) => {
    signalRService.on(
      FEEDBACK_HUB,
      "ReceiveFeedbackResponse",
      callback as HubCallback
    );
  },

  onReceiveNewFeedback: (callback: NewFeedbackCallback) => {
    signalRService.on(
      FEEDBACK_HUB,
      "ReceiveNewFeedback",
      callback as HubCallback
    );
  },

  onReceiveApprovedFeedback: (callback: ApprovedFeedbackCallback) => {
    signalRService.on(
      FEEDBACK_HUB,
      "ReceiveApprovedFeedback",
      callback as HubCallback
    );
  },

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

  // Add equipment-specific methods here

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
  },

  // Add equipment condition-specific methods here

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
