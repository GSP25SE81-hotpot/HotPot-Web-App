// src/api/services/replacementService.ts
import { axiosPrivate } from "../axiosInstance";
import {
  ApiResponse,
  AssignStaffDto,
  CompleteReplacementDto,
  ReplacementRequestDetailDto,
  ReplacementRequestSummaryDto,
  ReviewReplacementRequestDto,
} from "../../types/replacement";

const replacementService = {
  getAllReplacements: async (): Promise<ReplacementRequestSummaryDto[]> => {
    const response = await axiosPrivate.get<
      ApiResponse<ReplacementRequestSummaryDto[]>
    >("/managerreplacement");
    return response.data.data;
  },

  getReplacementsByStatus: async (
    status: string
  ): Promise<ReplacementRequestSummaryDto[]> => {
    const response = await axiosPrivate.get<
      ApiResponse<ReplacementRequestSummaryDto[]>
    >(`/managerreplacement/status/${status}`);
    return response.data.data;
  },

  getReplacementById: async (
    id: number
  ): Promise<ReplacementRequestDetailDto> => {
    const response = await axiosPrivate.get<
      ApiResponse<ReplacementRequestDetailDto>
    >(`/managerreplacement/${id}`);
    return response.data.data;
  },

  reviewReplacement: async (
    id: number,
    data: ReviewReplacementRequestDto
  ): Promise<ReplacementRequestDetailDto> => {
    const response = await axiosPrivate.put<
      ApiResponse<ReplacementRequestDetailDto>
    >(`/managerreplacement/${id}/review`, data);
    return response.data.data;
  },

  assignStaff: async (
    id: number,
    data: AssignStaffDto
  ): Promise<ReplacementRequestDetailDto> => {
    const response = await axiosPrivate.put<
      ApiResponse<ReplacementRequestDetailDto>
    >(`/managerreplacement/${id}/assign`, data);
    return response.data.data;
  },

  completeReplacement: async (
    id: number,
    data: CompleteReplacementDto
  ): Promise<ReplacementRequestDetailDto> => {
    const response = await axiosPrivate.put<
      ApiResponse<ReplacementRequestDetailDto>
    >(`/managerreplacement/${id}/complete`, data);
    return response.data.data;
  },
};

export default replacementService;
