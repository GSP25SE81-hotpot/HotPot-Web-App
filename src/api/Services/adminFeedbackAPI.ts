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
    const url = "/admin/feedback/:id";
    return axiosClient.post(url, params, {
      paramsSerializer: {
        indexes: null, // by default: false
      },
    });
  },
};

export default adminFeedbackAPI;
