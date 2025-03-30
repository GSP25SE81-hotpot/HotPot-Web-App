import axiosClient from "./axiosInstance";

const adminUserManagementAPI = {
    getListUser: ( params?:any ) =>
        {
          const url = "/admin/users";
          return axiosClient.get( url, {
            params,
            paramsSerializer: {
              indexes: null, // by default: false
            },
          } );
        },
        
    getListUserById: ( id?:number ) =>
          {
            const url = `/admin/users/${id}`;
            return axiosClient.get( url );
          },

    createNewUser: (body: any) => {
      const url = "/admin/users"
      return axiosClient.post(url, body)
    },

    updateUserInf: (id: number, body: any) => {
      const url = `/admin/users/${id}`
      return axiosClient.put(url, body)
    },

    deleteUser: (id: any) => {
      const url = `/admin/users/${id}`
      return axiosClient.delete(url)
    }
}

export default adminUserManagementAPI;