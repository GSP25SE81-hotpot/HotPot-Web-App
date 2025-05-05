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
  notes: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  rentalStartDate: string | null;
  expectedReturnDate: string | null;
  equipmentSummary: string;
}

export interface RentalListing {
  rentOrderDetailId: number;
  orderId: number;
  equipmentType: string;
  equipmentName: string;
  quantity: number;
  rentalPrice: number;
  rentalStartDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  lateFee: number | null;
  damageFee: number | null;
}

export interface RentOrderDetail {
  rentOrderDetailId: number;
  orderId: number;
  utensilId: number | null;
  utensilName: string;
  hotpotInventoryId: number | null;
  hotpotName: string;
  quantity: number;
  rentalPrice: number;
  rentalStartDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
  lateFee: number | null;
  damageFee: number | null;
  rentalNotes: string;
  returnCondition: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
}

export interface UnifiedReturnRequest {
  assignmentId?: number;
  rentOrderId?: number;
  completedDate: string;
  returnCondition: string;
  damageFee?: number;
  notes?: string;
}
