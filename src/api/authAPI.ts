import  axiosClient  from "./axiosInstance";

const authApi = {
    login: (payload: any) => {
        const url = "/auth/login";
        return axiosClient.post(url, payload);
    },
    logout: () => {
        const url = "/auth/logout";
        return axiosClient.post(url);
    },
};

export default authApi;