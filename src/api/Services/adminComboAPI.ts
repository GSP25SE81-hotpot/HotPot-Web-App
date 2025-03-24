/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";

const adminComboAPI = {
  getListCombo: (params?: any) => {
    const url = "/admin/combo";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  CreateAdminCombo: (params?: any) => {
    const url = "/admin/combo";
    return axiosClient.post(url, params, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  GetAdminComboDetail: (id?: any) => {
    const url = "/admin/combo/:comboId";
    return axiosClient.get(url.replace(":comboId", id), {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
};

export default adminComboAPI;
