// src/types/sharedTypes.ts (Hoặc một file riêng nếu bạn muốn tách Vehicle ra)
type Vehicle = {
  vehicleId: number;
  vehicleName: string;
  licensePlate: string;
  vehicleType: string; // Trong ví dụ trước là number, giờ là string
  orderSize: string; // Trong ví dụ trước là number, giờ là string
};

// src/types/orderDetailItem.ts
type OrderDetailItem = {
  orderDetailId: number;
  quantity: number;
  volumeWeight: number;
  unit: string;
  unitPrice: number;
  itemName: string;
  itemType: string;
  itemId: number;
  orderId: number;
};

// src/types/rentalDetail.ts
type RentalDetail = {
  rentalDetailId: number;
  quantity: number;
  rentalPrice: number;
  hotpotInventoryId: number;
  hotpotName: string;
  seriesNumber: string;
  rentalStartDate: string;
  expectedReturnDate: string;
  actualReturnDate: string;
  lateFee: number;
  damageFee: number;
  rentalNotes: string;
  returnCondition: string;
};

// src/types/assignment.ts
type Assignment = {
  assignmentId: number;
  staffId: number;
  staffName: string;
  taskType: string;
  assignedDate: string;
  completedDate: string;
  isActive: boolean;
};

// src/types/fullOrder.ts (Hoặc một tên phù hợp hơn như OrderWithDetails)
type StaffOrderDetailType = {
  orderId: number;
  orderCode: string;
  address: string;
  notes: string;
  totalPrice: number;
  status: string;
  userID: number;
  userName: string;
  userPhone: string;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  deliveryTime: string; // ISO 8601 string
  preparationStaffId: number;
  preparationStaffName: string;
  preparationAssignmentId: number;
  preparationAssignedDate: string; // ISO 8601 string
  preparationCompletedDate: string; // ISO 8601 string
  shippingStaffId: number;
  shippingStaffName: string;
  shippingAssignmentId: number;
  shippingAssignedDate: string; // ISO 8601 string
  shippingCompletedDate: string; // ISO 8601 string
  isDelivered: boolean;
  pickupStaffId: number;
  pickupStaffName: string;
  pickupAssignmentId: number;
  pickupAssignedDate: string; // ISO 8601 string
  pickupCompletedDate: string; // ISO 8601 string
  orderDetails: OrderDetailItem[]; // Mảng của OrderDetailItem
  rentalDetails: RentalDetail[]; // Mảng của RentalDetail
  vehicle: Vehicle; // Đối tượng Vehicle
  orderSize: string; // Thay đổi từ number sang string dựa trên JSON mới
  discountAmount: number;
  discountCode: string;
  paymentStatus: string;
  assignments: Assignment[]; // Mảng của Assignment
};

// Exports tất cả các type
export type { StaffOrderDetailType };
