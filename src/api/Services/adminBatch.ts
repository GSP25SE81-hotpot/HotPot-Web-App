/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";

const adminBatchAPI = {
  CreateNewBatch: (params?: any) => {
    const url = "/admin/batches/multiple";
    return axiosClient.post(url, params, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  GetAllBatch: (params?: any) => {
    const url = "/admin/batches/all";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  GetBatchDetail: (batchNumber?: any) => {
    console.log(batchNumber, "api");

    const url = "/admin/batches/batch-number/batchNumber";
    const newUrl = url.replace("batchNumber", batchNumber);
    return axiosClient.get(newUrl, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
};

export default adminBatchAPI;
