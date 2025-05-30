import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const CheckRoute = () => {
  const { auth } = useAuth();
  console.log("CheckRoute auth:", auth);
  const location = useLocation();

  // Check routing condition
  const routing = () => {
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
