export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface StaffPickupAssignment {
  assignmentId: number;
  orderId: number;
  orderCode: string;
  staffId: number;
  staffName: string;
  assignedDate: string;
  completedDate: string | null;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  rentalStartDate: string | null;
  expectedReturnDate: string | null;
  equipmentSummary: string;
  vehicleId?: number;
  vehicleName?: string;
  vehicleType?: string;
}

export interface UnifiedReturnRequest {
  assignmentId?: number;
  rentOrderId?: number;
  completedDate: string;
  returnCondition: string;
  damageFee?: number;
  notes?: string;
}
