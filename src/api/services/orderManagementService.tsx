/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  StaffAssignmentRequest,
  StaffAssignmentResponse,
  ShippingOrderAllocationDTO,
  ApiResponse,
  AllocateOrderWithVehicleRequest,
  OrderSizeDTO,
  StaffShippingOrderDTO,
  OrderStatus,
  OrderStatusUpdateDTO,
  OrderDetailDTO,
  OrderQueryParams,
  PagedResult,
  OrderWithDetailsDTO,
  DeliveryStatusUpdateRequest,
  DeliveryStatusUpdateDTO,
  PendingDeliveryDTO,
  ShippingOrderQueryParams,
  DeliveryTimeUpdateRequest,
  DeliveryTimeUpdateDTO,
  UnallocatedOrderDTO,
} from "../../types/orderManagement";
import axiosClient from "../axiosInstance";

const API_URL = "/manager/order-management";

export const orderManagementService = {
  // Order allocation
  assignStaffToOrder: async (
    request: StaffAssignmentRequest
  ): Promise<StaffAssignmentResponse> => {
    const response = await axiosClient.post<
      any,
      ApiResponse<StaffAssignmentResponse>
    >(`${API_URL}/assign-staff`, request);
    return response.data;
  },

  // New method for allocating order with vehicle
  allocateOrderToStaffWithVehicle: async (
    request: AllocateOrderWithVehicleRequest
  ): Promise<ShippingOrderAllocationDTO> => {
    const response = await axiosClient.post<
      any,
      ApiResponse<ShippingOrderAllocationDTO>
    >(`${API_URL}/allocate-with-vehicle`, request);
    return response.data;
  },

  // New method for estimating order size
  estimateOrderSize: async (orderCode: string): Promise<OrderSizeDTO> => {
    const response = await axiosClient.get<any, ApiResponse<OrderSizeDTO>>(
      `${API_URL}/estimate-size/${orderCode}`
    );
    return response.data;
  },

  getOrdersByStaff: async (
    staffId: number
  ): Promise<StaffShippingOrderDTO[]> => {
    const response = await axiosClient.get<
      any,
      ApiResponse<StaffShippingOrderDTO[]>
    >(`${API_URL}/staff/${staffId}`);
    return response.data;
  },

  // Order status tracking
  updateOrderStatus: async (
    orderId: string,
    status: OrderStatus
  ): Promise<OrderStatusUpdateDTO> => {
    const response = await axiosClient.put<
      any,
      ApiResponse<OrderStatusUpdateDTO>
    >(
      `${API_URL}/status/${orderId}`,
      { status } // Send as object to match backend
    );
    return response.data;
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
      const response = await axiosClient.get<
        any,
        ApiResponse<PagedResult<OrderWithDetailsDTO>>
      >(url);

      // Directly return the data from the response without any additional processing
      if (response && response.data && response.data) {
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
        any,
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
        any,
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
