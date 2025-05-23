/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/Services/vehicleService.ts
import axiosClient from "../axiosInstance";
import {
  VehicleDTO,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  UpdateVehicleStatusRequest,
  VehicleQueryParams,
  PagedResult,
} from "../../types/vehicle";
import { VehicleType } from "../../types/orderManagement";

const API_URL = "/manager/vehicles";

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

const vehicleService = {
  // Get all vehicles with pagination, sorting, and filtering
  getAllVehicles: async (
    params: VehicleQueryParams = {}
  ): Promise<PagedResult<VehicleDTO>> => {
    try {
      const queryParams = new URLSearchParams();
      if (params.pageNumber)
        queryParams.append("pageNumber", params.pageNumber.toString());
      if (params.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortDescending !== undefined)
        queryParams.append("sortDescending", params.sortDescending.toString());
      if (params.searchTerm)
        queryParams.append("searchTerm", params.searchTerm);
      if (params.type !== undefined)
        queryParams.append("type", params.type.toString());
      if (params.status !== undefined)
        queryParams.append("status", params.status.toString());

      const url = `${API_URL}?${queryParams.toString()}`;
      const response = await axiosClient.get<any, any>(url); // response is the full server JSON

      // Corrected data extraction:
      const pagedResult = response.data; // response.data is the object { items: [...], totalCount: ... }

      return {
        items: pagedResult?.items || [],
        totalCount: pagedResult?.totalCount || 0,
        pageNumber: pagedResult?.pageNumber || 1,
        pageSize: pagedResult?.pageSize || 10,
      };
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      return {
        items: [],
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10,
      };
    }
  },

  // Get vehicle by ID
  getVehicleById: async (id: number): Promise<VehicleDTO | null> => {
    try {
      const response = await axiosClient.get<any, ApiResponse<VehicleDTO>>(
        `${API_URL}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching vehicle with ID ${id}:`, error);
      return null;
    }
  },

  // Create a new vehicle
  createVehicle: async (
    vehicle: CreateVehicleRequest
  ): Promise<VehicleDTO | null> => {
    try {
      const response = await axiosClient.post<any, ApiResponse<VehicleDTO>>(
        API_URL,
        vehicle
      );
      return response.data;
    } catch (error) {
      console.error("Error creating vehicle:", error);
      return null;
    }
  },

  // Update an existing vehicle
  updateVehicle: async (
    id: number,
    vehicle: UpdateVehicleRequest
  ): Promise<VehicleDTO | null> => {
    try {
      const response = await axiosClient.put<any, ApiResponse<VehicleDTO>>(
        `${API_URL}/${id}`,
        vehicle
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating vehicle with ID ${id}:`, error);
      return null;
    }
  },

  // Delete a vehicle
  deleteVehicle: async (id: number): Promise<boolean> => {
    try {
      const response = await axiosClient.delete<any, ApiResponse<boolean>>(
        `${API_URL}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting vehicle with ID ${id}:`, error);
      return false;
    }
  },

  // Update vehicle status
  updateVehicleStatus: async (
    id: number,
    status: UpdateVehicleStatusRequest
  ): Promise<VehicleDTO | null> => {
    try {
      const response = await axiosClient.put<any, ApiResponse<VehicleDTO>>(
        `${API_URL}/${id}/status`,
        status
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating status for vehicle with ID ${id}:`, error);
      return null;
    }
  },

  // Get available vehicles
  getAvailableVehicles: async (type?: VehicleType): Promise<VehicleDTO[]> => {
    try {
      const queryParams = type !== undefined ? `?type=${type}` : "";
      const response = await axiosClient.get<any, ApiResponse<VehicleDTO[]>>(
        `${API_URL}/available${queryParams}`
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching available vehicles:", error);
      return [];
    }
  },
};

export default vehicleService;
