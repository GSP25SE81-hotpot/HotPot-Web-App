/* eslint-disable @typescript-eslint/no-explicit-any */
// AuthContext.tsx
import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

// Define proper types for your auth state
interface User {
  role?: string;
  [key: string]: any;
}

interface AuthState {
  user: User;
  accessToken: string;
}

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  isManager: () => boolean; // Add a helper method for role checking
}

const AuthContext = createContext<AuthContextType>({
  auth: { user: {}, accessToken: "" },
  setAuth: () => {},
  isManager: () => false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const jsonString = localStorage.getItem("userInfor");
  const userStorage = jsonString ? JSON.parse(jsonString) : null;
  const navigate = useNavigate();
  const accessToken = userStorage?.accessToken;

  const [auth, setAuth] = useState<AuthState>({ user: {}, accessToken: "" });

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
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
    }
  }, [accessToken, navigate]);

  // Helper function to check if user is a manager
  const isManager = () => {
    return auth.user?.role?.toLowerCase() === "manager";
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, isManager }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
