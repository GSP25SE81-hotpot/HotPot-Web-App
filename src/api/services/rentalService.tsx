// src/services/rentalService.ts
import {
  ApiResponse,
  PagedResult,
  RentOrderDetail,
  StaffPickupAssignmentDto,
  PickupAssignmentRequestDto,
  UpdateRentOrderDetailRequest,
  RentalHistoryItem,
  Staff,
} from "../../types/rentalTypes";
import { axiosPrivate } from "../axiosInstance"; // Import the authenticated axios instance

const API_URL = "/manager/rentals";

// Get unassigned pickups
export const getUnassignedPickups = async (
  pageNumber = 1,
  pageSize = 10
): Promise<PagedResult<RentOrderDetail>> => {
  try {
    const response = await axiosPrivate.get<
      ApiResponse<PagedResult<RentOrderDetail>>
    >(
      `${API_URL}/unassigned-pickups?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data!;
  } catch (error) {
    console.error("Error fetching unassigned pickups:", error);
    throw error;
  }
};

// Allocate staff for pickup
export const allocateStaffForPickup = async (
  request: PickupAssignmentRequestDto
): Promise<StaffPickupAssignmentDto> => {
  try {
    const response = await axiosPrivate.post<
      ApiResponse<StaffPickupAssignmentDto>
    >(`${API_URL}/allocate-pickup`, request);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data!;
  } catch (error) {
    console.error("Error allocating staff for pickup:", error);
    throw error;
  }
};

// Get rental history by utensil
export const getRentalHistoryByUtensil = async (
  utensilId: number
): Promise<RentalHistoryItem[]> => {
  try {
    const response = await axiosPrivate.get<RentalHistoryItem[]>(
      `${API_URL}/equipment/${utensilId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching rental history by utensil:", error);
    throw error;
  }
};

// Get rental history by hotpot
export const getRentalHistoryByHotpot = async (
  hotpotInventoryId: number
): Promise<RentalHistoryItem[]> => {
  try {
    const response = await axiosPrivate.get<RentalHistoryItem[]>(
      `${API_URL}/hotpot/${hotpotInventoryId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching rental history by hotpot:", error);
    throw error;
  }
};

// Get rental history by user
export const getRentalHistoryByUser = async (
  userId: number
): Promise<RentalHistoryItem[]> => {
  try {
    const response = await axiosPrivate.get<RentalHistoryItem[]>(
      `${API_URL}/user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching rental history by user:", error);
    throw error;
  }
};

// Adjust return date for exception
export const adjustReturnDateForException = async (
  id: number,
  request: UpdateRentOrderDetailRequest
): Promise<void> => {
  try {
    await axiosPrivate.put(`${API_URL}/${id}`, request);
  } catch (error) {
    console.error("Error adjusting return date:", error);
    throw error;
  }
};

// Calculate late fee
export const calculateLateFee = async (
  id: number,
  actualReturnDate: string
): Promise<number> => {
  try {
    const response = await axiosPrivate.get(
      `${API_URL}/${id}/calculate-late-fee?actualReturnDate=${actualReturnDate}`
    );
    return response.data.lateFee;
  } catch (error) {
    console.error("Error calculating late fee:", error);
    throw error;
  }
};

// Get current assignments
export const getCurrentAssignments = async (
  pageNumber = 1,
  pageSize = 10
): Promise<PagedResult<StaffPickupAssignmentDto>> => {
  try {
    const response = await axiosPrivate.get<
      ApiResponse<PagedResult<StaffPickupAssignmentDto>>
    >(
      `${API_URL}/current-assignments?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data!;
  } catch (error) {
    console.error("Error fetching current assignments:", error);
    throw error;
  }
};

// Get available staff (this would be from a different controller)
export const getAvailableStaff = async (): Promise<Staff[]> => {
  try {
    const response = await axiosPrivate.get<ApiResponse<Staff[]>>(
      "/api/manager/staff/available"
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data!;
  } catch (error) {
    console.error("Error fetching available staff:", error);
    throw error;
  }
};
