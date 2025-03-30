import axiosClient from "./axiosInstance";

const orderManagementAPI =  {

    getOrder: ( params?:any ) =>
        {
          const url = "/admin/dashboard/orders";
          return axiosClient.get( url, {
            params,
            paramsSerializer: {
              indexes: null, // by default: false
            },
          } );
        },

    getOrderById: ( id: any ) =>
          {
            const url = `/admin/dashboard/orders/${id}`;
            return axiosClient.get( url );
          },
}

export default orderManagementAPI;