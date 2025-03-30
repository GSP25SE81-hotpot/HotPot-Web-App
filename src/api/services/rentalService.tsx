// src/services/rentalService.ts
import {
  ApiResponse,
  PagedResult,
  RentOrderDetail,
  StaffPickupAssignmentDto,
  PickupAssignmentRequestDto,
  UpdateRentOrderDetailRequest,
  RentalHistoryItem,
} from "../../types/rentalTypes";
import axiosClient from "../axiosInstance";

const API_URL = "/manager/rentals";

// Get unassigned pickups
export const getUnassignedPickups = async (
  pageNumber = 1,
  pageSize = 10
): Promise<ApiResponse<PagedResult<RentOrderDetail[]>>> => {
  try {
    const response = await axiosClient.get(
      `${API_URL}/unassigned-pickups?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );

    if (response.data && Array.isArray(response.data)) {
      return {
        success: true,
        message: "Success",
      };
    }

    return response.data;
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
    const response = await axiosClient.post<
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
    const response = await axiosClient.get<RentalHistoryItem[]>(
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
    const response = await axiosClient.get<RentalHistoryItem[]>(
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
    const response = await axiosClient.get<RentalHistoryItem[]>(
      `${API_URL}/user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching rental history by user:", error);
    throw error;
  }
};
export const getAllRentalHistory = async (): Promise<RentalHistoryItem[]> => {
  try {
    const response = await axiosClient.get<RentalHistoryItem[]>(
      `${API_URL}/all`
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
    await axiosClient.put(`${API_URL}/${id}`, request);
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
    const response = await axiosClient.get(
      `${API_URL}/${id}/calculate-late-fee?actualReturnDate=${actualReturnDate}`
    );
    return response.data.lateFee;
  } catch (error) {
    console.error("Error calculating late fee:", error);
    throw error;
  }
};

// Get current assignments
export async function getCurrentAssignments(
  pageNumber = 1,
  pageSize = 10
): Promise<ApiResponse<PagedResult<StaffPickupAssignmentDto[]>>> {
  try {
    const response = await axiosClient.get(
      `${API_URL}/current-assignments?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    if (response.data && Array.isArray(response.data)) {
      return {
        success: true,
        message: "Success",
      };
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching current assignments:", error);
    throw error;
  }
}
