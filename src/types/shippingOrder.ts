// types/orderItem.ts hoặc types.ts
type OrderItem = {
  itemId: number;
  itemName: string;
  itemType: string;
  quantity: number;
};

// types/vehicle.ts hoặc types.ts
type Vehicle = {
  vehicleId: number;
  vehicleName: string;
  licensePlate: string;
  vehicleType: number;
  orderSize: number; // Có vẻ như đây là khả năng chở của xe, hoặc số lượng đơn hàng mà xe có thể xử lý
};

// types/orderDetail.ts hoặc types.ts (main type)
type ShippingOrderType = {
  orderItems: OrderItem[]; // Mảng các OrderItem
  hotpotItems: any[]; // Mảng này hiện đang rỗng, nên để any[] hoặc một kiểu cụ thể nếu bạn biết cấu trúc của nó
  customerPhone: string;
  shippingAddress: string;
  deliveryTime: string; // Định dạng ISO 8601 string
  vehicle: Vehicle; // Đối tượng Vehicle
  orderSize: number; // Kích thước đơn hàng tổng thể
  isDelivered: boolean;
  orderId: number;
  orderCode: string;
  status: string;
  customerName: string;
  createdAt: string; // Định dạng ISO 8601 string
  assignedAt: string; // Định dạng ISO 8601 string
};

export type { OrderItem, Vehicle, ShippingOrderType };
