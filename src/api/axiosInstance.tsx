import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { LoginInfo } from "../types/loginInterface";

const BASE_URL ="";

const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

const getLoginInfo = (): LoginInfo | null => {
  const loginInfoString = localStorage.getItem("loginInfo");
  return loginInfoString ? JSON.parse(loginInfoString).data : null;
};

const createAxiosPrivate = () => {
  // sure accessToken always new
  let accessToken = "";
  const loginInfo = getLoginInfo();
  accessToken = loginInfo?.tokenModel?.accessToken || "";

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const axiosPrivate = createAxiosPrivate();

axiosPrivate.interceptors.request.use(async (req) => {
  const loginInfo = getLoginInfo();
  const accessToken = loginInfo?.tokenModel?.accessToken || "";
  const refreshToken = loginInfo?.tokenModel?.refreshToken || "";

  req.headers.Authorization = `Bearer ${accessToken}`;

  if (accessToken) {
    const user = jwtDecode(accessToken);
    const date = new Date();
    // Check if the token is expired
    if (user.exp) {
      const isExpired = user?.exp < date.getTime() / 1000;
      if (!isExpired) {
        return req;
      } else {
        try {
          const params = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            expires: user?.exp,
          };
          const response = await axiosPublic.post(`/auths/refresh`, params);
          localStorage.setItem("loginInfo", JSON.stringify(response.data));
          req.headers.Authorization = `Bearer ${response.data.accessToken}`;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // If refresh fails, clear loginInfo
          localStorage.removeItem("loginInfo");
          // You might want to redirect to login page here
        }
      }
    }
  }
  return req;
});

export { axiosPrivate, axiosPublic };
