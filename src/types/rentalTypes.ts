// src/types/rentalTypes.ts

export interface EquipmentItem {
  detailId: number;
  type: string;
  id: number;
  name: string;
}

export interface RentOrderDetailResponse {
  orderCode: string;
  orderId: number;
  rentalStartDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  notes?: string;
  equipmentItems: EquipmentItem[];
}

export interface RentalEquipmentItem {
  rentOrderDetailId: number;
  equipmentType: string;
  equipmentName: string;
  quantity: number;
  rentalPrice?: number;
}

export interface RentalListingDto {
  orderId: number;
  rentalStartDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  lateFee?: number;
  damageFee?: number;
  equipmentItems: RentalEquipmentItem[];
}

export interface StaffPickupAssignmentDto {
  assignmentId: number;
  orderId: number;
  orderCode: string;
  staffId: number;
  staffName: string;
  assignedDate: string;
  completedDate?: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  rentalStartDate?: string;
  expectedReturnDate?: string;
  equipmentSummary: string;
  vehicleId?: number;
  vehicleName?: string;
  vehicleType?: string;
}

export interface PickupAssignmentRequestDto {
  staffId: number;
  rentOrderDetailId: number;
  vehicleId?: number;
  notes?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  isAvailable: boolean;
}
