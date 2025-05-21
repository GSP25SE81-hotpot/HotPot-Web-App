/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api.ts
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

  // Get rental listings (pending or overdue)
  getRentalListings: async (
    type: "pending" | "overdue" = "pending",
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PagedResult<RentalListing>> => {
    const response = await axiosClient.get<any, PagedResult<RentalListing>>(
      `/staff/rentals/listings?type=${type}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response;
  },

  // Get rent order detail
  getRentOrder: async (id: number): Promise<RentOrderDetail> => {
    const response = await axiosClient.get<any, RentOrderDetail>(
      `/staff/rentals/order/${id}`
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
