/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

// User interfaces
export interface UserDTO {
  userId: number;
  name: string;
  email?: string;
  phoneNumber?: string;
}

export interface StaffDTO {
  staffId: number;
  name: string;
}

// Order item interfaces
export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

// Shipping interfaces
export interface ShippingInfoDTO {
  shippingOrderId: number;
  deliveryTime?: string;
  isDelivered: boolean;
  deliveryNotes?: string;
  staff?: StaffDTO;
}

export interface ShippingDetailDTO {
  shippingOrderId: number;
  staffId: number;
  staffName: string;
  deliveryTime?: string;
  deliveryNotes?: string;
  isDelivered: boolean;
}

export interface OrderWithDetailsDTO {
  orderId: string;
  address: string;
  notes?: string;
  totalPrice: number;
  status: OrderStatus;
  hasSellItems: boolean;
  hasRentItems: boolean;
  userId: number;
  userName: string;
  shippingInfo?: ShippingInfoDTO;
}

export interface OrderDetailDTO {
  orderId: string;
  address: string;
  notes?: string;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  userId: number;
  userName: string;
  shippingInfo?: ShippingDetailDTO;
}

export interface PendingDeliveryDTO {
  shippingOrderId: number;
  orderId: string;
  deliveryTime?: string;
  deliveryNotes?: string;
  address: string;
  notes?: string;
  totalPrice: number;
  status: OrderStatus;
  userId: number;
  userName: string;
}

export interface StaffShippingOrderDTO {
  shippingOrderId: number;
  orderId: string;
  deliveryTime?: string;
  deliveryNotes?: string;
  isDelivered: boolean;
  address: string;
  notes?: string;
  totalPrice: number;
  status: OrderStatus;
  customerId: number;
  customerName: string;
  hasSellItems: boolean;
  hasRentItems: boolean;
}

export interface ShippingOrderAllocationDTO {
  shippingOrderId: number;
  orderId: number;
  orderCode: string;
  staffId: number;
  staffName: string;
  isDelivered: boolean;
  createdAt: string;
}

export interface OrderStatusUpdateDTO {
  orderId: string;
  status: OrderStatus;
  updatedAt: string;
}

export interface DeliveryStatusUpdateDTO {
  shippingOrderId: number;
  orderId: number;
  isDelivered: boolean;
  deliveryTime?: string;
  deliveryNotes?: string;
  updatedAt: string;
}

export interface DeliveryTimeUpdateDTO {
  shippingOrderId: number;
  orderId: number;
  orderCode: string;
  deliveryTime: string;
  updatedAt: string;
}

// Request interfaces
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

// API response interfaces
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Query parameter interfaces
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

export interface OrderCountsDTO {
  pendingCount: number;
  processingCount: number;
  shippedCount: number;
  deliveredCount: number;
  cancelledCount: number;
  returningCount: number;
  completedCount: number;
  totalCount: number;
}
export interface UnallocatedOrderDTO {
  orderId: number;
  orderCode: string;
  address: string;
  notes: string | null;
  totalPrice: number;
  status: OrderStatus;
  userId: number;
  userName: string;
  hasSellItems: boolean;
  hasRentItems: boolean;
}

