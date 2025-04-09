/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";

const adminDashboard = {
  getDashboard: (params?: any) => {
    const url = "/admin/dashboard";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
};

export default adminDashboard;
