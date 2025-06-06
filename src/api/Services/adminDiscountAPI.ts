/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";

const adminDiscountApi = {
  getDiscounts: (params?: any) => {
    const url = "/admin/discounts";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  createDiscount: (data: any) => {
    const url = "/admin/discounts";
    return axiosClient.post(url, data);
  },

  getDiscountDetails: (id: string | number) => {
    const url = `/admin/discounts/${id}`;
    return axiosClient.get(url);
  },

  updateDiscount: (id: string | number, data: any) => {
    const url = `/admin/discounts/${id}`;
    return axiosClient.put(url, data);
  },

  deleteDiscount: (id: string | number) => {
    const url = `/admin/discounts/${id}`;
    return axiosClient.delete(url);
  },
};

export default adminDiscountApi;
