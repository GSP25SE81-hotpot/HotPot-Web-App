/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";
import socketService from "./socketService";
import {
  ApiResponse,
  AssignManagerRequest,
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
  public onChatAccepted(callback: (data: any) => void): void {
    socketService.on("onChatAccepted", callback);
  }

  public onReceiveMessage(callback: (data: ChatMessageDto) => void): void {
    socketService.on("onReceiveMessage", callback);
  }

  public onMessageRead(callback: (messageId: number) => void): void {
    socketService.on("onMessageRead", callback);
  }

  public onChatEnded(callback: (sessionId: number) => void): void {
    socketService.on("onChatEnded", callback);
  }

  // Get active chat sessions
  public async getActiveSessions(): Promise<ApiResponse<ChatSessionDto[]>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ChatSessionDto[]>
      >("/manager/chat/sessions/active");
      return response || [];
    } catch (error) {
      console.error("Error fetching active sessions:", error);
      throw error;
    }
  }

  // Get chat history for a specific manager
  public async getManagerChatHistory(
    managerId: number
  ): Promise<ApiResponse<ChatSessionDto[]>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ChatSessionDto[]>
      >(`/manager/chat/sessions/manager/${managerId}`);
      return response || [];
    } catch (error) {
      console.error("Error fetching manager chat history:", error);
      throw error;
    }
  }

  // Assign a manager to a chat session
  public async assignManagerToSession(
    sessionId: number,
    managerId: number,
    managerName: string,
    customerId: number
  ): Promise<ApiResponse<ChatSessionDto>> {
    try {
      const request: AssignManagerRequest = { managerId };
      const response = await axiosClient.put<any, ApiResponse<ChatSessionDto>>(
        `/manager/chat/sessions/${sessionId}/assign`,
        request
      );
      // Notify via Socket.IO
      socketService.acceptChat(sessionId, managerId, managerName, customerId);
      return response;
    } catch (error) {
      console.error("Error assigning manager to session:", error);
      throw error;
    }
  }

  // Shared functionality methods
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
        `/manager/chat/messages/session/${sessionId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      return response || [];
    } catch (error) {
      console.error("Error fetching session messages:", error);
      throw error;
    }
  }

  // Get unread messages for a user
  public async getUnreadMessages(
    userId: number
  ): Promise<ApiResponse<ChatMessageDto[]>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ChatMessageDto[]>
      >(`/manager/chat/messages/unread/${userId}`);
      return response || [];
    } catch (error) {
      console.error("Error fetching unread messages:", error);
      throw error;
    }
  }

  // Get count of unread messages for a user
  public async getUnreadMessageCount(
    userId: number
  ): Promise<ApiResponse<number>> {
    try {
      const response = await axiosClient.get<any, ApiResponse<number>>(
        `/manager/chat/messages/unread/count/${userId}`
      );
      return response || 0;
    } catch (error) {
      console.error("Error fetching unread message count:", error);
      throw error;
    }
  }

  // End a chat session
  public async endChatSession(
    sessionId: number,
    customerId: number,
    managerId?: number
  ): Promise<ApiResponse<ChatSessionDto>> {
    try {
      const response = await axiosClient.put<any, ApiResponse<ChatSessionDto>>(
        `/manager/chat/sessions/${sessionId}/end`,
        {}
      );
      // Notify via Socket.IO
      socketService.endChat(sessionId, customerId, managerId);
      return response!;
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
        "/manager/chat/messages",
        request
      );
      // Notify via Socket.IO
      socketService.sendMessage(
        response.data!.chatMessageId,
        senderId,
        receiverId,
        message
      );
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  // Mark a message as read
  public async markMessageAsRead(
    messageId: number,
    senderId: number
  ): Promise<ApiResponse<boolean>> {
    try {
      const response = await axiosClient.put<any, ApiResponse<boolean>>(
        `/manager/chat/messages/${messageId}/read`,
        {}
      );
      // Notify via Socket.IO
      socketService.markMessageAsRead(messageId, senderId);
      return response || false;
    } catch (error) {
      console.error("Error marking message as read:", error);
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
      >(`/manager/chat/sessions/${sessionId}`);
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
