/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";
import signalRService from "./chatSignalRService";
import {
  ApiResponse,
  ChatMessageDto,
  ChatSessionDetailDto,
  ChatSessionDto,
  SendMessageRequest,
} from "../../types/chat";

const API_URL = "/chat";

export class ChatService {
  private isInitialized = false;

  constructor() {
    // Don't initialize in constructor - do it explicitly
  }

  // Initialize SignalR connection and authentication
  public async initialize(userId?: number, role?: string): Promise<boolean> {
    if (this.isInitialized) return true;
    try {
      // Connect to SignalR hub
      const connected = await signalRService.connect();
      // Authenticate if user info is provided
      if (connected && userId && role) {
        await signalRService.authenticate(userId, role);
      }
      this.isInitialized = connected;
      return connected;
    } catch (error) {
      console.error("Failed to initialize chat service:", error);
      return false;
    }
  }

  // Authenticate with SignalR
  public async authenticateSignalR(
    userId: number,
    role: string
  ): Promise<void> {
    await this.initialize();
    await signalRService.authenticate(userId, role);
  }

  // Register SignalR event handlers
  public onNewChat(callback: (data: any) => void): void {
    signalRService.on("newChatSession", callback);
  }

  public onChatAccepted(callback: (data: any) => void): void {
    signalRService.on("chatAccepted", callback);
  }

  public onNewMessage(callback: (data: any) => void): void {
    signalRService.on("newMessage", callback);
  }

  public onChatEnded(callback: (data: any) => void): void {
    signalRService.on("chatEnded", callback);
  }

  // Add this new method for broadcast messages
  public onNewBroadcastMessage(callback: (data: any) => void): void {
    signalRService.on("newBroadcastMessage", callback);
  }

  // Add the missing off method to unsubscribe from events
  public off(eventName: string, callback?: (data: any) => void): void {
    signalRService.off(eventName, callback);
  }

  // Get user's chat sessions (works for both customers and managers)
  public async getUserSessions(
    activeOnly: boolean = false
  ): Promise<ApiResponse<ChatSessionDto[]>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ChatSessionDto[]>
      >(`${API_URL}/sessions?activeOnly=${activeOnly}`);
      return response || { success: true, data: [] };
    } catch (error) {
      console.error("Error fetching user sessions:", error);
      throw error;
    }
  }

  // Get unassigned chat sessions (manager only)
  public async getUnassignedSessions(): Promise<ApiResponse<ChatSessionDto[]>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ChatSessionDto[]>
      >(`${API_URL}/manager/sessions/unassigned`);
      return response || { success: true, data: [] };
    } catch (error) {
      console.error("Error fetching unassigned sessions:", error);
      throw error;
    }
  }

  // Join a chat session as manager
  public async joinChatSession(
    sessionId: number
  ): Promise<ApiResponse<ChatSessionDto>> {
    try {
      // Make the HTTP request
      const response = await axiosClient.post<any, ApiResponse<ChatSessionDto>>(
        `${API_URL}/manager/sessions/${sessionId}/join`,
        {}
      );
      // Join the SignalR group for this chat session
      if (signalRService.isConnected()) {
        await signalRService.connection?.invoke("JoinChatSession", sessionId);
      }
      return response;
    } catch (error) {
      console.error("Error joining chat session:", error);
      throw error;
    }
  }

  // Get messages for a specific chat session
  public async getSessionMessages(
    sessionId: number,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<ChatMessageDto[]>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ChatMessageDto[]>
      >(
        `${API_URL}/messages/session/${sessionId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      return response || { success: true, data: [] };
    } catch (error) {
      console.error("Error fetching session messages:", error);
      throw error;
    }
  }

  // End a chat session
  public async endChatSession(
    sessionId: number
  ): Promise<ApiResponse<ChatSessionDto>> {
    try {
      // Make the HTTP request - backend will handle SignalR notification
      const response = await axiosClient.put<any, ApiResponse<ChatSessionDto>>(
        `${API_URL}/sessions/${sessionId}/end`,
        {}
      );
      // Leave the SignalR group for this chat session
      if (signalRService.isConnected()) {
        await signalRService.connection?.invoke("LeaveChatSession", sessionId);
      }
      return response;
    } catch (error) {
      console.error("Error ending chat session:", error);
      throw error;
    }
  }

  // Send a message
  public async sendMessage(
    chatSessionId: number,
    message: string
  ): Promise<ApiResponse<ChatMessageDto>> {
    try {
      const request: SendMessageRequest = {
        chatSessionId,
        message,
      };
      // Make the HTTP request - backend will handle SignalR notification
      const response = await axiosClient.post<any, ApiResponse<ChatMessageDto>>(
        `${API_URL}/messages`,
        request
      );
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  // Get a specific chat session with its messages
  public async getChatSession(
    sessionId: number
  ): Promise<ApiResponse<ChatSessionDetailDto>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ChatSessionDetailDto>
      >(`${API_URL}/sessions/${sessionId}`);
      // Join the SignalR group for this chat session if not already joined
      if (signalRService.isConnected()) {
        await signalRService.connection?.invoke("JoinChatSession", sessionId);
      }
      return response;
    } catch (error) {
      console.error("Error fetching chat session:", error);
      throw error;
    }
  }

  // Check if SignalR is connected
  public isSocketConnected(): boolean {
    return signalRService.isConnected();
  }

  // Disconnect SignalR
  public disconnect(): void {
    signalRService.disconnect();
    this.isInitialized = false;
  }
}

// Create a singleton instance
const chatService = new ChatService();
export default chatService;
