// src/types/replacement.ts

export enum ReplacementRequestStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  InProgress = "InProgress",
  Completed = "Completed",
  Cancelled = "Cancelled",
}

export enum EquipmentType {
  HotPot = "HotPot",
  Utensil = "Utensil",
}

export interface ReplacementRequestSummaryDto {
  replacementRequestId: number;
  requestReason: string;
  status: ReplacementRequestStatus;
  requestDate: string;
  reviewDate?: string;
  completionDate?: string;
  equipmentType: EquipmentType;
  equipmentName: string;
  customerName: string;
  assignedStaffName?: string;
}

export interface ReplacementRequestDetailDto {
  replacementRequestId: number;
  requestReason: string;
  additionalNotes?: string;
  status: ReplacementRequestStatus;
  requestDate: string;
  reviewDate?: string;
  reviewNotes?: string;
  completionDate?: string;
  equipmentType: EquipmentType;
  equipmentName: string;

  customerId?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  assignedStaffId?: number;
  assignedStaffName?: string;

  hotPotInventoryId?: number;
  hotPotSeriesNumber?: string;
  hotPotName?: string;

  utensilId?: number;
  utensilName?: string;
  utensilType?: string;
}

export interface ReviewReplacementRequestDto {
  isApproved: boolean;
  reviewNotes: string;
}

export interface AssignStaffDto {
  staffId: number;
}

export interface NotifyCustomerRequest {
  customerId: number;
  conditionLogId: number;
  message: string;
  estimatedResolutionTime: Date;
}

export interface ReplacementDashboardDto {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  rejectedRequests: number;
  cancelledRequests: number;

  hotPotRequests: number;
  utensilRequests: number;

  recentRequests: ReplacementRequestSummaryDto[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export type Order = "asc" | "desc";
export type OrderBy = keyof Omit<
  ReplacementRequestSummaryDto,
  "equipmentName" | "customerName" | "assignedStaffName"
>;

export interface NotificationState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}
