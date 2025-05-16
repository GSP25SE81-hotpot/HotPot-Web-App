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
};

export default adminBatchAPI;
