// src/services/api.ts
// import { axiosClient } from "../axiosInstance"; // Import your axios instance
import {
  ApiResponse,
  PagedResult,
  RentalListing,
  RentOrderDetail,
  StaffPickupAssignment,
  UnifiedReturnRequest,
} from "../../types/rentalPickup";
import axiosClient from "../axiosInstance";

export const rentalService = {
  // Get staff assignments
  getMyAssignments: async (
    pendingOnly: boolean = false
  ): Promise<ApiResponse<StaffPickupAssignment[]>> => {
    const response = await axiosClient.get(
      `/staff/rentals/my-assignments?pendingOnly=${pendingOnly}`
    );
    return response.data;
  },

  // Get all pending pickups
  getPendingPickups: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResult<RentalListing>> => {
    const response = await axiosClient.get(
      `/staff/rentals/all-pending-pickups?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get overdue rentals
  getOverdueRentals: async (
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResult<RentalListing>> => {
    const response = await axiosClient.get(
      `/staff/rentals/overdue?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get rental detail
  getRentalDetail: async (id: number): Promise<RentOrderDetail> => {
    const response = await axiosClient.get(`/staff/rentals/${id}`);
    return response.data;
  },

  // Record return
  recordReturn: async (
    returnData: UnifiedReturnRequest
  ): Promise<ApiResponse<boolean>> => {
    const response = await axiosClient.post(
      `/staff/rentals/record-return`,
      returnData
    );
    return response.data;
  },
};
