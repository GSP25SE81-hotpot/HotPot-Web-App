// src/api/Services/chatRealTimeService.ts
import { ChatService } from "./chatService";
import signalRService from "./signalrService";
import {
  ApiResponse,
  ChatMessageDto,
  ChatSessionDto,
  SendMessageRequest,
} from "../../types/chat";

// Chat Hub URL
const CHAT_HUB = "/chatHub";
export type HubCallback = (...args: unknown[]) => void;

export interface ChatMessageReceived {
  messageId: number;
  senderId: number;
  receiverId: number;
  message: string;
  createdAt: string;
}

export class ChatRealTimeService extends ChatService {
  private isConnected: boolean = false;
  private messageCallbacks: Set<(message: ChatMessageDto) => void> = new Set();
  private statusCallbacks: Set<
    (
      status: string,
      sessionId: number,
      managerId?: number,
      managerName?: string
    ) => void
  > = new Set();
  private readCallbacks: Set<(messageId: number) => void> = new Set();

  /**
   * Initialize the SignalR connection for chat
   */
  // In your chatRealTimeService.ts
  public async initializeConnection(token?: string): Promise<void> {
    try {
      // Start the connection if not already connected
      if (!this.isConnected) {
        console.log("Starting SignalR connection to chat hub...");
        // Get the token from the parameter or try to get it from localStorage
        const authToken = token || this.getAuthToken();
        if (!authToken) {
          console.error("No authentication token found. Please log in again.");
          throw new Error("Authentication token not found");
        }
        await signalRService.startConnection(CHAT_HUB, authToken);
        try {
          console.log("Connection established, registering user...");

          // CHANGE THIS LINE - Use the correct method name that exists on the server
          // For example, if the server has "RegisterUserConnection" instead:
          await signalRService.invoke(CHAT_HUB, "RegisterUserConnection");

          // Or if you need to pass the user ID:
          // const userId = this.getUserId(); // Implement this method to get the user ID
          // await signalRService.invoke(CHAT_HUB, "RegisterUserConnection", userId);

          this.isConnected = true;
          console.log("User registered successfully with chat hub");
          // Register event handlers
          this.registerEventHandlers();
          // Log connection state
          console.log(
            "Connection state after registration:",
            this.isConnected ? "Connected" : "Disconnected"
          );
        } catch (registerError) {
          console.error("Error registering user connection:", registerError);
          // Optionally disconnect since registration failed
          await signalRService.stopConnection(CHAT_HUB);
          this.isConnected = false;
          throw registerError;
        }
      }
    } catch (error) {
      console.error("Error initializing chat connection:", error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Get the authentication token from localStorage
   * @returns The authentication token or null if not found
   */
  private getAuthToken(): string | null {
    try {
      // Try to get the token from userInfor in localStorage
      const userInfor = localStorage.getItem("userInfor");
      if (userInfor) {
        const parsedUserInfo = JSON.parse(userInfor);
        return parsedUserInfo.accessToken || null;
      }
      return null;
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  }

  /**
   * Disconnect from the SignalR hub
   */
  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      await signalRService.stopConnection(CHAT_HUB);
      this.isConnected = false;
      console.log("Disconnected from chat hub");
    }
  }

  /**
   * Register event handlers for SignalR events
   */
  private registerEventHandlers(): void {
    // Handle incoming messages
    signalRService.on(CHAT_HUB, "ReceiveMessage", ((...args: unknown[]) => {
      // Cast the arguments to the expected types
      const [messageId, senderId, senderName, receiverId, message, createdAt] =
        args as [number, number, string, number, string, string];

      const chatMessage: ChatMessageDto = {
        chatMessageId: messageId,
        senderUserId: senderId,
        receiverUserId: receiverId,
        message: message,
        isRead: false,
        createdAt: new Date(createdAt),
        senderName: senderName,
        receiverName: "", // This will be filled by the UI if needed
      };

      // Notify all registered callbacks
      this.messageCallbacks.forEach((callback) => callback(chatMessage));
    }) as HubCallback);

    // Handle message read status updates
    signalRService.on(CHAT_HUB, "MessageRead", ((...args: unknown[]) => {
      const [messageId] = args as [number];
      this.readCallbacks.forEach((callback) => callback(messageId));
    }) as HubCallback);

    // Handle chat status changes (accepted, ended, etc.)
    signalRService.on(CHAT_HUB, "ChatAccepted", ((...args: unknown[]) => {
      const [sessionId, managerId, managerName] = args as [
        number,
        number,
        string
      ];
      this.statusCallbacks.forEach((callback) =>
        callback("accepted", sessionId, managerId, managerName)
      );
    }) as HubCallback);

    signalRService.on(CHAT_HUB, "ChatEnded", ((...args: unknown[]) => {
      const [sessionId] = args as [number];
      this.statusCallbacks.forEach((callback) => callback("ended", sessionId));
    }) as HubCallback);

    // Handle connection errors
    signalRService.on(CHAT_HUB, "chaterror", ((...args: unknown[]) => {
      const [errorMessage] = args as [string];
      console.error("Chat hub error:", errorMessage);
    }) as HubCallback);

    // Handle connection registration confirmation
    signalRService.on(CHAT_HUB, "ConnectionRegistered", ((
      ...args: unknown[]
    ) => {
      const [userId] = args as [number];
      console.log(`Connection registered for user ${userId}`);
    }) as HubCallback);
  }

  /**
   * Send a message via SignalR
   * @param senderId The sender's user ID
   * @param receiverId The receiver's user ID
   * @param message The message text
   */
  public async sendMessageRealTime(
    senderId: number,
    receiverId: number,
    message: string
  ): Promise<ApiResponse<ChatMessageDto>> {
    try {
      // Ensure connection is established
      if (!this.isConnected) {
        throw new Error("Not connected to chat hub");
      }

      // Create the message request
      const request: SendMessageRequest = { senderId, receiverId, message };

      // Send via SignalR
      await signalRService.invoke(CHAT_HUB, "SendMessage", request);

      // Also send via HTTP API to ensure persistence
      return await this.sendMessage(senderId, receiverId, message);
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  /**
   * Mark a message as read via SignalR
   * @param messageId The ID of the message to mark as read
   * @param userId The ID of the user marking the message as read
   */
  public async markMessageAsReadRealTime(
    messageId: number,
    userId: number
  ): Promise<ApiResponse<boolean>> {
    try {
      // Ensure connection is established
      if (!this.isConnected) {
        throw new Error("Not connected to chat hub");
      }

      // Send via SignalR - match the server method signature
      await signalRService.invoke(CHAT_HUB, "MarkAsRead", messageId, userId);

      // Also send via HTTP API to ensure persistence
      return await this.markMessageAsRead(messageId);
    } catch (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  }

  /**
   * End a chat session via SignalR
   * @param sessionId The ID of the session to end
   * @param userId The ID of the user ending the session
   */
  public async endChatSessionRealTime(
    sessionId: number,
    userId: number
  ): Promise<ApiResponse<ChatSessionDto>> {
    try {
      // Ensure connection is established
      if (!this.isConnected) {
        throw new Error("Not connected to chat hub");
      }

      // Send via SignalR - match the server method signature
      await signalRService.invoke(CHAT_HUB, "EndChat", sessionId, userId);

      // Also send via HTTP API to ensure persistence
      return await this.endChatSession(sessionId);
    } catch (error) {
      console.error("Error ending chat session:", error);
      throw error;
    }
  }

  /**
   * Register a callback for new messages
   * @param callback The callback function
   */
  public onMessage(callback: (message: ChatMessageDto) => void): void {
    this.messageCallbacks.add(callback);
  }

  /**
   * Remove a message callback
   * @param callback The callback function to remove
   */
  public offMessage(callback: (message: ChatMessageDto) => void): void {
    this.messageCallbacks.delete(callback);
  }

  /**
   * Register a callback for chat status changes
   * @param callback The callback function
   */
  public onStatusChange(
    callback: (
      status: string,
      sessionId: number,
      managerId?: number,
      managerName?: string
    ) => void
  ): void {
    this.statusCallbacks.add(callback);
  }

  /**
   * Remove a status change callback
   * @param callback The callback function to remove
   */
  public offStatusChange(
    callback: (
      status: string,
      sessionId: number,
      managerId?: number,
      managerName?: string
    ) => void
  ): void {
    this.statusCallbacks.delete(callback);
  }

  /**
   * Register a callback for read receipts
   * @param callback The callback function
   */
  public onMessageRead(callback: (messageId: number) => void): void {
    this.readCallbacks.add(callback);
  }

  /**
   * Remove a read receipt callback
   * @param callback The callback function to remove
   */
  public offMessageRead(callback: (messageId: number) => void): void {
    this.readCallbacks.delete(callback);
  }

  /**
   * Initiate a new chat session
   * @param customerId The customer's user ID
   * @param topic The chat topic
   */
  public async initiateChatRealTime(
    customerId: number,
    topic: string
  ): Promise<ApiResponse<ChatSessionDto>> {
    try {
      // Ensure connection is established
      if (!this.isConnected) {
        throw new Error("Not connected to chat hub");
      }

      // Create the request object
      const request = { customerId, topic };

      // Send via SignalR
      await signalRService.invoke(CHAT_HUB, "InitiateChat", request);

      // Also send via HTTP API to ensure persistence
      return await this.createChatSession(customerId, topic);
    } catch (error) {
      console.error("Error initiating chat:", error);
      throw error;
    }
  }

  /**
   * Accept a chat as a manager
   * @param sessionId The chat session ID
   * @param managerId The manager's user ID
   */
  public async acceptChatRealTime(
    sessionId: number,
    managerId: number
  ): Promise<ApiResponse<ChatSessionDto>> {
    try {
      // Ensure connection is established
      if (!this.isConnected) {
        throw new Error("Not connected to chat hub");
      }

      // Create the request object
      const request = { managerId };

      // Send via SignalR
      await signalRService.invoke(CHAT_HUB, "AcceptChat", request, sessionId);

      // Also send via HTTP API to ensure persistence
      return await this.assignManagerToSession(sessionId, managerId);
    } catch (error) {
      console.error("Error accepting chat:", error);
      throw error;
    }
  }
}

// Create a singleton instance
const chatRealTimeService = new ChatRealTimeService();
export default chatRealTimeService;
