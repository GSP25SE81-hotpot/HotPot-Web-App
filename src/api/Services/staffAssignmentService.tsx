/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/Services/staffAssignmentService.ts
import axiosClient from "../axiosInstance";
import {
  PagedResult,
  StaffAssignmentHistoryDto,
  StaffAssignmentHistoryFilterRequest,
} from "../../types/staffAssignment";

const staffAssignmentService = {
  getStaffAssignmentHistory: async (
    filter: StaffAssignmentHistoryFilterRequest
  ): Promise<PagedResult<StaffAssignmentHistoryDto>> => {
    // Convert filter to query params
    const params = new URLSearchParams();
    if (filter.startDate) params.append("startDate", filter.startDate);
    if (filter.endDate) params.append("endDate", filter.endDate);
    if (filter.taskType !== undefined)
      params.append("taskType", filter.taskType.toString());
    if (filter.isActive !== undefined)
      params.append("isActive", filter.isActive.toString());
    if (filter.staffId) params.append("staffId", filter.staffId.toString());
    if (filter.staffName) params.append("staffName", filter.staffName);
    if (filter.orderCode) params.append("orderCode", filter.orderCode);
    if (filter.pageNumber)
      params.append("pageNumber", filter.pageNumber.toString());
    if (filter.pageSize) params.append("pageSize", filter.pageSize.toString());

    const queryString = params.toString();
    const url = `/manager/staff-assignment-history${
      queryString ? `?${queryString}` : ""
    }`;

    try {
      // The response is directly the PagedResult, not wrapped in ApiResponse
      const response = await axiosClient.get<
        PagedResult<StaffAssignmentHistoryDto>,
        any
      >(url);
      return response;
    } catch (error) {
      console.error("Error in getStaffAssignmentHistory:", error);
      throw error;
    }
  },
};

export default staffAssignmentService;
