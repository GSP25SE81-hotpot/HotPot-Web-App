// src/api/services/replacementService.ts
// import { axiosClient } from "../axiosInstance";
import {
  ApiResponse,
  AssignStaffDto,
  CompleteReplacementDto,
  ReplacementRequestDetailDto,
  ReplacementRequestSummaryDto,
  ReviewReplacementRequestDto,
  ReplacementRequestStatus,
} from "../../types/replacement";
import axiosClient from "../axiosInstance";

const replacementService = {
  getAllReplacements: async (): Promise<ReplacementRequestSummaryDto[]> => {
    const response = await axiosClient.get<
      ApiResponse<ReplacementRequestSummaryDto[]>
    >("/manager/replacement/all");
    return response.data.data;
  },

  getReplacementsByStatus: async (
    status: ReplacementRequestStatus
  ): Promise<ReplacementRequestSummaryDto[]> => {
    const response = await axiosClient.get<
      ApiResponse<ReplacementRequestSummaryDto[]>
    >(`/manager/replacement/status/${status}`);
    return response.data.data;
  },

  getReplacementById: async (
    id: number
  ): Promise<ApiResponse<ReplacementRequestDetailDto>> => {
    const response = await axiosClient.get<
      any,
      ApiResponse<ReplacementRequestDetailDto>
    >(`/manager/replacement/id/${id}`);
    return response;
  },

  reviewReplacement: async (
    id: number,
    data: ReviewReplacementRequestDto
  ): Promise<ReplacementRequestDetailDto> => {
    const response = await axiosClient.put<
      any,
      ApiResponse<ReplacementRequestDetailDto>
    >(`/manager/replacement/${id}/review`, data);
    return response.data;
  },
  assignStaff: async (
    id: number,
    data: AssignStaffDto
  ): Promise<ReplacementRequestDetailDto[]> => {
    const response = await axiosClient.put<
      any,
      ApiResponse<ReplacementRequestDetailDto[]>
    >(`/manager/replacement/${id}/assign-staff`, data);
    return response.data;
  },

  completeReplacement: async (
    id: number,
    data: CompleteReplacementDto
  ): Promise<ReplacementRequestDetailDto> => {
    const response = await axiosClient.put<
      ApiResponse<ReplacementRequestDetailDto>
    >(`/manager/replacement/${id}/mark-complete`, data);
    return response.data.data;
  },
};

export default replacementService;
