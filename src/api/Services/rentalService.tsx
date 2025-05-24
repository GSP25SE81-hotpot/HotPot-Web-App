/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/rentalService.ts
import {
  ApiResponse,
  PagedResult,
  RentOrderDetailResponse,
  StaffPickupAssignmentDto,
  PickupAssignmentRequestDto,
} from "../../types/rentalTypes";
import axiosClient from "../axiosInstance";

const API_URL = "/manager/rentals";

// Get unassigned pickups
export const getUnassignedPickups = async (
  pageNumber = 1,
  pageSize = 10
): Promise<ApiResponse<PagedResult<RentOrderDetailResponse>>> => {
  try {
    const response = await axiosClient.get<
      any,
      ApiResponse<PagedResult<RentOrderDetailResponse>>
    >(
      `${API_URL}/unassigned-pickups?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching unassigned pickups:", error);
    throw error;
  }
};

// Allocate staff for pickup
export const allocateStaffForPickup = async (
  request: PickupAssignmentRequestDto
): Promise<ApiResponse<StaffPickupAssignmentDto>> => {
  try {
    const response = await axiosClient.post(
      `${API_URL}/allocate-pickup`,
      request
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    console.error("Error allocating staff for pickup:", error);
    throw error;
  }
};

// Get current assignments
export const getCurrentAssignments = async (
  pageNumber: number = 1,
  pageSize: number = 10
): Promise<ApiResponse<PagedResult<StaffPickupAssignmentDto>>> => {
  try {
    const response = await axiosClient.get<
      any,
      ApiResponse<PagedResult<StaffPickupAssignmentDto>>
    >(
      `${API_URL}/current-assignments?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    return response;
  } catch (error) {
    console.error("Error in getCurrentAssignments:", error);
    throw error;
  }
};
