/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/orderHistory.service.ts
import axiosClient from "../axiosInstance";
import {
  OrderHistoryDto,
  OrderHistoryFilterRequest,
  PagedResult,
} from "../../types/orderHistory";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class OrderHistoryService {
  async getOrderHistory(
    filter: OrderHistoryFilterRequest = {}
  ): Promise<PagedResult<OrderHistoryDto>> {
    try {
      // Set default values if not provided
      const params: OrderHistoryFilterRequest = {
        pageNumber: filter.pageNumber || 1,
        pageSize: filter.pageSize || 10,
        ...filter,
      };

      // Format dates if they exist
      if (params.startDate) {
        params.startDate = new Date(params.startDate);
      }

      if (params.endDate) {
        params.endDate = new Date(params.endDate);
      }

      const response = await axiosClient.get<
        any,
        ApiResponse<PagedResult<OrderHistoryDto>>
      >("/order-history", {
        params,
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching order history:", error);
      throw error;
    }
  }
}

export const orderHistoryService = new OrderHistoryService();
export default orderHistoryService;
