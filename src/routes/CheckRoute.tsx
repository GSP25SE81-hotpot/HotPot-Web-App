import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

const CheckRoute = () => {
  const { auth } = useAuth();
  console.log("CheckRoute auth:", auth);
  const location = useLocation();

  // Check if token is expired
  const isTokenExpired = () => {
    if (!auth?.accessToken) return true;

    try {
      const decoded = jwtDecode(auth.accessToken);
      // JWT tokens typically have 'exp' claim in seconds
      if (!decoded.exp) return true;

      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      return currentTime >= expirationTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true; // Consider token expired if there's an error
    }
  };

  // Check routing condition
  const routing = () => {
    if (isTokenExpired()) {
      localStorage.removeItem("userInfor");
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    // If token is valid, proceed with role-based routing

    switch (auth?.user?.role) {
      case "Admin":
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
      case "Staff":
        return (
          <Navigate to="/assign-order" state={{ from: location }} replace />
        );
      case "Manager":
        return (
          <Navigate to="/manage-order" state={{ from: location }} replace />
        );
      default:
        break;
    }
  };

  return auth?.accessToken ? routing() : <Outlet />;
};

export default CheckRoute;
