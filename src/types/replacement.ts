// src/types/replacement.ts

export enum ReplacementRequestStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  InProgress = 4,
  Completed = 5,
  Cancelled = 6,
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
  status: string;
  requestDate: string;
  reviewDate?: string;
  reviewNotes?: string;
  completionDate?: string;
  equipmentType: string;
  customerId: number;
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

export interface CompleteReplacementDto {
  completionNotes: string;
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
