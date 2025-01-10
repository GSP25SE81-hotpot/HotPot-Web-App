// import React from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuthContext } from "../context/AuthContext";
// import config from "../configs";
// import LoadingScreen from "../components/LoadingScreen";

// interface RequireAuthProps {
//   allowedRoles: string[];
// }

// const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
//   const { role, isLoading } = useAuthContext();
//   const location = useLocation();

//   if (isLoading) {
//     return (
//       <div>
//         <LoadingScreen />
//       </div>
//     );
//   }

//   if (!role) {
//     return (
//       <Navigate to={config.routes.home} replace state={{ from: location }} />
//     );
//   }

//   if (!allowedRoles.includes(role)) {
//     return <Navigate to="/notFound" replace state={{ from: location }} />;
//   }

//   return <Outlet />;
// };

// export default RequireAuth;
