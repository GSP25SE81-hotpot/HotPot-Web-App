// src/types/staffAssignment.ts
import { OrderStatus, StaffTaskType } from "./orderManagement";

export interface StaffInfo {
  staffId: number;
  staffName: string;
  assignedDate: string;
  completedDate: string | null;
  isActive: boolean;
}

export interface StaffAssignmentHistoryDto {
  staffAssignmentId: number;
  staffId: number;
  staffName: string | null;
  orderId: number;
  orderCode: string | null;
  customerName: string | null;
  taskType: StaffTaskType;
  taskTypeName: string;
  assignedDate: string;
  completedDate: string | null;
  isActive: boolean;
  orderStatus: OrderStatus;
  orderStatusName: string;
  additionalPreparationStaff: StaffInfo[];
}

export interface StaffAssignmentHistoryFilterRequest {
  startDate?: string;
  endDate?: string;
  taskType?: StaffTaskType;
  isActive?: boolean;
  staffId?: number;
  staffName?: string;
  orderCode?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}
