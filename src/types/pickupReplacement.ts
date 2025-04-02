// src/types/replacement.ts
export enum EquipmentType {
  HotPot = 1,
  Utensil = 2,
}

export enum ReplacementRequestStatus {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
  InProgress = 4,
  Completed = 5,
  Cancelled = 6,
}

export enum MaintenanceStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
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
  additionalNotes: string;
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

export interface UpdateReplacementStatusDto {
  status: ReplacementRequestStatus;
  notes?: string;
}

export interface CompleteReplacementDto {
  completionNotes: string;
}

export interface ReplacementRequestDto {
  replacementRequestId: number;
  requestReason: string;
  additionalNotes: string;
  status: ReplacementRequestStatus;
  requestDate: string;
  reviewDate?: string;
  reviewNotes?: string;
  assignedStaffId?: number;
}

export interface VerifyEquipmentFaultyDto {
  isFaulty: boolean;
  verificationNotes: string;
}
