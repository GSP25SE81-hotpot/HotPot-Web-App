/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/orderHistory.service.ts
import axiosClient from "../axiosInstance";
import {
  OrderHistoryDto,
  OrderHistoryFilterRequest,
  PagedResult,
} from "../../types/orderHistory";
import { OrderStatus } from "../../types/orderManagement";

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

      // If no specific status is requested, add a filter to exclude cart status
      // This uses a custom parameter that your backend might support
      const queryParams = { ...params };
      if (!queryParams.status) {
        // Use a different parameter name that your API might support
        // This is just an example - adjust based on your API
        (queryParams as any).statusNot = OrderStatus.Cart;
      }

      const response = await axiosClient.get<
        any,
        ApiResponse<PagedResult<OrderHistoryDto>>
      >("/order-history", {
        params: queryParams,
      });

      // If backend doesn't support filtering, do it client-side
      const CART_STATUS = OrderStatus.Cart;
      const filteredData = {
        ...response.data,
        items: response.data.items.filter(
          (order) => order.status !== CART_STATUS
        ),
        totalCount: response.data.items.filter(
          (order) => order.status !== CART_STATUS
        ).length,
      };

      return filteredData;
    } catch (error) {
      console.error("Error fetching order history:", error);
      throw error;
    }
  }
}

export const orderHistoryService = new OrderHistoryService();
export default orderHistoryService;
