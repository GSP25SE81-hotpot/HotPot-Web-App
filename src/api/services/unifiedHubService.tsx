import {
  chatHubService,
  feedbackHubService,
  equipmentHubService,
  scheduleHubService,
  equipmentConditionHubService,
  equipmentStockHubService,
  notificationHubService,
} from "./hubServices";

class UnifiedHubService {
  private userId: number | null = null;
  private userType: string | null = null;
  private connectedHubs: Set<string> = new Set();

  /**
   * Initialize all hub connections for a user
   * @param userId The user ID
   * @param userType The user type (e.g., 'manager', 'admin', 'customer')
   * @param hubsToConnect Array of hub names to connect to (defaults to all)
   */
  public async initializeHubs(
    userId: number | string,
    userType: string,
    hubsToConnect: string[] = ["chat", "feedback", "notification"]
  ): Promise<void> {
    // Convert userId to number if it's a string
    this.userId = typeof userId === "string" ? parseInt(userId, 10) : userId;
    this.userType = userType;

    // Validate userId
    if (
      this.userId === null ||
      this.userId === undefined ||
      isNaN(this.userId)
    ) {
      console.error("Invalid user ID:", userId);
      throw new Error("Invalid user ID");
    }
    const connectPromises: Promise<void>[] = [];

    // Connect to specified hubs
    if (hubsToConnect.includes("chat")) {
      connectPromises.push(this.connectToChat());
    }

    if (hubsToConnect.includes("feedback")) {
      connectPromises.push(this.connectToFeedback());
    }

    if (hubsToConnect.includes("equipment")) {
      connectPromises.push(this.connectToEquipment());
    }

    if (hubsToConnect.includes("schedule")) {
      connectPromises.push(this.connectToSchedule());
    }

    if (hubsToConnect.includes("equipmentCondition")) {
      connectPromises.push(this.connectToEquipmentCondition());
    }

    if (hubsToConnect.includes("equipmentStock")) {
      connectPromises.push(this.connectToEquipmentStock());
    }

    if (hubsToConnect.includes("notification")) {
      connectPromises.push(this.connectToNotification());
    }

    // Wait for all connections to be established
    await Promise.all(connectPromises);
    console.log(
      `Connected to ${connectPromises.length} hubs for user ${this.userId} (${this.userType})`
    );
  }

  /**
   * Disconnect from all hubs
   */
  public async disconnectAll(): Promise<void> {
    const disconnectPromises: Promise<void>[] = [];

    if (this.connectedHubs.has("chat")) {
      disconnectPromises.push(chatHubService.disconnect());
    }

    if (this.connectedHubs.has("feedback")) {
      disconnectPromises.push(feedbackHubService.disconnect());
    }

    if (this.connectedHubs.has("equipment")) {
      disconnectPromises.push(equipmentHubService.disconnect());
    }

    if (this.connectedHubs.has("schedule")) {
      disconnectPromises.push(scheduleHubService.disconnect());
    }

    if (this.connectedHubs.has("equipmentCondition")) {
      disconnectPromises.push(equipmentConditionHubService.disconnect());
    }

    if (this.connectedHubs.has("equipmentStock")) {
      disconnectPromises.push(equipmentStockHubService.disconnect());
    }

    if (this.connectedHubs.has("notification")) {
      disconnectPromises.push(notificationHubService.disconnect());
    }

    await Promise.all(disconnectPromises);
    this.connectedHubs.clear();
    console.log("Disconnected from all hubs");
  }

  // Individual hub connection methods

  /**
   * Connect to the Chat hub
   */
  public async connectToChat(): Promise<void> {
    if (!this.userId || !this.userType) {
      throw new Error("User ID and type must be set before connecting to hubs");
    }

    await chatHubService.connect(this.userId, this.userType);
    this.connectedHubs.add("chat");
  }

  /**
   * Connect to the Feedback hub
   */
  public async connectToFeedback(): Promise<void> {
    if (!this.userId || !this.userType) {
      throw new Error("User ID and type must be set before connecting to hubs");
    }

    await feedbackHubService.connect(this.userId, this.userType);
    this.connectedHubs.add("feedback");
  }

  /**
   * Connect to the Equipment hub
   */
  public async connectToEquipment(): Promise<void> {
    if (!this.userId || !this.userType) {
      throw new Error("User ID and type must be set before connecting to hubs");
    }

    await equipmentHubService.connect(this.userId, this.userType);
    this.connectedHubs.add("equipment");
  }

  /**
   * Connect to the Schedule hub
   */
  public async connectToSchedule(): Promise<void> {
    if (!this.userId || !this.userType) {
      throw new Error("User ID and type must be set before connecting to hubs");
    }

    await scheduleHubService.connect(this.userId, this.userType);
    this.connectedHubs.add("schedule");
  }

  /**
   * Connect to the Equipment Condition hub
   */
  public async connectToEquipmentCondition(): Promise<void> {
    if (!this.userId || !this.userType) {
      throw new Error("User ID and type must be set before connecting to hubs");
    }

    await equipmentConditionHubService.connect(this.userId, this.userType);
    this.connectedHubs.add("equipmentCondition");
  }

  /**
   * Connect to the Equipment Stock hub
   */
  public async connectToEquipmentStock(): Promise<void> {
    if (!this.userId || !this.userType) {
      throw new Error("User ID and type must be set before connecting to hubs");
    }

    await equipmentStockHubService.connect(this.userId, this.userType);
    this.connectedHubs.add("equipmentStock");
  }

  /**
   * Connect to the Notification hub
   */
  public async connectToNotification(): Promise<void> {
    if (!this.userId || !this.userType) {
      throw new Error("User ID and type must be set before connecting to hubs");
    }

    await notificationHubService.connect(this.userId, this.userType);
    this.connectedHubs.add("notification");
  }

  // Hub service getters

  /**
   * Get the Chat hub service
   */
  public get chat() {
    return chatHubService;
  }

  /**
   * Get the Feedback hub service
   */
  public get feedback() {
    return feedbackHubService;
  }

  /**
   * Get the Equipment hub service
   */
  public get equipment() {
    return equipmentHubService;
  }

  /**
   * Get the Schedule hub service
   */
  public get schedule() {
    return scheduleHubService;
  }

  /**
   * Get the Equipment Condition hub service
   */
  public get equipmentCondition() {
    return equipmentConditionHubService;
  }

  /**
   * Get the Equipment Stock hub service
   */
  public get equipmentStock() {
    return equipmentStockHubService;
  }

  /**
   * Get the Notification hub service
   */
  public get notification() {
    return notificationHubService;
  }
}

// Create a singleton instance
const unifiedHubService = new UnifiedHubService();
export default unifiedHubService;
