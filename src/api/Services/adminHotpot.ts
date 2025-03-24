import axiosClient from "../axiosInstance";

const adminHotpot = {
  getListHotpot: (params) => {
    const url = "/admin/hotpots";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  createHotpot: (params) => {
    const url = "/admin/hotpots";
    return axiosClient.post(url, params, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
};

export default adminHotpot;
