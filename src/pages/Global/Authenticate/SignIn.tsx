/* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
// import { toast } from "react-toastify";
import { FaLock, FaUser } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import * as Yup from "yup";
// import authApi from "../../services/api/AuthAPI";
// import "./SignIn.scss";
import classNames from "classnames/bind";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import authApi from "../../../api/authAPI";
import useAuth from "../../../hooks/useAuth";
import styles from "./authenticate.module.scss";
import { FaUserShield } from "react-icons/fa"; 


export const AuthenticatePage = () => {
  const navigate = useNavigate();
  const cx = classNames.bind(styles);
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object({
    phoneNumber: Yup.string()
      .required("Tài khoản không được để trống!")
      .min(3, "Độ dài tài khoản phải tối thiểu 3 kí tự"),
    password: Yup.string()
      .required("Mật khẩu không được để trống!")
      .min(4, "Độ dài mật khẩu phải tối thiểu 4 kí tự"),
  });
  const demoAccounts = [
    { role: "Admin", phoneNumber: "987654321", password: "123456" },
    { role: "Manager", phoneNumber: "0888888888", password: "123456" },
    { role: "Staff", phoneNumber: "777777777", password: "123456" }
  ];
  const formik = useFormik({
    initialValues: {
      phoneNumber: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("data truyền: ", values);
      try {
        const response: any = await authApi.login({
          phoneNumber: values.phoneNumber,
          password: values.password,
        });
        localStorage.setItem("userInfor", JSON.stringify(response?.data));
        console.log("first", response?.data);
        const decoded: any = jwtDecode(response?.data?.accessToken);
        setAuth({
          user: response?.data,
          accessToken: response?.data?.accessToken,
        });
        if (decoded?.role == "Admin") {
          navigate("/dashboard");
        } else if (decoded?.role == "Manager") {
          navigate("/manage-order");
        } else {
          navigate("/assign-order");
        }
        toast.success("Đăng nhập thành công!");
      } catch (error: any) {
        console.error("Login failed:", error);
        toast.error(error.message || "Đăng nhập không thành công!");
      }
    },
  });

  return (
    <div className={cx("bg-login-container")}>
      <div className={cx("wrapper")}>
        <form onSubmit={formik.handleSubmit}>
          <h1 className={cx("title")}>Đăng Nhập</h1>
          <div className={cx("input-box")}>
            <input
              id="phoneNumber"
              type="text"
              className={cx("input-text")}
              placeholder="Tên đăng nhập *"
              {...formik.getFieldProps("phoneNumber")}
            />
            <FaUser className={cx("icon")} />
          </div>
          {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
            <div className={cx("error")}>{formik.errors.phoneNumber}</div>
          ) : null}
          <div className={cx("input-box")}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className={cx("input-text")}
              style={{ color: "black" }}
              placeholder="Mật khẩu *"
              {...formik.getFieldProps("password")}
            />
            <FaLock className={cx("icon")} />
            <span
              style={{
                position: "absolute",
                right: "40px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                zIndex: 2,
              }}
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={0}
              role="button"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </span>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className={cx("error")}>{formik.errors.password}</div>
          ) : null}

          <button type="submit" className={cx("button-submit")}>
            Đăng nhập
          </button>
        </form>
        
      {/* Demo Accounts Section */}
        <div className={cx("demo-section")}>
          <div className={cx("demo-header")}>
            <FaUserShield className={cx("demo-icon")} />
            <h3>Tài khoản Demo</h3>
          </div>
          
          <div className={cx("demo-accounts")}>
            {demoAccounts.map((account, index) => (
              <div key={index} className={cx("demo-account")}>
                <div className={cx("account-role")}>{account.role}</div>
                <div className={cx("account-details")}>
                  <div><strong>Tài khoản:</strong> {account.phoneNumber}</div>
                  <div><strong>Mật khẩu:</strong> {account.password}</div>
                </div>
                <button
                  type="button"
                  className={cx("demo-btn")}
                  onClick={() => {
                    formik.setFieldValue("phoneNumber", account.phoneNumber);
                    formik.setFieldValue("password", account.password);
                    toast.info(`Using tài khoản ${account.role} để Demo `);
                  }}
                >
                  Use Demo
                </button>
              </div>
            ))}
          </div>
          <div className={cx("demo-note")}>
            <p>Note: Đây là những tài khoản với những quyền truy cập khác nhau</p>
          </div>
        </div>
      </div>
    </div>
  );
};
