import axiosClient from "../axiosInstance";

const API_URL = "/manager/order-management";

export enum OrderStatus {
  Pending = 1,
  Processing = 2,
  Shipping = 3,
  Delivered = 4,
  Cancelled = 5,
  Returning = 6,
  Completed = 7,
}

export interface User {
  userId: number;
  username: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  roleId: number;
}

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: number;
  address: string;
  notes?: string;
  totalPrice: number;
  status: OrderStatus;
  userId: number;
  discountId?: number;
  hasSellItems: boolean;
  hasRentItems: boolean;
  user?: User;
  shippingOrder?: ShippingOrder;
  sellOrder?: {
    sellOrderDetails: OrderItem[];
  };
  rentOrder?: {
    rentOrderDetails: OrderItem[];
  };
  createdAt: string;
}

export interface ShippingOrder {
  shippingOrderId: number;
  orderId: number;
  staffId: number;
  deliveryTime?: string;
  deliveryNotes?: string;
  isDelivered: boolean;
  proofImage?: string;
  proofImageType?: string;
  proofTimestamp?: string;
  order?: Order;
  staff?: User;
}

export interface AllocateOrderRequest {
  orderId: number;
  staffId: number;
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
}

export interface DeliveryStatusUpdateRequest {
  isDelivered: boolean;
  notes?: string;
}

