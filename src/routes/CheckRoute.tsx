// import React from "react";
// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuthContext } from "../context/AuthContext";
// import config from "../configs";
// import { Role } from "./Roles";
// import LoadingScreen from "../components/LoadingScreen";

// const CheckRoute: React.FC = () => {
//   const { role, isLoading } = useAuthContext();
//   const location = useLocation();
//   let redirectTo: string | null = config.routes.home;

//   if (isLoading) {
//     return (
//       <div>
//         <LoadingScreen />
//       </div>
//     );
//   }

//   if (role) {
//     switch (role) {
//       case Role.User:
//         redirectTo = config.routes.home;
//         break;
//       case Role.Admin:
//       case Role.Manager:
//         redirectTo = config.adminRoutes.dashboard;
//         break;
//       case Role.Sale:
//         redirectTo = config.adminRoutes.user;
//         break;
//       default:
//         break;
//     }
//   }

//   if (location.pathname === redirectTo) {
//     return <Outlet />;
//   } else {
//     return <Navigate to={redirectTo} state={{ from: location }} replace />;
//   }
// };

// export default CheckRoute;
