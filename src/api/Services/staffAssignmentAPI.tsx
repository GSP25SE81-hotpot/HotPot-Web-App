/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";

const StaffAssignemtAPI = {
  getListAssignment: (params?: any) => {
    const url = "/staff/rentals/my-assignments";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getAssignmentDetail: (id: any, params?: any) => {
    const url = "/staff/rentals/order/id";
    const newUrl = url.replace("id", id);
    return axiosClient.get(newUrl, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  updateAssignment: (params: any) => {
    const url = "/staff/rentals/record-return";
    return axiosClient.post(url, params, {
      paramsSerializer: {
        indexes: null,
      },
    });
  },
};

export default StaffAssignemtAPI;
