// src/api/services/equipmentService.ts

import { MaintenanceStatus } from "../../types/equipmentFailure";
import axiosClient from "../axiosInstance";


const API_URL = "manager/equipment";

export interface EquipmentFailureDto {
  name: string;
  description: string;
  utensilID?: number;
  hotPotInventoryId?: number;
  customerId?: number;
}

export interface UpdateResolutionTimelineRequest {
  status: MaintenanceStatus;
  estimatedResolutionTime: string;
  message: string;
}

export interface AssignStaffRequest {
  staffId: number;
}

export interface ResolveEquipmentRequest {
  resolutionNotes: string;
}

export interface NotifyCustomerRequest {
  conditionLogId: number;
  customerId: number;
  message: string;
  estimatedResolutionTime: string;
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

const equipmentService = {
  // Log a new equipment failure
  logEquipmentFailure: async (
    failureData: EquipmentFailureDto
  ): Promise<ConditionLog> => {
    const response = await axiosClient.post<ApiResponse<ConditionLog>>(
      `${API_URL}/failures`,
      failureData
    );
    return response.data.data;
  },

  // Update resolution timeline
  updateResolutionTimeline: async (
    id: number,
    data: UpdateResolutionTimelineRequest
  ): Promise<ConditionLog> => {
    const response = await axiosClient.put<ApiResponse<ConditionLog>>(
      `${API_URL}/failures/${id}/timeline`,
      data
    );
    return response.data.data;
  },

  // Get a specific condition log
  getConditionLog: async (id: number): Promise<ConditionLog> => {
    const response = await axiosClient.get<ApiResponse<ConditionLog>>(
      `${API_URL}/failures/${id}`
    );
    return response.data.data;
  },

  // Get all active condition logs
  getActiveConditionLogs: async (): Promise<ConditionLog[]> => {
    const response = await axiosClient.get<ApiResponse<ConditionLog[]>>(
      `${API_URL}/failures/active`
    );
    return response.data.data;
  },

  // Get condition logs by status
  getConditionLogsByStatus: async (
    status: MaintenanceStatus
  ): Promise<ConditionLog[]> => {
    const response = await axiosClient.get<ApiResponse<ConditionLog[]>>(
      `${API_URL}/failures/status/${status}`
    );
    return response.data.data;
  },

  // Assign staff to resolution
  assignStaffToResolution: async (
    id: number,
    staffId: number
  ): Promise<boolean> => {
    const response = await axiosClient.post<ApiResponse<boolean>>(
      `${API_URL}/failures/${id}/assign`,
      { staffId }
    );
    return response.data.data;
  },

  // Mark equipment as resolved
  markAsResolved: async (
    id: number,
    resolutionNotes: string
  ): Promise<boolean> => {
    const response = await axiosClient.post<ApiResponse<boolean>>(
      `${API_URL}/failures/${id}/resolve`,
      { resolutionNotes }
    );
    return response.data.data;
  },

  // Notify customer directly
  notifyCustomerDirectly: async (
    data: NotifyCustomerRequest
  ): Promise<boolean> => {
    const response = await axiosClient.post<ApiResponse<boolean>>(
      `${API_URL}/failures/notify-customer`,
      data
    );
    return response.data.data;
  },
};

export default equipmentService;

// Define the API response interface
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
