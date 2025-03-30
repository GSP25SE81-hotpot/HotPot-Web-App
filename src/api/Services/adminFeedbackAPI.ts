/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosClient from "../axiosInstance";

const adminFeedbackAPI = {
  getListFeedback: (params?: any) => {
    const url = "/admin/feedback";
    return axiosClient.get(url, {
      params,
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  CreateFeedback: (params?: any) => {
    const url = "/admin/feedback";
    return axiosClient.post(url, params, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
  getFeedbackDetails: (params?: any) => {
    const url = "/admin/feedback/id";
    const newUrl = url.replace("id", params);

    return axiosClient.get(newUrl, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  ApproveFeedback: (id: any, params?: any) => {
    const url = "/admin/feedback/id/approve";
    const newUrl = url.replace("id", id);
    return axiosClient.post(newUrl, params, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },

  RejectFeedback: (id: any, params?: any) => {
    const url = "/admin/feedback/id/reject";
    const newUrl = url.replace("id", id);
    return axiosClient.post(newUrl, params, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
};

export default adminFeedbackAPI;
