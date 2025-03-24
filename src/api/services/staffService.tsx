// src/api/services/staffService.ts
// import { axiosClient } from "../axiosInstance";
import { ApiResponse } from "../../types/replacement";
import { StaffDto } from "../../types/staff";
import axiosClient from "../axiosInstance";

const staffService = {
  getAllStaff: async (): Promise<StaffDto[]> => {
    const response = await axiosClient.get<ApiResponse<StaffDto[]>>(
      "/staff/all"
    );
    return response.data.data;
  },

  getStaffById: async (id: number): Promise<StaffDto> => {
    const response = await axiosClient.get<ApiResponse<StaffDto>>(
      `/staff/${id}`
    );
    return response.data.data;
  },
};

export default staffService;
