/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";
import socketService from "./socketService";
import {
  ApiResponse,
  ChatMessageDto,
  ChatSessionDetailDto,
  ChatSessionDto,
  SendMessageRequest,
} from "../../types/chat";

export class ChatService {
  private isInitialized = false;

  constructor() {
    // Don't initialize in constructor - do it explicitly
  }

  // Initialize socket connection and authentication
  public async initialize(userId?: number, role?: string): Promise<boolean> {
    if (this.isInitialized) return true;
    try {
      // Connect to socket server
      const connected = await socketService.connect();
      // Authenticate if user info is provided
      if (connected && userId && role) {
        await socketService.authenticate(userId, role);
      }
      this.isInitialized = connected;
      return connected;
    } catch (error) {
      console.error("Failed to initialize chat service:", error);
      return false;
    }
  }

  // Authenticate with Socket.IO
  public async authenticateSocket(userId: number, role: string): Promise<void> {
    await this.initialize();
    await socketService.authenticate(userId, role);
  }

  // Register Socket.IO event handlers
  public onNewChat(callback: (data: any) => void): void {
    socketService.on("newChat", callback);
  }

  public onChatAccepted(callback: (data: any) => void): void {
    socketService.on("chatAccepted", callback);
  }

  public onNewMessage(callback: (data: any) => void): void {
    socketService.on("newMessage", callback);
  }

  public onChatEnded(callback: (data: any) => void): void {
    socketService.on("chatEnded", callback);
  }

  // Get user's chat sessions (works for both customers and managers)
  public async getUserSessions(
    activeOnly: boolean = false
  ): Promise<ApiResponse<ChatSessionDto[]>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ChatSessionDto[]>
      >(`/chat/sessions?activeOnly=${activeOnly}`);
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
      >("/chat/manager/sessions/unassigned");
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
        `/chat/manager/sessions/${sessionId}/join`,
        {}
      );

      // No need to manually notify via Socket.IO - backend will handle it
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
        `/chat/messages/session/${sessionId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
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
      // Make the HTTP request - backend will handle socket notification
      const response = await axiosClient.put<any, ApiResponse<ChatSessionDto>>(
        `/chat/sessions/${sessionId}/end`,
        {}
      );
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

      // Make the HTTP request - backend will handle socket notification
      const response = await axiosClient.post<any, ApiResponse<ChatMessageDto>>(
        "/chat/messages",
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
      >(`/chat/sessions/${sessionId}`);
      return response;
    } catch (error) {
      console.error("Error fetching chat session:", error);
      throw error;
    }
  }

  // Check if socket is connected
  public isSocketConnected(): boolean {
    return socketService.isConnected();
  }

  // Disconnect socket
  public disconnect(): void {
    socketService.disconnect();
    this.isInitialized = false;
  }
}

// Create a singleton instance
const chatService = new ChatService();
export default chatService;
