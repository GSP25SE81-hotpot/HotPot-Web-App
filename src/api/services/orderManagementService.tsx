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

  getUnallocatedOrders: async (): Promise<Order[]> => {
    const response = await axiosClient.get<ApiResponse<Order[]>>(
      `${API_URL}/unallocated`
    );
    return response.data.data;
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

  getOrdersByStatus: async (status: OrderStatus): Promise<Order[]> => {
    const response = await axiosClient.get<ApiResponse<Order[]>>(
      `${API_URL}/status/${status}`
    );
    return response.data.data;
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

  getPendingDeliveries: async (): Promise<ShippingOrder[]> => {
    const response = await axiosClient.get<ApiResponse<ShippingOrder[]>>(
      `${API_URL}/pending-deliveries`
    );
    return response.data.data;
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
};
