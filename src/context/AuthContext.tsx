import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext({});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const jsonString = localStorage.getItem("userInfor");
  const userStorage = jsonString ? JSON.parse(jsonString) : null;
  const navigate = useNavigate();
  const accessToken = userStorage?.accessToken;

  const [auth, setAuth] = useState({ user: {}, accessToken: "" });

  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        console.log("Decoded Token:", decoded);
        setAuth({ user: decoded, accessToken });
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        setAuth({ user: {}, accessToken: "" });
      }
    } else {
      setAuth({ user: {}, accessToken: "" });
    }
  }, [accessToken]); // Chạy lại khi accessToken thay đổi

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
