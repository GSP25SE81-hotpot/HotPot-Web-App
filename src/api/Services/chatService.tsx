/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";
import {
  ApiResponse,
  AssignManagerRequest,
  ChatMessageDto,
  ChatSessionDetailDto,
  ChatSessionDto,
  CreateChatSessionRequest,
  SendMessageRequest,
} from "../../types/chat";

export class ChatService {
  // Get active chat sessions
  public async getActiveSessions(): Promise<ApiResponse<ChatSessionDto[]>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ChatSessionDto[]>
      >("/api/manager/chat/sessions/active");
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
      >(`/api/manager/chat/sessions/manager/${managerId}`);
      return response || [];
    } catch (error) {
      console.error("Error fetching manager chat history:", error);
      throw error;
    }
  }

  // Assign a manager to a chat session
  public async assignManagerToSession(
    sessionId: number,
    managerId: number
  ): Promise<ApiResponse<ChatSessionDto>> {
    try {
      const request: AssignManagerRequest = { managerId };
      const response = await axiosClient.put<any, ApiResponse<ChatSessionDto>>(
        `/api/manager/chat/sessions/${sessionId}/assign`,
        request
      );
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
        `/api/manager/chat/messages/session/${sessionId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
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
      >(`/api/manager/chat/messages/unread/${userId}`);
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
        `/api/manager/chat/messages/unread/count/${userId}`
      );
      return response || 0;
    } catch (error) {
      console.error("Error fetching unread message count:", error);
      throw error;
    }
  }

  // End a chat session
  public async endChatSession(
    sessionId: number
  ): Promise<ApiResponse<ChatSessionDto>> {
    try {
      const response = await axiosClient.put<any, ApiResponse<ChatSessionDto>>(
        `/api/manager/chat/sessions/${sessionId}/end`,
        {}
      );
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
        "/api/manager/chat/messages",
        request
      );
      return response;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  // Mark a message as read
  public async markMessageAsRead(
    messageId: number
  ): Promise<ApiResponse<boolean>> {
    try {
      const response = await axiosClient.put<any, ApiResponse<boolean>>(
        `/api/manager/chat/messages/${messageId}/read`,
        {}
      );
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
      >(`/api/manager/chat/sessions/${sessionId}`);
      return response;
    } catch (error) {
      console.error("Error fetching chat session:", error);
      throw error;
    }
  }

  // Customer-specific methods (these would typically be in a separate service)

  // Create a new chat session
  public async createChatSession(
    customerId: number,
    topic: string
  ): Promise<ApiResponse<ChatSessionDto>> {
    try {
      const request: CreateChatSessionRequest = { customerId, topic };
      const response = await axiosClient.post<any, ApiResponse<ChatSessionDto>>(
        "/api/customer/chat/sessions",
        request
      );
      return response;
    } catch (error) {
      console.error("Error creating chat session:", error);
      throw error;
    }
  }
}
