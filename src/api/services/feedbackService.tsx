import axiosClient from "../axiosInstance";

const API_URL = "manager/feedback";

export interface User {
  id: number;
  name: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  message: string | null;
  data: T | null;
}

export interface Manager {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  orderNumber: string;
}

export enum FeedbackApprovalStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface Feedback {
  feedbackId: number;
  userId: number;
  user?: User;
  title: string;
  comment: string;
  rating: number;
  response?: string;
  responseDate?: Date;
  manager?: Manager;
  order?: Order;
  createdAt: Date;
  approvalStatus: FeedbackApprovalStatus;
}

export interface FeedbackResponse {
  managerId: number;
  response: string;
}

export interface FeedbackStats {
  totalFeedbackCount: number;
  respondedFeedbackCount: number;
  unrespondedFeedbackCount: number;
  responseRate: number;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const feedbackService = {
  getAllFeedback: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResult<Feedback>>> => {
    try {
      const response = await axiosClient.get(
        `${API_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all feedback:", error);
      return {
        isSuccess: false,
        message: "Failed to fetch feedback",
        data: null,
      };
    }
  },

  getUnrespondedFeedback: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResult<Feedback>>> => {
    try {
      const response = await axiosClient.get(
        `${API_URL}/unresponded?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching unresponded feedback:", error);
      return {
        isSuccess: false,
        message: "Failed to fetch unresponded feedback",
        data: null,
      };
    }
  },

  getFeedbackStats: async (): Promise<ApiResponse<FeedbackStats>> => {
    try {
      const response = await axiosClient.get(`${API_URL}/stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching feedback stats:", error);
      return {
        isSuccess: false,
        message: "Failed to fetch feedback statistics",
        data: {
          totalFeedbackCount: 0,
          respondedFeedbackCount: 0,
          unrespondedFeedbackCount: 0,
          responseRate: 0,
        },
      };
    }
  },

  respondToFeedback: async (
    feedbackId: number,
    feedbackResponse: FeedbackResponse
  ): Promise<ApiResponse<Feedback>> => {
    try {
      const response = await axiosClient.post(
        `${API_URL}/${feedbackId}/respond`,
        feedbackResponse
      );
      return response.data;
    } catch (error) {
      console.error("Error responding to feedback:", error);
      return {
        isSuccess: false,
        message: "Failed to respond to feedback",
        data: null,
      };
    }
  },
};

export default feedbackService;
