/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";
// import { feedbackHubService } from "./hubServices";
const API_URL = "manager/feedback";

// Updated to match backend UserInfoDto
export interface UserInfoDto {
  userId: number;
  name: string;
  email: string;
}

// Updated to match backend OrderInfoDto
export interface OrderInfoDto {
  orderId: number;
}

// Updated to match backend ApiResponse
export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
}

export enum FeedbackApprovalStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  Unknown = "string", // handle the placeholder case
}

// Updated to match backend ManagerFeedbackListDto
export interface ManagerFeedbackListDto {
  feedbackId: number;
  title: string;
  comment: string;
  createdAt: Date;
  approvalStatus: FeedbackApprovalStatus;
  hasResponse: boolean;
  responseDate?: Date;
  user: UserInfoDto;
  order: OrderInfoDto;
}

// Updated to match backend ManagerFeedbackDetailDto
export interface ManagerFeedbackDetailDto {
  feedbackId: number;
  title: string;
  comment: string;
  imageURLs: string[];
  createdAt: Date;
  approvalStatus: FeedbackApprovalStatus;
  response: string;
  responseDate?: Date;
  user: UserInfoDto;
  manager?: UserInfoDto;
  order: OrderInfoDto;
}

// Updated to match backend RespondToFeedbackRequest
export interface RespondToFeedbackRequest {
  managerId: number;
  response: string;
}

// Updated to match backend FeedbackStats
export interface FeedbackStats {
  totalFeedbackCount: number;
  pendingFeedbackCount: number;
  approvedFeedbackCount: number;
  rejectedFeedbackCount: number;
  unrespondedFeedbackCount: number;
  respondedFeedbackCount: number;
  responseRate: number;
}

// Updated to match backend PagedResult
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

const feedbackService = {
  // Get all approved feedback
  getAllFeedback: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PagedResult<ManagerFeedbackListDto>>> => {
    try {
      // Explicitly type the axios call to match our expected return type
      const response = await axiosClient.get<
        any,
        ApiResponse<PagedResult<ManagerFeedbackListDto>>
      >(`${API_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`);

      // Now TypeScript knows that response is already of type ApiResponse<PagedResult<ManagerFeedbackListDto>>
      return response;
    } catch (error) {
      console.error("Error fetching all feedback:", error);
      throw error;
    }
  },

  // Get unresponded feedback
  getUnrespondedFeedback: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PagedResult<ManagerFeedbackListDto>>> => {
    try {
      // Use the correct type for the axios response
      const response = await axiosClient.get<
        any,
        ApiResponse<PagedResult<ManagerFeedbackListDto>>
      >(`${API_URL}/unresponded?pageNumber=${pageNumber}&pageSize=${pageSize}`);

      // Return the data property which should match our expected type
      return response;
    } catch (error) {
      console.error("Error fetching unresponded feedback:", error);
      throw new Error("Failed to fetch unresponded feedback");
    }
  },

  // Get feedback by user ID
  getFeedbackByUserId: async (
    userId: number,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PagedResult<ManagerFeedbackListDto>>> => {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<PagedResult<ManagerFeedbackListDto>>
      >(
        `${API_URL}/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      return response;
    } catch (error) {
      console.error(`Error fetching feedback for user ${userId}:`, error);
      throw error;
    }
  },

  // Get feedback by order ID
  getFeedbackByOrderId: async (
    orderId: number
  ): Promise<ApiResponse<ManagerFeedbackListDto[]>> => {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ManagerFeedbackListDto[]>
      >(`${API_URL}/order/${orderId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching feedback for order ${orderId}:`, error);
      throw error;
    }
  },

  // Get feedback by ID
  getFeedbackById: async (
    feedbackId: number
  ): Promise<ApiResponse<ManagerFeedbackDetailDto>> => {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ManagerFeedbackDetailDto>
      >(`${API_URL}/${feedbackId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching feedback ${feedbackId}:`, error);
      throw error;
    }
  },

  // Get feedback statistics
  getFeedbackStats: async (): Promise<ApiResponse<FeedbackStats>> => {
    try {
      const response = await axiosClient.get<any, ApiResponse<FeedbackStats>>(
        `${API_URL}/stats`
      );
      return response;
    } catch (error) {
      console.error("Error fetching feedback stats:", error);
      throw error;
    }
  },

  // Respond to feedback
  respondToFeedback: async (
    feedbackId: number,
    request: RespondToFeedbackRequest
    // userInfo: { userId: number; name: string }
  ): Promise<ApiResponse<ManagerFeedbackDetailDto>> => {
    try {
      const response = await axiosClient.post(
        `${API_URL}/${feedbackId}/respond`,
        request
      );

      // If the response is successful and we have the customer's user ID
      // if (response.data.success && response.data.data?.user?.userId) {
      //   // Send a real-time notification to the customer using the imported feedbackHubService
      //   await feedbackHubService.notifyFeedbackResponse(
      //     response.data.data.user.userId,
      //     feedbackId,
      //     request.response,
      //     userInfo.name
      //   );
      // }
      return response.data;
    } catch (error) {
      console.error(`Error responding to feedback ${feedbackId}:`, error);
      throw error;
    }
  },
};

export default feedbackService;
