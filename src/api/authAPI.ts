import  axiosClient  from "./axiosInstance";

const authApi = {
    login: (payload: any) => {
        const url = "/auth/login";
        return axiosClient.post(url, payload);
    },
};

export default authApi;