import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";

const AuthContext = createContext({});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const jsonString = localStorage.getItem("userInfor");
  const user = jsonString ? JSON.parse(jsonString) : null;
  let navigate = useNavigate();
  const accessToken = user?.accessToken;
  const [auth, setAuth] = useState(
    user && accessToken ? { user, accessToken } : {}
  );

  useEffect(() => {
    if (!accessToken) {
      navigate("/auth");
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
