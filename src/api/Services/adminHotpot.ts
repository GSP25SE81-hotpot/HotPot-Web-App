/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";

const adminHotpot = {
  getListHotpot: (params: any) => {
    const url = "/admin/hotpots";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  createHotpot: (params: any) => {
    const url = "/admin/hotpots";
    return axiosClient.post(url, params, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  getListHotpotDetail: (params: any) => {
    const url = "/admin/hotpots/id";
    const newUrl = url.replace("id", params);
    return axiosClient.get(newUrl, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  updateAddHotpot: (id: string, params: any) => {
    const url = "/admin/hotpots/id";
    const newUrl = url.replace("id", id);
    return axiosClient.put(newUrl, params, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
};

export default adminHotpot;
