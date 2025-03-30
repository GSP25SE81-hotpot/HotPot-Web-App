// src/types/rental.types.ts
export interface RentOrderDetail {
  id: number;
  orderId: number;
  equipmentType: string;
  equipmentId: number;
  equipmentName: string;
  rentalStartDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
  status: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  notes: string;
}

export interface StaffPickupAssignmentDto {
  assignmentId: number;
  staffId: number;
  staffName: string;
  rentOrderDetailId: number;
  equipmentName: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  assignedDate: string;
  completedDate?: string;
  expectedReturnDate: string;
  notes?: string;
}

export interface PickupAssignmentRequestDto {
  staffId: number;
  rentOrderDetailId: number;
  notes?: string;
}

export interface UpdateRentOrderDetailRequest {
  expectedReturnDate?: string;
  notes?: string;
}

export interface PagedResult<T> {
  items: T;
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

export interface RentalHistoryItem {
  id: number;
  orderId: number;
  customerName: string;
  equipmentName: string;
  rentalStartDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: string;
}
