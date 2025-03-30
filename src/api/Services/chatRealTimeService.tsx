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
  private typingCallbacks: Set<(sessionId: number, isTyping: boolean) => void> =
    new Set();
  private readCallbacks: Set<(messageId: number) => void> = new Set();

  /**
   * Initialize the SignalR connection for chat
   * @param userId The user ID
   * @param userType The user type (manager, customer, etc.)
   */
  public async initializeConnection(
    userId: number,
    userType: string
  ): Promise<void> {
    try {
      // Validate parameters
      if (!userId || isNaN(userId)) {
        throw new Error(`Invalid userId: ${userId}. Must be a valid number.`);
      }

      if (!userType) {
        throw new Error("userType cannot be null or empty");
      }

      console.log(
        `Attempting to connect to chat hub as ${userType} with ID ${userId}`
      );

      // Start the connection if not already connected
      if (!this.isConnected) {
        await signalRService.startConnection(CHAT_HUB);

        try {
          console.log("Connection established, registering user...");
          await signalRService.registerUserConnection(
            CHAT_HUB,
            userId,
            userType
          );
          this.isConnected = true;
          console.log(
            `Successfully connected and registered to chat hub as ${userType} with ID ${userId}`
          );
          // Register event handlers
          this.registerEventHandlers();
        } catch (registerError) {
          console.error("Error registering user connection:", registerError);
          // Optionally disconnect since registration failed
          await signalRService.stopConnection(CHAT_HUB);
          throw registerError;
        }
      }
    } catch (error) {
      console.error("Error initializing chat connection:", error);
      throw error;
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
      const [messageId, senderId, receiverId, message, createdAt] = args as [
        number,
        number,
        number,
        string,
        string
      ];

      const chatMessage: ChatMessageDto = {
        chatMessageId: messageId,
        senderUserId: senderId,
        receiverUserId: receiverId,
        message: message,
        isRead: false,
        createdAt: new Date(createdAt),
        senderName: "", // This will be filled by the backend
        receiverName: "", // This will be filled by the backend
      };

      // Notify all registered callbacks
      this.messageCallbacks.forEach((callback) => callback(chatMessage));
    }) as HubCallback);

    // Handle message read status updates
    signalRService.on(CHAT_HUB, "MessageRead", ((...args: unknown[]) => {
      const [messageId] = args as [number];
      this.readCallbacks.forEach((callback) => callback(messageId));
    }) as HubCallback);

    // Handle typing indicators
    signalRService.on(CHAT_HUB, "UserTyping", ((...args: unknown[]) => {
      const [sessionId, isTyping] = args as [number, boolean];
      this.typingCallbacks.forEach((callback) => callback(sessionId, isTyping));
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
    signalRService.on(CHAT_HUB, "ChatError", ((...args: unknown[]) => {
      const [errorMessage] = args as [string];
      console.error("Chat hub error:", errorMessage);
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
   */
  public async markMessageAsReadRealTime(
    messageId: number
  ): Promise<ApiResponse<boolean>> {
    try {
      // Ensure connection is established
      if (!this.isConnected) {
        throw new Error("Not connected to chat hub");
      }

      // Send via SignalR
      await signalRService.invoke(CHAT_HUB, "MarkAsRead", messageId);

      // Also send via HTTP API to ensure persistence
      return await this.markMessageAsRead(messageId);
    } catch (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
  }

  /**
   * Send a typing indicator
   * @param sessionId The chat session ID
   * @param isTyping Whether the user is typing
   */
  public async sendTypingIndicator(
    sessionId: number,
    isTyping: boolean
  ): Promise<void> {
    try {
      // Ensure connection is established
      if (!this.isConnected) {
        throw new Error("Not connected to chat hub");
      }

      await signalRService.invoke(
        CHAT_HUB,
        "SendTypingIndicator",
        sessionId,
        isTyping
      );
    } catch (error) {
      console.error("Error sending typing indicator:", error);
    }
  }

  /**
   * End a chat session via SignalR
   * @param sessionId The ID of the session to end
   */
  public async endChatSessionRealTime(
    sessionId: number
  ): Promise<ApiResponse<ChatSessionDto>> {
    try {
      // Ensure connection is established
      if (!this.isConnected) {
        throw new Error("Not connected to chat hub");
      }

      // Send via SignalR
      await signalRService.invoke(CHAT_HUB, "EndChat", sessionId);

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
    callback: (status: string, sessionId: number) => void
  ): void {
    this.statusCallbacks.add(callback);
  }

  /**
   * Remove a status change callback
   * @param callback The callback function to remove
   */
  public offStatusChange(
    callback: (status: string, sessionId: number) => void
  ): void {
    this.statusCallbacks.delete(callback);
  }

  /**
   * Register a callback for typing indicators
   * @param callback The callback function
   */
  public onTypingIndicator(
    callback: (sessionId: number, isTyping: boolean) => void
  ): void {
    this.typingCallbacks.add(callback);
  }

  /**
   * Remove a typing indicator callback
   * @param callback The callback function to remove
   */
  public offTypingIndicator(
    callback: (sessionId: number, isTyping: boolean) => void
  ): void {
    this.typingCallbacks.delete(callback);
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
}

// Create a singleton instance
const chatRealTimeService = new ChatRealTimeService();
export default chatRealTimeService;
