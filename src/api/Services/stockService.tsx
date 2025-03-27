// src/services/stockService.ts
import axiosClient from "../axiosInstance";
import {
  ApiResponse,
  HotPotInventoryDto,
  HotPotInventoryDetailDto,
  UtensilDto,
  UtensilDetailDto,
  EquipmentStatusDto,
  UpdateEquipmentStatusRequest,
  UpdateUtensilQuantityRequest,
  NotifyAdminStockRequest,
  EquipmentUnavailableResponse,
  EquipmentAvailableResponse,
  EquipmentDashboardResponse,
  HotpotStatus,
} from "../../types/stock";

const BASE_URL = "/manager/equipment-stock";

const stockService = {
  // HotPot Inventory Endpoints
  getAllHotPotInventory: async (): Promise<
    ApiResponse<HotPotInventoryDto[]>
  > => {
    try {
      const response = await axiosClient.get(`${BASE_URL}/hotpot`);
      // Handle both wrapped and unwrapped responses
      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          message: "Success",
          data: response.data,
          errors: null,
        };
      }
      return response.data; // if it's already wrapped
    } catch (error) {
      console.error("Error fetching hotpot inventory:", error);
      throw error;
    }
  },

  getHotPotInventoryById: async (
    id: number
  ): Promise<ApiResponse<HotPotInventoryDetailDto>> => {
    try {
      const response = await axiosClient.get<
        ApiResponse<HotPotInventoryDetailDto>
      >(`${BASE_URL}/hotpot/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching hotpot inventory with ID ${id}:`, error);
      throw error;
    }
  },

  getHotPotInventoryByHotpotId: async (
    hotpotId: number
  ): Promise<HotPotInventoryDto[]> => {
    try {
      const response = await axiosClient.get<ApiResponse<HotPotInventoryDto[]>>(
        `${BASE_URL}/hotpot/type/${hotpotId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error fetching hotpot inventory by hotpot ID ${hotpotId}:`,
        error
      );
      throw error;
    }
  },

  updateHotPotInventoryStatus: async (
    id: number,
    status: HotpotStatus,
    reason: string
  ): Promise<HotPotInventoryDetailDto> => {
    try {
      const request: UpdateEquipmentStatusRequest = {
        hotpotStatus: status,
        reason,
      };

      const response = await axiosClient.put<
        ApiResponse<HotPotInventoryDetailDto>
      >(`${BASE_URL}/hotpot/${id}/status`, request);
      return response.data.data;
    } catch (error) {
      console.error(
        `Error updating hotpot inventory status for ID ${id}:`,
        error
      );
      throw error;
    }
  },

  // Utensil Endpoints
  getAllUtensils: async (): Promise<ApiResponse<UtensilDto[]>> => {
    try {
      const response = await axiosClient.get(`${BASE_URL}/utensil`);
      // Handle both wrapped and unwrapped responses
      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          message: "Success",
          data: response.data,
          errors: null,
        };
      }
      return response.data; // if it's already wrapped
    } catch (error) {
      console.error("Error fetching utensils:", error);
      throw error;
    }
  },

  getUtensilById: async (
    id: number
  ): Promise<ApiResponse<UtensilDetailDto[]>> => {
    try {
      const response = await axiosClient.get(`${BASE_URL}/utensil/${id}`);
      if (response.data && Array.isArray(response.data)) {
        return {
          success: true,
          message: "Success",
          data: response.data,
          errors: null,
        };
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching utensil with ID ${id}:`, error);
      throw error;
    }
  },

  getUtensilsByType: async (typeId: number): Promise<UtensilDto[]> => {
    try {
      const response = await axiosClient.get<ApiResponse<UtensilDto[]>>(
        `${BASE_URL}/utensil/type/${typeId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching utensils by type ID ${typeId}:`, error);
      throw error;
    }
  },

  updateUtensilQuantity: async (
    id: number,
    quantity: number
  ): Promise<UtensilDetailDto> => {
    try {
      const request: UpdateUtensilQuantityRequest = { quantity };

      const response = await axiosClient.put<ApiResponse<UtensilDetailDto>>(
        `${BASE_URL}/utensil/${id}/quantity`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating utensil quantity for ID ${id}:`, error);
      throw error;
    }
  },

  updateUtensilStatus: async (
    id: number,
    isAvailable: boolean,
    reason: string
  ): Promise<UtensilDetailDto> => {
    try {
      const request: UpdateEquipmentStatusRequest = {
        isAvailable,
        reason,
      };

      const response = await axiosClient.put<ApiResponse<UtensilDetailDto>>(
        `${BASE_URL}/utensil/${id}/status`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating utensil status for ID ${id}:`, error);
      throw error;
    }
  },

  // Stock Status Endpoints
  getLowStockUtensils: async (threshold = 5): Promise<UtensilDto[]> => {
    try {
      const response = await axiosClient.get<ApiResponse<UtensilDto[]>>(
        `${BASE_URL}/low-stock`,
        {
          params: { threshold },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching low stock utensils:", error);
      throw error;
    }
  },

  getEquipmentStatusSummary: async (): Promise<EquipmentStatusDto[]> => {
    try {
      const response = await axiosClient.get<ApiResponse<EquipmentStatusDto[]>>(
        `${BASE_URL}/status-summary`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching equipment status summary:", error);
      throw error;
    }
  },

  notifyAdminDirectly: async (
    request: NotifyAdminStockRequest
  ): Promise<boolean> => {
    try {
      const response = await axiosClient.post<ApiResponse<boolean>>(
        `${BASE_URL}/notify-admin`,
        request
      );
      return response.data.data;
    } catch (error) {
      console.error("Error notifying admin:", error);
      throw error;
    }
  },

  getUnavailableEquipment: async (): Promise<EquipmentUnavailableResponse> => {
    try {
      const response = await axiosClient.get<
        ApiResponse<EquipmentUnavailableResponse>
      >(`${BASE_URL}/unavailable`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching unavailable equipment:", error);
      throw error;
    }
  },

  getAvailableEquipment: async (): Promise<EquipmentAvailableResponse> => {
    try {
      const response = await axiosClient.get<
        ApiResponse<EquipmentAvailableResponse>
      >(`${BASE_URL}/available`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching available equipment:", error);
      throw error;
    }
  },

  getEquipmentDashboard: async (): Promise<EquipmentDashboardResponse> => {
    try {
      const response = await axiosClient.get<
        ApiResponse<EquipmentDashboardResponse>
      >(`${BASE_URL}/dashboard`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching equipment dashboard data:", error);
      throw error;
    }
  },
};

export default stockService;
