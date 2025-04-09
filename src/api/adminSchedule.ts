import  axiosClient  from "./axiosInstance";

const adminScheduleApi = {

    getAdminSchedule: ( params?:any ) =>
        {
          const url = "/admin/schedule";
          return axiosClient.get( url, {
            params,
            paramsSerializer: {
              indexes: null, // by default: false
            },
          } );
        },

        setSchedule: (payload: any) => {
          const url = "/admin/schedule/assign-manager";
          return axiosClient.post(url, payload);
      },
};

export default adminScheduleApi;