// Service implementation
export const orderManagementService = {
  // Order allocation
  allocateOrderToStaff: async (
    request: AllocateOrderRequest
  ): Promise<ShippingOrderAllocationDTO> => {
    const response = await axiosClient.post<
      ApiResponse<ShippingOrderAllocationDTO>
    >(`${API_URL}/allocate`, request);
    return response.data.data;
  },

  getOrdersByStaff: async (
    staffId: number
  ): Promise<StaffShippingOrderDTO[]> => {
    const response = await axiosClient.get<
      ApiResponse<StaffShippingOrderDTO[]>
    >(`${API_URL}/staff/${staffId}`);
    return response.data.data;
  },

  // Order status tracking
  updateOrderStatus: async (
    orderId: string,
    status: OrderStatus
  ): Promise<OrderStatusUpdateDTO> => {
    const response = await axiosClient.put<ApiResponse<OrderStatusUpdateDTO>>(
      `${API_URL}/status/${orderId}`,
      { status } // Send as object to match backend
    );
    return response.data.data;
  },

  getOrderWithDetails: async (orderId: string): Promise<OrderDetailDTO> => {
    const response = await axiosClient.get<any, ApiResponse<OrderDetailDTO>>(
      `${API_URL}/details/${orderId}`
    );
    return response.data;
  },

  async getOrdersByStatus(
    status: OrderStatus,
    queryParams: Omit<OrderQueryParams, "status"> = {
      pageNumber: 1,
      pageSize: 10,
    }
  ): Promise<PagedResult<OrderWithDetailsDTO>> {
    try {
      // console.log(
      //   `Making API call for status ${status} with params:`,
      //   queryParams
      // );
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

      const url = `${API_URL}/status/${status}?${params.toString()}`;
      // console.log(`API URL: ${url}`);

      const response = await axiosClient.get<
        any,
        ApiResponse<PagedResult<OrderWithDetailsDTO>>
      >(url);

      // console.log(`Raw API response for status ${status}:`, response);

      // Directly return the data from the response without any additional processing
      if (response && response.data && response.data) {
        // console.log(`Response data for status ${status}:`, response.data);
        return response.data;
      } else {
        console.warn(`No data property in response for status ${status}`);
        return {
          items: [],
          totalCount: 0,
          pageNumber: queryParams.pageNumber,
          pageSize: queryParams.pageSize,
          totalPages: 0,
        };
      }
    } catch (error) {
      // console.error(`Error fetching orders by status ${status}:`, error);
      return {
        items: [],
        totalCount: 0,
        pageNumber: queryParams.pageNumber,
        pageSize: queryParams.pageSize,
        totalPages: 0,
      };
    }
  },

  // Delivery progress monitoring
  updateDeliveryStatus: async (
    shippingOrderId: number,
    request: DeliveryStatusUpdateRequest
  ): Promise<DeliveryStatusUpdateDTO> => {
    const response = await axiosClient.put<
      any,
      ApiResponse<DeliveryStatusUpdateDTO>
    >(`${API_URL}/delivery/status/${shippingOrderId}`, request);
    return response.data;
  },

  async getPendingDeliveries(
    queryParams: ShippingOrderQueryParams = { pageNumber: 1, pageSize: 10 }
  ): Promise<PagedResult<PendingDeliveryDTO>> {
    try {
      const params = new URLSearchParams();

      // Add pagination params
      params.append("pageNumber", queryParams.pageNumber.toString());
      params.append("pageSize", queryParams.pageSize.toString());

      // Add optional params
      if (queryParams.sortBy) {
        params.append("sortBy", queryParams.sortBy);
        params.append(
          "sortDescending",
          queryParams.sortDescending ? "true" : "false"
        );
      }
      if (queryParams.searchTerm)
        params.append("searchTerm", queryParams.searchTerm);
      if (queryParams.fromDate) params.append("fromDate", queryParams.fromDate);
      if (queryParams.toDate) params.append("toDate", queryParams.toDate);
      if (queryParams.staffId)
        params.append("staffId", queryParams.staffId.toString());
      if (queryParams.isDelivered !== undefined) {
        params.append("isDelivered", queryParams.isDelivered.toString());
      }

      // The interceptor will return response.data (ApiResponse<PagedResult<PendingDeliveryDTO>>)
      const apiResponse = await axiosClient.get<
        ApiResponse<PagedResult<PendingDeliveryDTO>>
      >(`${API_URL}/pending-deliveries?${params.toString()}`);

      // Since the interceptor strips the Axios wrapper, apiResponse is actually the ApiResponse
      const responseData = apiResponse as unknown as ApiResponse<
        PagedResult<PendingDeliveryDTO>
      >;

      if (!responseData.success) {
        throw new Error(
          responseData.message || "Failed to fetch pending deliveries"
        );
      }

      return responseData.data;
    } catch (error: any) {
      console.error("Error fetching pending deliveries:", error);
      throw new Error(
        error.response?.data?.message ||
          "You don't have permission to view pending deliveries or the service is unavailable"
      );
    }
  },

  updateDeliveryTime: async (
    shippingOrderId: number,
    request: DeliveryTimeUpdateRequest
  ): Promise<DeliveryTimeUpdateDTO> => {
    const response = await axiosClient.put<
      any,
      ApiResponse<DeliveryTimeUpdateDTO>
    >(`${API_URL}/delivery/time/${shippingOrderId}`, request);
    return response.data;
  },

  getOrderCounts: async (): Promise<OrderCountsDTO> => {
    try {
      // console.log(`Making API request to: ${API_URL}/counts`);

      // Use any to bypass TypeScript's type checking for the response
      const response: any = await axiosClient.get(`${API_URL}/counts`);

      // console.log("API response:", response);

      // Create a new object with the expected properties
      const counts: OrderCountsDTO = {
        pendingCount: response?.pendingCount || 0,
        processingCount: response?.processingCount || 0,
        shippedCount: response?.shippedCount || 0,
        deliveredCount: response?.deliveredCount || 0,
        cancelledCount: response?.cancelledCount || 0,
        returningCount: response?.returningCount || 0,
        completedCount: response?.completedCount || 0,
        totalCount: response?.totalCount || 0,
      };

      // console.log("Extracted counts:", counts);
      return counts;
    } catch (error) {
      // console.error("Error fetching order counts:", error);
      return {
        pendingCount: 0,
        processingCount: 0,
        shippedCount: 0,
        deliveredCount: 0,
        cancelledCount: 0,
        returningCount: 0,
        completedCount: 0,
        totalCount: 0,
      };
    }
  },

  async getUnallocatedOrders(
    queryParams: OrderQueryParams = { pageNumber: 1, pageSize: 10 }
  ): Promise<PagedResult<UnallocatedOrderDTO>> {
    try {
      const params = new URLSearchParams();
      params.append("pageNumber", queryParams.pageNumber.toString());
      params.append("pageSize", queryParams.pageSize.toString());

      if (queryParams.sortBy) {
        params.append("sortBy", queryParams.sortBy);
        params.append(
          "sortDescending",
          queryParams.sortDescending ? "true" : "false"
        );
      }

      if (queryParams.searchTerm)
        params.append("searchTerm", queryParams.searchTerm);
      if (queryParams.fromDate) params.append("fromDate", queryParams.fromDate);
      if (queryParams.toDate) params.append("toDate", queryParams.toDate);
      if (queryParams.customerId)
        params.append("customerId", queryParams.customerId.toString());

      // The interceptor returns response.data (ApiResponse<PagedResult<UnallocatedOrderDTO>>)
      const apiResponse = await axiosClient.get<
        ApiResponse<PagedResult<UnallocatedOrderDTO>>
      >(`${API_URL}/unallocated?${params.toString()}`);

      // Since the interceptor strips the Axios wrapper, apiResponse is actually the ApiResponse
      const responseData = apiResponse as unknown as ApiResponse<
        PagedResult<UnallocatedOrderDTO>
      >;

      if (responseData.success) {
        return responseData.data; // This is the PagedResult<UnallocatedOrderDTO>
      }

      console.warn("API request was not successful:", responseData);
      return this.getEmptyPagedResult(queryParams);
    } catch (error) {
      console.error("Error fetching unallocated orders:", error);
      return this.getEmptyPagedResult(queryParams);
    }
  },

  getEmptyPagedResult(
    queryParams: OrderQueryParams
  ): PagedResult<UnallocatedOrderDTO> {
    return {
      items: [],
      totalCount: 0,
      pageNumber: queryParams.pageNumber,
      pageSize: queryParams.pageSize,
      totalPages: 0,
    };
  },
};
