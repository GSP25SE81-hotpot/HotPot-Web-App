/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";

// Base pagination parameters
export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

// Filter parameters for equipment condition
export interface EquipmentConditionFilterDto extends PaginationParams {
  equipmentType?: string;
  equipmentId?: number;
  equipmentName?: string;
  status?: MaintenanceStatus;
  sortBy?: string;
  sortDescending?: boolean;
}

// Response for paginated data
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

// Equipment condition list item (for tables/lists)
export interface EquipmentConditionListItemDto {
  damageDeviceId: number;
  name: string;
  status: MaintenanceStatus;
  loggedDate: string;
  equipmentType: string;
  equipmentName: string;
}

// Detailed equipment condition (for single item view)
export interface EquipmentConditionDetailDto
  extends EquipmentConditionListItemDto {
  description: string;
  updatedAt?: string;
  equipmentId: number;
  equipmentSerialNumber?: string;
  equipmentTypeName?: string;
  equipmentMaterial?: string;
  maintenanceNotes?: string;
}

// Request to create a new equipment condition
export interface CreateEquipmentConditionRequest {
  name: string;
  description?: string;
  status: MaintenanceStatus;
  hotPotInventoryId?: number;
  utensilId?: number;
  updateEquipmentStatus?: boolean;
}

// Request to update equipment condition status
export interface UpdateConditionStatusRequest {
  status: MaintenanceStatus;
}

// Request to notify administrators
export interface NotifyAdminRequest {
  conditionLogId: number;
  equipmentType: string;
  equipmentName: string;
  issueName: string;
  description: string;
  scheduleType: MaintenanceScheduleType;
}

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export enum MaintenanceStatus {
  Pending = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
}

export enum MaintenanceScheduleType {
  Regular = 1,
  Emergency = 2,
}

class EquipmentConditionService {
  private readonly baseUrl = "/manager/equipment-condition";

  // Create a new equipment condition log
  public async createConditionLog(
    request: CreateEquipmentConditionRequest
  ): Promise<ApiResponse<EquipmentConditionDetailDto>> {
    try {
      const response = await axiosClient.post<
        any,
        ApiResponse<EquipmentConditionDetailDto>
      >(`${this.baseUrl}`, request);
      return response;
    } catch (error) {
      console.error("Error creating condition log:", error);
      throw error;
    }
  }

  // Get a specific condition log by ID
  public async getConditionLogById(
    id: number
  ): Promise<ApiResponse<EquipmentConditionDetailDto>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<EquipmentConditionDetailDto>
      >(`${this.baseUrl}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching condition log with ID ${id}:`, error);
      throw error;
    }
  }

  // Get condition logs by equipment type and ID
  public async getConditionLogsByEquipment(
    type: string,
    id: number,
    params: PaginationParams
  ): Promise<ApiResponse<PagedResult<EquipmentConditionListItemDto>>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<PagedResult<EquipmentConditionListItemDto>>
      >(`${this.baseUrl}/by-equipment`, {
        params: {
          type,
          id,
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
        },
      });
      return response;
    } catch (error) {
      console.error(
        `Error fetching condition logs for ${type} with ID ${id}:`,
        error
      );
      throw error;
    }
  }

  // Get condition logs by status
  public async getConditionLogsByStatus(
    status: MaintenanceStatus,
    params: PaginationParams
  ): Promise<ApiResponse<PagedResult<EquipmentConditionListItemDto>>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<PagedResult<EquipmentConditionListItemDto>>
      >(`${this.baseUrl}/by-status/${status}`, {
        params: {
          pageNumber: params.pageNumber,
          pageSize: params.pageSize,
        },
      });
      return response;
    } catch (error) {
      console.error(
        `Error fetching condition logs with status ${status}:`,
        error
      );
      throw error;
    }
  }

  // Get filtered condition logs
  public async getFilteredConditionLogs(
    filterParams: EquipmentConditionFilterDto
  ): Promise<ApiResponse<PagedResult<EquipmentConditionListItemDto>>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<PagedResult<EquipmentConditionListItemDto>>
      >(`${this.baseUrl}/filter`, {
        params: filterParams,
      });
      return response;
    } catch (error) {
      console.error("Error fetching filtered condition logs:", error);
      throw error;
    }
  }

  // Update condition status
  public async updateConditionStatus(
    id: number,
    status: MaintenanceStatus
  ): Promise<ApiResponse<EquipmentConditionDetailDto>> {
    try {
      const request: UpdateConditionStatusRequest = { status };
      const response = await axiosClient.put<
        any,
        ApiResponse<EquipmentConditionDetailDto>
      >(`${this.baseUrl}/${id}/update-status`, request);
      return response;
    } catch (error) {
      console.error(
        `Error updating status for condition log with ID ${id}:`,
        error
      );
      throw error;
    }
  }

  // Notify administrators
  public async notifyAdministrators(
    request: NotifyAdminRequest
  ): Promise<ApiResponse<boolean>> {
    try {
      const response = await axiosClient.post<any, ApiResponse<boolean>>(
        `${this.baseUrl}/notify-administrators`,
        request
      );
      return response;
    } catch (error) {
      console.error("Error notifying administrators:", error);
      throw error;
    }
  }
}

// Create a singleton instance
const equipmentConditionService = new EquipmentConditionService();
export default equipmentConditionService;
