import { ApiResponse } from "../../types/replacement";
import { StaffAvailabilityDto, StaffDto } from "../../types/staff";
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

  getAvailableStaff: async (): Promise<StaffAvailabilityDto> => {
    const response = await axiosClient.get<ApiResponse<StaffAvailabilityDto>>(
      `/staff/available`
    );
    return response.data.data;
  },
};

export default staffService;
