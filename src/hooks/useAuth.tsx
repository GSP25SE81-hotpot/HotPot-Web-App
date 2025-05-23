/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

interface AuthContextType {
  auth: {
    user?: { [key: string]: any };
    accessToken?: string;
  };
  setAuth: React.Dispatch<
    React.SetStateAction<{ user: any; accessToken: any } | {} | null>
  >;
}

const useAuth = () => {
  return useContext(AuthContext) as AuthContextType;
};

export default useAuth;
