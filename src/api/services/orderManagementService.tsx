import { axiosPrivate } from "../axiosInstance";

const API_URL = "managerordermanagement";

export interface AllocateOrderRequest {
  orderId: number;
  staffId: number;
}

export interface UpdateDeliveryStatusRequest {
  isDelivered: boolean;
  notes: string;
}

export interface UpdateDeliveryTimeRequest {
  deliveryTime: string; // ISO date string
}

export interface UpdateOrderStatusRequest {
  status: string;
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
  signatureData?: string;
  proofTimestamp?: string;
  createdAt: string;
  updatedAt: string;
  staff?: Staff;
}

export interface OrderDetail {
  orderDetailId: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  productName: string;
}

export interface Staff {
  staffId: number;
  userId: number;
  workDays: number;
  userName: string;
  email: string;
  phoneNumber: string;
  assignedOrders: number;
}

export interface Order {
  orderId: number;
  address: string;
  notes?: string;
  totalPrice: number;
  status: string;
  ingredientsDeposit: number;
  hotpotDeposit: number;
  userId: number;
  discountId?: number;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  orderDetails: OrderDetail[];
  shippingOrder?: ShippingOrder;
}

export interface StaffWorkload {
  staffId: number;
  staffName: string;
  activeDeliveries: number;
}

const orderManagementService = {
  // Allocate order to staff
  allocateOrderToStaff: async (
    request: AllocateOrderRequest
  ): Promise<ShippingOrder> => {
    const response = await axiosPrivate.post<ApiResponse<ShippingOrder>>(
      `${API_URL}/allocate`,
      request
    );
    return response.data.data;
  },

  // Update delivery status
  updateDeliveryStatus: async (
    id: number,
    request: UpdateDeliveryStatusRequest
  ): Promise<boolean> => {
    const response = await axiosPrivate.put<ApiResponse<boolean>>(
      `${API_URL}/delivery/status/${id}`,
      request
    );
    return response.data.data;
  },

  // Update delivery time
  updateDeliveryTime: async (
    id: number,
    request: UpdateDeliveryTimeRequest
  ): Promise<boolean> => {
    const response = await axiosPrivate.put<ApiResponse<boolean>>(
      `${API_URL}/delivery/time/${id}`,
      request
    );
    return response.data.data;
  },

  // Get order details
  getOrderDetails: async (id: number): Promise<Order> => {
    const response = await axiosPrivate.get<ApiResponse<Order>>(
      `${API_URL}/details/${id}`
    );
    return response.data.data;
  },

  // Get pending deliveries
  getPendingDeliveries: async (): Promise<Order[]> => {
    const response = await axiosPrivate.get<ApiResponse<Order[]>>(
      `${API_URL}/pending-deliveries`
    );
    return response.data.data;
  },

  // Get staff workload
  getStaffWorkload: async (staffId: number): Promise<StaffWorkload> => {
    const response = await axiosPrivate.get<ApiResponse<StaffWorkload>>(
      `${API_URL}/staff/${staffId}`
    );
    return response.data.data;
  },

  // Update order status
  updateOrderStatus: async (
    id: number,
    request: UpdateOrderStatusRequest
  ): Promise<boolean> => {
    const response = await axiosPrivate.put<ApiResponse<boolean>>(
      `${API_URL}/status/${id}`,
      request
    );
    return response.data.data;
  },

  // Get available statuses
  getAvailableStatuses: async (): Promise<string[]> => {
    const response = await axiosPrivate.get<ApiResponse<string[]>>(
      `${API_URL}/status/available`
    );
    return response.data.data;
  },

  // Get unallocated orders
  getUnallocatedOrders: async (): Promise<Order[]> => {
    const response = await axiosPrivate.get<ApiResponse<Order[]>>(
      `${API_URL}/unallocated`
    );
    return response.data.data;
  },

  // Get all staff
  getAllStaff: async (): Promise<Staff[]> => {
    // This endpoint might need to be implemented on the backend
    // For now, we'll assume it exists
    const response = await axiosPrivate.get<ApiResponse<Staff[]>>(`staff/all`);
    return response.data.data;
  },
};

export default orderManagementService;

// Define the API response interface
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
