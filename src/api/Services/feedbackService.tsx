/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";
// import { feedbackHubService } from "./hubServices";
const API_URL = "manager/feedback";

// Updated to match backend ApiResponse
export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
}

// Updated to match backend FeedbackListDto
export interface FeedbackListDto {
  feedbackId: number;
  userName: string;
  orderId: number;
  createdAt: Date;
}

// Updated to match backend FeedbackStats
export interface FeedbackStats {
  totalFeedbackCount: number;
  // Add other stats properties as needed
}

// Updated to match backend PagedResult
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

// New interface to match backend FeedbackFilterRequest
export interface FeedbackFilterRequest {
  pageNumber?: number;
  pageSize?: number;
  userId?: number;
  orderId?: number;
  fromDate?: Date;
  toDate?: Date;
  sortBy?: string;
  ascending?: boolean;
  searchTerm?: string;
}

const feedbackService = {
  // Get filtered feedback with various options
  getFilteredFeedback: async (
    filterRequest: FeedbackFilterRequest = {}
  ): Promise<ApiResponse<PagedResult<FeedbackListDto>>> => {
    try {
      // Set default values if not provided
      const pageNumber = filterRequest.pageNumber || 1;
      const pageSize = filterRequest.pageSize || 10;

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append("pageNumber", pageNumber.toString());
      queryParams.append("pageSize", pageSize.toString());

      // Add optional filter parameters
      if (filterRequest.userId)
        queryParams.append("userId", filterRequest.userId.toString());
      if (filterRequest.orderId)
        queryParams.append("orderId", filterRequest.orderId.toString());
      if (filterRequest.fromDate)
        queryParams.append("fromDate", filterRequest.fromDate.toISOString());
      if (filterRequest.toDate)
        queryParams.append("toDate", filterRequest.toDate.toISOString());
      if (filterRequest.sortBy)
        queryParams.append("sortBy", filterRequest.sortBy);
      if (filterRequest.ascending !== undefined)
        queryParams.append("ascending", filterRequest.ascending.toString());
      if (filterRequest.searchTerm)
        queryParams.append("searchTerm", filterRequest.searchTerm);

      // Explicitly type the axios call to match our expected return type
      const response = await axiosClient.get<
        any,
        ApiResponse<PagedResult<FeedbackListDto>>
      >(`${API_URL}?${queryParams.toString()}`);

      return response;
    } catch (error) {
      console.error("Error fetching filtered feedback:", error);
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
};

export default feedbackService;
