/* eslint-disable @typescript-eslint/no-explicit-any */
// useAuth.tsx
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

interface User {
  role?: string;
  [key: string]: any;
}

interface AuthContextType {
  auth: {
    user: User;
    accessToken: string;
  };
  setAuth: React.Dispatch<
    React.SetStateAction<{ user: User; accessToken: string }>
  >;
  isManager: () => boolean;
}

const useAuth = () => {
  return useContext(AuthContext) as AuthContextType;
};

export default useAuth;
