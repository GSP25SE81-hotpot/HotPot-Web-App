/* eslint-disable @typescript-eslint/no-explicit-any */
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
  getLowStockUtensils: async (
    threshold = 80
  ): Promise<ApiResponse<UtensilDto[]>> => {
    try {
      // Make the API request with proper typing
      const response = await axiosClient.get<ApiResponse<UtensilDto[]>>(
        `${BASE_URL}/low-stock`,
        { params: { threshold } }
      );

      // Debug the raw response
      console.log("Raw API response:", response);

      // Case 1: Response is already in correct ApiResponse format
      if (
        response.data &&
        typeof response.data.success === "boolean" &&
        "data" in response.data &&
        "message" in response.data
      ) {
        return response.data;
      }

      // Case 2: Response is just the array (without ApiResponse wrapper)
      if (Array.isArray(response.data)) {
        return {
          success: true,
          message: "Low stock utensils retrieved successfully",
          data: response.data,
          errors: null,
        };
      }

      // If we get here, the response format is unexpected
      console.error("Unexpected response format:", response.data);
      return {
        success: false,
        message: "Invalid server response format",
        data: [],
        errors: ["The server returned data in an unexpected format"],
      };
    } catch (error: any) {
      console.error("API request failed:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch low stock utensils",
        data: [],
        errors: [error.response?.data?.message || "Unknown error occurred"],
      };
    }
  },

  getEquipmentStatusSummary: async (): Promise<EquipmentStatusDto[]> => {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<EquipmentStatusDto[]>
      >(`${BASE_URL}/status-summary`);
      return response.data;
    } catch (error) {
      console.error("Error fetching equipment status summary:", error);
      throw error;
    }
  },

  notifyAdminDirectly: async (
    request: NotifyAdminStockRequest
  ): Promise<ApiResponse<boolean>> => {
    try {
      const response = await axiosClient.post<any, ApiResponse<boolean>>(
        `${BASE_URL}/notify-admin`,
        request
      );

      // If the response is already properly formatted
      if (response.data && typeof response.success === "boolean") {
        return response;
      }

      // Fallback for unwrapped responses
      return {
        success: true,
        message: "Success",
        data: true, // Assuming the operation was successful
        errors: null,
      };
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

  getEquipmentDashboard: async (): Promise<
    ApiResponse<EquipmentDashboardResponse>
  > => {
    try {
      const response = await axiosClient.get(`${BASE_URL}/dashboard`);

      // Case 1: Response is already properly formatted ApiResponse
      if (response.data && typeof response.data.success === "boolean") {
        return response.data;
      }

      // Case 2: Response is the raw dashboard data
      if (
        response.data &&
        typeof response.data.totalEquipmentCount === "number"
      ) {
        return {
          success: true,
          message: "Success",
          data: response.data,
          errors: null,
        };
      }

      // Handle invalid response format
      console.error("Invalid dashboard response format:", response.data);
      return {
        success: false,
        message: "Invalid dashboard data format",
        data: {
          statusSummary: [],
          lowStockUtensils: [],
          unavailableHotPots: [],
          unavailableUtensils: [],
          totalEquipmentCount: 0,
          totalAvailableCount: 0,
          totalUnavailableCount: 0,
          totalLowStockCount: 0,
        },
        errors: ["Received invalid dashboard data format from server"],
      };
    } catch (error) {
      console.error("Error fetching equipment dashboard:", error);
      return {
        success: false,
        message: "Failed to fetch dashboard data",
        data: {
          statusSummary: [],
          lowStockUtensils: [],
          unavailableHotPots: [],
          unavailableUtensils: [],
          totalEquipmentCount: 0,
          totalAvailableCount: 0,
          totalUnavailableCount: 0,
          totalLowStockCount: 0,
        },
        errors: [
          error instanceof Error ? error.message : "Unknown error occurred",
        ],
      };
    }
  },
};

export default stockService;
