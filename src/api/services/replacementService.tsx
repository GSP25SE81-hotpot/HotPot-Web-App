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
  getAllReplacements: async (): Promise<
    ApiResponse<ReplacementRequestSummaryDto[]>
  > => {
    const response = await axiosClient.get<
      any,
      ApiResponse<ReplacementRequestSummaryDto[]>
    >("/manager/replacement/all");
    return response;
  },

  // Get replacement requests by status
  getReplacementsByStatus: async (
    status: string
  ): Promise<ApiResponse<ReplacementRequestSummaryDto[]>> => {
    const response = await axiosClient.get<
      any,
      ApiResponse<ReplacementRequestSummaryDto[]>
    >(`/manager/replacement/status/${status}`);
    return response;
  },

  // Get replacement request by ID
  getReplacementById: async (
    id: number
  ): Promise<ApiResponse<ReplacementRequestDetailDto[]>> => {
    const response = await axiosClient.get<
      any,
      ApiResponse<ReplacementRequestDetailDto[]>
    >(`/manager/replacement/id/${id}`);
    return response;
  },

  // Review a replacement request (approve/reject)
  reviewReplacement: async (
    id: number,
    data: ReviewReplacementRequestDto
  ): Promise<ApiResponse<ReplacementRequestDetailDto[]>> => {
    const response = await axiosClient.put<
      any,
      ApiResponse<ReplacementRequestDetailDto[]>
    >(`/manager/replacement/${id}/review`, data);
    return response;
  },

  // Assign staff to a replacement request
  assignStaff: async (
    id: number,
    data: AssignStaffDto
  ): Promise<ApiResponse<ReplacementRequestDetailDto[]>> => {
    const response = await axiosClient.put<
      any,
      ApiResponse<ReplacementRequestDetailDto[]>
    >(`/manager/replacement/${id}/assign-staff`, data);
    return response;
  },

  // Get dashboard data for replacements
  getDashboard: async (): Promise<ApiResponse<ReplacementDashboardDto[]>> => {
    const response = await axiosClient.get<
      any,
      ApiResponse<ReplacementDashboardDto[]>
    >(`/manager/replacement/dashboard`);
    return response;
  },

  // Notify customer directly
  notifyCustomer: async (
    data: NotifyCustomerRequest
  ): Promise<ApiResponse<boolean>> => {
    const response = await axiosClient.post<any, ApiResponse<boolean>>(
      `/manager/replacement/notify-customer`,
      data
    );
    return response;
  },
};

export default replacementService;
