/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiResponse } from "../../types/replacement";
import { StaffAvailabilityDto, StaffDto } from "../../types/staff";
import axiosClient from "../axiosInstance";

const staffService = {
  /**
   * Get all staff members
   * @throws {Error} When request fails or unauthorized
   */
  getAllStaff: async (): Promise<StaffDto[]> => {
    try {
      const response = await axiosClient.get<ApiResponse<StaffDto[]>>(
        "/staff/all"
      );
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch staff members"
        );
      }
      return response.data.data;
    } catch (error: any) {
      console.error("Error fetching staff members:", error);
      throw new Error(
        error.response?.data?.message ||
          "You don't have permission to view staff members or the service is unavailable"
      );
    }
  },

  /**
   * Get staff member by ID
   * @throws {Error} When request fails or unauthorized
   */
  getStaffById: async (id: number): Promise<StaffDto> => {
    try {
      const response = await axiosClient.get<ApiResponse<StaffDto>>(
        `/staff/${id}`
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Staff member not found");
      }
      return response.data.data;
    } catch (error: any) {
      console.error(`Error fetching staff member ${id}:`, error);
      throw new Error(
        error.response?.data?.message ||
          `You don't have permission to view this staff member or the service is unavailable`
      );
    }
  },

  /**
   * Get available staff members
   * @throws {Error} When request fails or unauthorized
   */
  getAvailableStaff: async (): Promise<StaffAvailabilityDto[]> => {
    try {
      // Add a timeout to the request to prevent hanging
      const response = await axiosClient.get<
        ApiResponse<StaffAvailabilityDto[]>
      >(
        "/staff/available",
        { timeout: 10000 } // 10 second timeout
      );

      // Log the full response for debugging
      // console.log("Staff API response:", response);

      // Check if the response has the expected structure
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (
        response &&
        response.data &&
        Array.isArray(response.data.data)
      ) {
        return response.data.data;
      } else {
        // console.warn("Unexpected staff API response structure:", response);
        // Return empty array as fallback
        return [];
      }
    } catch (error: any) {
      // console.error("Error fetching available staff:", error);

      // If this is an authentication error, we might want to refresh the token
      if (error.response && error.response.status === 401) {
        // You could implement token refresh logic here
        // console.warn(
        //   "Authentication error when fetching staff. Token may need refresh."
        // );
      }

      // Return empty array instead of throwing to prevent UI errors
      return [];
    }
  },
};

export default staffService;
