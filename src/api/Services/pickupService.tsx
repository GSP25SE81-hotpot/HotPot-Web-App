/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api.ts
import {
  ApiResponse,
  PagedResult,
  StaffPickupAssignment,
  UnifiedReturnRequest,
} from "../../types/rentalPickup";
import axiosClient from "../axiosInstance";

export const rentalService = {
  // Get staff assignments
  getMyAssignments: async (
    pendingOnly: boolean = false,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PagedResult<StaffPickupAssignment>>> => {
    const response = await axiosClient.get<
      any,
      ApiResponse<PagedResult<StaffPickupAssignment>>
    >(
      `/staff/rentals/my-assignments?pendingOnly=${pendingOnly}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response;
  },

  // Record return
  recordReturn: async (
    returnData: UnifiedReturnRequest
  ): Promise<ApiResponse<boolean>> => {
    const response = await axiosClient.post<any, ApiResponse<boolean>>(
      `/staff/rentals/record-return`,
      returnData
    );
    return response;
  },
};
