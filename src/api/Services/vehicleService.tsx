/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/Services/vehicleService.ts
import axiosClient from "../axiosInstance";
import { VehicleDTO } from "../../types/vehicle";

const API_URL = "/manager/vehicles";

const vehicleService = {
  getAvailableVehicles: async (): Promise<VehicleDTO[]> => {
    try {
      const response = await axiosClient.get<any>(`${API_URL}/available`);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching available vehicles:", error);
      return [];
    }
  },
};

export default vehicleService;
