/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "./axiosInstance";

const staffGetOrderApi = {
  getAssignOrderByStaffId: (params?: any) => {
    const url = `/staff/orders/assigned`;
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  shippingStatus: (id?: any, body?: any) => {
    const url = `/staff/shipping/${id}/status`;
    return axiosClient.put(url, body);
  },
  updateStatus: (id?: any, body?: any) => {
    const url = `/staff/orders/${id}/status`;
    return axiosClient.put(url, body);
  },
};

export default staffGetOrderApi;
