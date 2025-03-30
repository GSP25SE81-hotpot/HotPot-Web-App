/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";

const adminMaintenanceAPI = {
  getListMaintenance: (params?: any) => {
    const url = "/admin/maintenance/hotpots";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getMaintenanceDetails: (params?: any) => {
    const url = "/admin/maintenance/id";
    const newUrl = url.replace("id", params);
    return axiosClient.get(newUrl, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getListMaintenanceOfHotpot: (params?: any) => {
    const url = "/admin/hotpots/inventory/id";
    const newUrl = url.replace("id", params);
    return axiosClient.get(newUrl, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
};

export default adminMaintenanceAPI;
