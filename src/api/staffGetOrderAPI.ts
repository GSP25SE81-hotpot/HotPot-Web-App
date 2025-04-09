import  axiosClient  from "./axiosInstance";

const staffGetOrderApi = {

    getAssignOrderByStaffId: ( id?:any ) =>
        {
          const url = `/staff/orders/assigned/${id}`;
          return axiosClient.get(url);
        },
    updateStatus: ( id?:any, body?:any ) =>
        {
          const url = `/staff/orders/${id}/status`;
          return axiosClient.put(url, body );
        } 
};

export default staffGetOrderApi;