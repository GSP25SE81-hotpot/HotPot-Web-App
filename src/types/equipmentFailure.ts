export enum MaintenanceStatus {
  Pending = "Pending",
  InProgress = "InProgress",
  Scheduled = "Scheduled",
  Resolved = "Resolved",
}

export interface ConditionLog {
  conditionLogId: number;
  name: string;
  description: string;
  status: MaintenanceStatus;
  loggedDate: string;
  estimatedResolutionTime?: string;
  resolutionDate?: string;
  resolutionNotes?: string;
  utensilID?: number;
  hotPotInventoryId?: number;
  assignedStaffId?: number;
}

export interface NewEquipmentFailure {
  name: string;
  description: string;
  equipmentType: string;
  equipmentId: string;
}

export interface NotificationState {
  message: string;
  severity: "success" | "error" | "info";
}
