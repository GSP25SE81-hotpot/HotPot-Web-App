/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/services/replacementService.ts
import {
  ApiResponse,
  AssignStaffDto,
  NotifyCustomerRequest,
  ReplacementDashboardDto,
  ReplacementRequestDetailDto,
  ReplacementRequestSummaryDto,
  ReviewReplacementRequestDto,
} from "../../types/replacement";
import axiosClient from "../axiosInstance";

const replacementService = {
  // Get all replacement requests
  getAllReplacements: async (): Promise<ReplacementRequestSummaryDto[]> => {
    const response = await axiosClient.get<
      any,
      ApiResponse<ReplacementRequestSummaryDto[]>
    >("/manager/replacement/all");
    return response.data;
  },

  // Get replacement requests by status
  getReplacementsByStatus: async (
    status: string
  ): Promise<ReplacementRequestSummaryDto[]> => {
    const response = await axiosClient.get<
      any,
      ApiResponse<ReplacementRequestSummaryDto[]>
    >(`/manager/replacement/status/${status}`);
    return response.data;
  },

  // Get replacement request by ID
  getReplacementById: async (
    id: number
  ): Promise<ReplacementRequestDetailDto> => {
    const response = await axiosClient.get<
      any,
      ApiResponse<ReplacementRequestDetailDto[]>
    >(`/manager/replacement/id/${id}`);
    // Assuming the API returns an array but we want the first item
    return response.data[0];
  },

  // Review a replacement request (approve/reject)
  reviewReplacement: async (
    id: number,
    data: ReviewReplacementRequestDto
  ): Promise<ReplacementRequestDetailDto> => {
    const response = await axiosClient.put<
      any,
      ApiResponse<ReplacementRequestDetailDto[]>
    >(`/manager/replacement/${id}/review`, data);
    return response.data[0];
  },

  // Assign staff to a replacement request
  assignStaff: async (
    id: number,
    data: AssignStaffDto
  ): Promise<ReplacementRequestDetailDto> => {
    const response = await axiosClient.put<
      any,
      ApiResponse<ReplacementRequestDetailDto[]>
    >(`/manager/replacement/${id}/assign-staff`, data);
    return response.data[0];
  },

  // Get dashboard data for replacements
  getDashboard: async (): Promise<ReplacementDashboardDto[]> => {
    const response = await axiosClient.get<
      any,
      ApiResponse<ReplacementDashboardDto[]>
    >(`/manager/replacement/dashboard`);
    return response.data;
  },

  // Notify customer directly
  notifyCustomer: async (data: NotifyCustomerRequest): Promise<boolean> => {
    const response = await axiosClient.post<any, ApiResponse<boolean>>(
      `/manager/replacement/notify-customer`,
      data
    );
    return response.data;
  },
};

export default replacementService;
