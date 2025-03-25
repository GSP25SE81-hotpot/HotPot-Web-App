// src/api/services/replacementService.ts
// import { axiosClient } from "../axiosInstance";
import {
  ApiResponse,
  AssignStaffDto,
  CompleteReplacementDto,
  ReplacementRequestDetailDto,
  ReplacementRequestSummaryDto,
  ReviewReplacementRequestDto,
} from "../../types/replacement";
import axiosClient from "../axiosInstance";

const replacementService = {
  getAllReplacements: async (): Promise<ReplacementRequestSummaryDto[]> => {
    const response = await axiosClient.get<
      ApiResponse<ReplacementRequestSummaryDto[]>
    >("/manager/replacement");
    return response.data.data;
  },

  getReplacementsByStatus: async (
    status: string
  ): Promise<ReplacementRequestSummaryDto[]> => {
    const response = await axiosClient.get<
      ApiResponse<ReplacementRequestSummaryDto[]>
    >(`/manager/replacement/status/${status}`);
    return response.data.data;
  },

  getReplacementById: async (
    id: number
  ): Promise<ReplacementRequestDetailDto> => {
    const response = await axiosClient.get<
      ApiResponse<ReplacementRequestDetailDto>
    >(`/manager/replacement/${id}`);
    return response.data.data;
  },

  reviewReplacement: async (
    id: number,
    data: ReviewReplacementRequestDto
  ): Promise<ReplacementRequestDetailDto> => {
    const response = await axiosClient.put<
      ApiResponse<ReplacementRequestDetailDto>
    >(`/manager/replacement/${id}/review`, data);
    return response.data.data;
  },

  assignStaff: async (
    id: number,
    data: AssignStaffDto
  ): Promise<ReplacementRequestDetailDto> => {
    const response = await axiosClient.put<
      ApiResponse<ReplacementRequestDetailDto>
    >(`/manager/replacement/${id}/assign`, data);
    return response.data.data;
  },

  completeReplacement: async (
    id: number,
    data: CompleteReplacementDto
  ): Promise<ReplacementRequestDetailDto> => {
    const response = await axiosClient.put<
      ApiResponse<ReplacementRequestDetailDto>
    >(`/manager/replacement/${id}/complete`, data);
    return response.data.data;
  },
};

export default replacementService;
