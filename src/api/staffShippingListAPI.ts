import axiosClient from "./axiosInstance";

const staffShippingListApi = {
  getShippingOrderByStaffId: () => {
    const url = `/staff/shipping/list`;
    return axiosClient.get(url);
  },
};

export default staffShippingListApi;
