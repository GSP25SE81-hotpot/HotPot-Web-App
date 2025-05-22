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
  constructor() {
    // Initialize Socket.IO connection
    socketService.connect();
  }

  // Authenticate with Socket.IO
  public authenticateSocket(userId: number, role: string): void {
    socketService.authenticate(userId, role);
  }

  // Register Socket.IO event handlers
  public onNewChat(callback: (data: any) => void): void {
    socketService.on("newChat", callback);
  }

  public onNewMessage(callback: (data: any) => void): void {
    socketService.on("newMessage", callback);
  }

  public onChatEnded(callback: (data: any) => void): void {
    socketService.on("chatEnded", callback);
  }

  // Get active chat sessions
  public async getActiveSessions(): Promise<ApiResponse<ChatSessionDto[]>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ChatSessionDto[]>
      >("/chat/manager/sessions/active");
      return response || { success: true, data: [] };
    } catch (error) {
      console.error("Error fetching active sessions:", error);
      throw error;
    }
  }

  // Get chat history for the logged-in manager
  public async getChatHistory(): Promise<ApiResponse<ChatSessionDto[]>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ChatSessionDto[]>
      >("/chat/manager/sessions/history");
      return response || { success: true, data: [] };
    } catch (error) {
      console.error("Error fetching chat history:", error);
      throw error;
    }
  }

  // Join a chat session as manager
  public async joinChatSession(
    sessionId: number,
    managerId: number,
    managerName: string,
    customerId: number
  ): Promise<ApiResponse<ChatSessionDto>> {
    try {
      const response = await axiosClient.post<any, ApiResponse<ChatSessionDto>>(
        `/chat/sessions/manager/${sessionId}/join`,
        {}
      );

      // Notify via Socket.IO
      socketService.joinChat(sessionId, managerId, managerName, customerId);

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
    sessionId: number,
    customerId: number,
    managerId: number
  ): Promise<ApiResponse<ChatSessionDto>> {
    try {
      const response = await axiosClient.put<any, ApiResponse<ChatSessionDto>>(
        `/chat/sessions/${sessionId}/end`,
        {}
      );

      // Notify via Socket.IO
      socketService.endChat(sessionId, customerId, managerId);

      return response;
    } catch (error) {
      console.error("Error ending chat session:", error);
      throw error;
    }
  }

  // Send a message
  public async sendMessage(
    senderId: number,
    receiverId: number,
    message: string
  ): Promise<ApiResponse<ChatMessageDto>> {
    try {
      const request: SendMessageRequest = { senderId, receiverId, message };
      const response = await axiosClient.post<any, ApiResponse<ChatMessageDto>>(
        "/chat/messages",
        request
      );

      // Notify via Socket.IO
      if (response.data) {
        socketService.sendMessage(
          response.data.chatMessageId,
          senderId,
          receiverId,
          message
        );
      }

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
}

// Create a singleton instance
const chatService = new ChatService();
export default chatService;
