/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "@mui/material/styles/createTransitions";
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
};

export default adminDiscountApi;
