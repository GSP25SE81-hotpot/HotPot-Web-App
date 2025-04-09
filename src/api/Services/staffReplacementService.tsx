/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/staffReplacementService.ts
import {
  ApiResponse,
  CompleteReplacementDto,
  ReplacementRequestDetailDto,
  ReplacementRequestSummaryDto,
  UpdateReplacementStatusDto,
  VerifyEquipmentFaultyDto,
} from "../../types/pickupReplacement";
import axiosClient from "../axiosInstance";

class StaffReplacementService {
  private baseUrl = "staff/replacement";

  /**
   * Get all replacement requests assigned to the current staff
   */
  async getAssignedReplacements(): Promise<
    ApiResponse<ReplacementRequestSummaryDto[]>
  > {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ReplacementRequestSummaryDto[]>
      >(this.baseUrl);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get details of a specific replacement request
   */
  async getReplacementRequestById(
    id: number
  ): Promise<ApiResponse<ReplacementRequestDetailDto>> {
    try {
      const response = await axiosClient.get<
        any,
        ApiResponse<ReplacementRequestDetailDto>
      >(`${this.baseUrl}/${id}`);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update the status of a replacement request
   */
  async updateReplacementStatus(
    id: number,
    data: UpdateReplacementStatusDto
  ): Promise<ApiResponse<ReplacementRequestDetailDto>> {
    try {
      const response = await axiosClient.put<
        any,
        ApiResponse<ReplacementRequestDetailDto>
      >(`${this.baseUrl}/${id}/status`, data);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Mark a replacement request as completed
   */
  async completeReplacement(
    id: number,
    data: CompleteReplacementDto
  ): Promise<ApiResponse<ReplacementRequestDetailDto>> {
    try {
      console.log(
        `Completing replacement ${id} with notes:`,
        data.completionNotes
      );

      const response = await axiosClient.put<
        any,
        ApiResponse<ReplacementRequestDetailDto>
      >(`${this.baseUrl}/${id}/complete`, data);

      console.log("Complete replacement API response:", response);

      // Make sure we're returning response.data, not the entire response
      return response;
    } catch (error) {
      console.error("Error completing replacement:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify if equipment is faulty
   */
  async verifyEquipmentFaulty(
    id: number,
    data: VerifyEquipmentFaultyDto
  ): Promise<ApiResponse<ReplacementRequestDetailDto>> {
    try {
      console.log(`Verifying equipment for replacement ${id} with data:`, data);

      const response = await axiosClient.post<
        any,
        ApiResponse<ReplacementRequestDetailDto>
      >(`${this.baseUrl}/${id}/verify`, data);

      console.log("Verify equipment API response:", response);

      return response;
    } catch (error) {
      console.error("Error verifying equipment:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle errors from API calls
   */
  private handleError(error: any): Error {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorResponse = error.response.data as ApiResponse<any>;
      return new Error(
        errorResponse.message || "An error occurred with the API response"
      );
    } else if (error.request) {
      // The request was made but no response was received
      return new Error("No response received from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      return new Error("Error setting up the request: " + error.message);
    }
  }
}

export default new StaffReplacementService();