export interface DeliveryTimeUpdateRequest {
  deliveryTime: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  PageNumber: number;
  PageSize: number;
  totalPages?: number; // Calculated field
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

export interface OrderQueryParams extends PaginationParams {
  sortBy?: string;
  sortDescending?: boolean;
  searchTerm?: string;
  status?: OrderStatus;
  fromDate?: string;
  toDate?: string;
  customerId?: number;
}

export interface ShippingOrderQueryParams extends PaginationParams {
  sortBy?: string;
  sortDescending?: boolean;
  searchTerm?: string;
  isDelivered?: boolean;
  staffId?: number;
  fromDate?: string;
  toDate?: string;
}

export const orderManagementService = {
  // Order allocation
  allocateOrderToStaff: async (
    request: AllocateOrderRequest
  ): Promise<ShippingOrder> => {
    const response = await axiosClient.post<ApiResponse<ShippingOrder>>(
      `${API_URL}/allocate`,
      request
    );
    return response.data.data;
  },

  async getUnallocatedOrders(
    queryParams: OrderQueryParams = { pageNumber: 1, pageSize: 10 }
  ): Promise<PagedResult<Order>> {
    try {
      // Convert query params to URL search params
      const params = new URLSearchParams();

      // Add pagination params
      params.append("pageNumber", queryParams.pageNumber.toString());
      params.append("pageSize", queryParams.pageSize.toString());

      // Add sorting params
      if (queryParams.sortBy) {
        params.append("sortBy", queryParams.sortBy);
        params.append(
          "sortDescending",
          queryParams.sortDescending ? "true" : "false"
        );
      }

      // Add filtering params
      if (queryParams.searchTerm)
        params.append("searchTerm", queryParams.searchTerm);
      if (queryParams.fromDate) params.append("fromDate", queryParams.fromDate);
      if (queryParams.toDate) params.append("toDate", queryParams.toDate);
      if (queryParams.customerId)
        params.append("customerId", queryParams.customerId.toString());

      const response = await axiosClient.get<ApiResponse<PagedResult<Order>>>(
        `${API_URL}/unallocated?${params.toString()}`
      );

      return response.data.data;
    } catch (error) {
      console.error("Error fetching unallocated orders:", error);
      throw error;
    }
  },

  getOrdersByStaff: async (staffId: number): Promise<ShippingOrder[]> => {
    const response = await axiosClient.get<ApiResponse<ShippingOrder[]>>(
      `${API_URL}/staff/${staffId}`
    );
    return response.data.data;
  },

  // Order status tracking
  updateOrderStatus: async (
    orderId: number,
    request: OrderStatusUpdateRequest
  ): Promise<Order> => {
    const response = await axiosClient.put<ApiResponse<Order>>(
      `${API_URL}/status/${orderId}`,
      request
    );
    return response.data.data;
  },

  getOrderWithDetails: async (orderId: number): Promise<Order> => {
    const response = await axiosClient.get<ApiResponse<Order>>(
      `${API_URL}/details/${orderId}`
    );
    return response.data.data;
  },

  async getOrdersByStatus(
    status: OrderStatus,
    queryParams: Omit<OrderQueryParams, "status"> = {
      pageNumber: 1,
      pageSize: 10,
    }
  ): Promise<PagedResult<Order>> {
    try {
      // Convert query params to URL search params
      const params = new URLSearchParams();

      // Add pagination params
      params.append("pageNumber", queryParams.pageNumber.toString());
      params.append("pageSize", queryParams.pageSize.toString());

      // Add sorting params
      if (queryParams.sortBy) {
        params.append("sortBy", queryParams.sortBy);
        params.append(
          "sortDescending",
          queryParams.sortDescending ? "true" : "false"
        );
      }

      // Add filtering params
      if (queryParams.searchTerm)
        params.append("searchTerm", queryParams.searchTerm);
      if (queryParams.fromDate) params.append("fromDate", queryParams.fromDate);
      if (queryParams.toDate) params.append("toDate", queryParams.toDate);
      if (queryParams.customerId)
        params.append("customerId", queryParams.customerId.toString());

      // If we only need the count, add a parameter to indicate this
      if (queryParams.pageSize === 1) {
        params.append("countOnly", "true");
      }

      const response = await axiosClient.get<ApiResponse<PagedResult<Order>>>(
        `${API_URL}/status/${status}?${params.toString()}`
      );

      // Check if the response has the expected structure
      if (response && response.data && response.data.data) {
        return response.data.data;
      } else {
        // If the response doesn't have the expected structure, return an empty paged result
        console.error("Unexpected API response format:", response);
        return {
          items: [],
          totalCount: 0,
          PageNumber: queryParams.pageNumber,
          PageSize: queryParams.pageSize,
        };
      }
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      // Return an empty paged result in case of error
      return {
        items: [],
        totalCount: 0,
        PageNumber: queryParams.pageNumber,
        PageSize: queryParams.pageSize,
      };
    }
  },

  // Delivery progress monitoring
  updateDeliveryStatus: async (
    shippingOrderId: number,
    request: DeliveryStatusUpdateRequest
  ): Promise<ShippingOrder> => {
    const response = await axiosClient.put<ApiResponse<ShippingOrder>>(
      `${API_URL}/delivery/status/${shippingOrderId}`,
      request
    );
    return response.data.data;
  },

  async getPendingDeliveries(
    queryParams: ShippingOrderQueryParams = { pageNumber: 1, pageSize: 10 }
  ): Promise<PagedResult<ShippingOrder>> {
    try {
      // Convert query params to URL search params
      const params = new URLSearchParams();

      // Add pagination params
      params.append("pageNumber", queryParams.pageNumber.toString());
      params.append("pageSize", queryParams.pageSize.toString());

      // Add sorting params
      if (queryParams.sortBy) {
        params.append("sortBy", queryParams.sortBy);
        params.append(
          "sortDescending",
          queryParams.sortDescending ? "true" : "false"
        );
      }

      // Add filtering params
      if (queryParams.searchTerm)
        params.append("searchTerm", queryParams.searchTerm);
      if (queryParams.fromDate) params.append("fromDate", queryParams.fromDate);
      if (queryParams.toDate) params.append("toDate", queryParams.toDate);
      if (queryParams.staffId)
        params.append("staffId", queryParams.staffId.toString());
      if (queryParams.isDelivered !== undefined)
        params.append("isDelivered", queryParams.isDelivered.toString());

      const response = await axiosClient.get<
        ApiResponse<PagedResult<ShippingOrder>>
      >(`${API_URL}/pending-deliveries?${params.toString()}`);

      return response.data.data;
    } catch (error) {
      console.error("Error fetching pending deliveries:", error);
      throw error;
    }
  },

  updateDeliveryTime: async (
    shippingOrderId: number,
    request: DeliveryTimeUpdateRequest
  ): Promise<ShippingOrder> => {
    const response = await axiosClient.put<ApiResponse<ShippingOrder>>(
      `${API_URL}/delivery/time/${shippingOrderId}`,
      request
    );
    return response.data.data;
  },

  // Add a method for marking an order as delivered
  markOrderAsDelivered: async (request: {
    shippingOrderId: number;
    deliveryNotes?: string;
  }): Promise<ShippingOrder> => {
    const response = await axiosClient.post<ApiResponse<ShippingOrder>>(
      `${API_URL}/delivery/mark-delivered`,
      request
    );
    return response.data.data;
  },
};
