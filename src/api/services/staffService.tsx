// src/api/services/staffService.ts
import { axiosPrivate } from "../axiosInstance";
import { ApiResponse } from "../../types/replacement";
import { StaffDto } from "../../types/staff";

const staffService = {
  getAllStaff: async (): Promise<StaffDto[]> => {
    const response = await axiosPrivate.get<ApiResponse<StaffDto[]>>(
      "/staff/all"
    );
    return response.data.data;
  },

  getStaffById: async (id: number): Promise<StaffDto> => {
    const response = await axiosPrivate.get<ApiResponse<StaffDto>>(
      `/staff/${id}`
    );
    return response.data.data;
  },
};

export default staffService;
