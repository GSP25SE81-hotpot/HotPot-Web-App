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
}

export default orderManagementAPI;