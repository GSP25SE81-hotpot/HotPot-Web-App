/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { toast } from "react-toastify";

const axiosClient = axios.create({
  // baseURL: `https://hpty.vinhuser.one/api`,
  baseURL: `https://localhost:7163/api`,

  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const userDataLocal = localStorage.getItem("userInfor");
    const userData = userDataLocal ? JSON.parse(userDataLocal) : null;
    console.log("ber: ", userData);
    if (userData) {
      config.headers.Authorization = `Bearer ${userData?.accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  // return response.data;

  async (error) => {
    const prevRequest = error?.config;

    if (error?.response?.status === 401 && !prevRequest?.sent) {
      const userDataLocal = localStorage.getItem("userInfor");
      const userData = userDataLocal ? JSON.parse(userDataLocal) : null;

      if (userData) {
        prevRequest.sent = true;

        try {
          const res = await axios.post(
            "/auth/renewtoken",
            {
              refreshToken: userData.tokenModel.refreshToken,
              accessToken: userData.tokenModel.accessToken,
            },
            { baseURL: "https://hpty.vinhuser.one/api" }
          );

          const newToken = res?.data?.accessToken;

          if (newToken) {
            const newUserInfor = {
              ...userData,
              tokenModel: {
                refreshToken: userData.tokenModel.refreshToken,
                // refreshToken: res.data.refreshToken
                accessToken: newToken,
              },
            };
            localStorage.setItem("userInfor", JSON.stringify(newUserInfor));

            prevRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(prevRequest).then((data) => data.data);
          }
        } catch (err) {
          console.log("Error");
          // handleTokenExpiration();
          return null;
        }
      }
    } else if (error?.response?.status === 403) {
      redirectTo403Page();
    } else if (error?.response?.status === 500) {
      handleServerError(error);
    } else {
      handleGenericError();
    }

    return Promise.reject(error);
  }
);

// function handleTokenExpiration() {
//   toast.error(
//     "Tài khoản của bạn đã hết hạn đăng nhập.\n Hệ thống sẽ tự động thoát sau 3 giây.",
//     {
//       onClose() {
//         localStorage.removeItem("userInfor");
//         window.location.href = "/";
//       },
//       autoClose: 3000,
//       pauseOnHover: false,
//     }
//   );
// }

function redirectTo403Page() {
  window.location.href = "/403";
}

function handleServerError(error: any) {
  console.log(error);
}

function handleGenericError() {
  return;
}

export default axiosClient;
