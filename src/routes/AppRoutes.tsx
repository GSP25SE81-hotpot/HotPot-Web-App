import React from "react";
import { Route, Routes } from "react-router-dom";
import config from "../configs";
import Home from "../pages/Home/Home";
import StaffLayout from "../layouts/StaffLayout/StaffLayout";

// import CheckRoute from "./CheckRoute";
// import RequireAuth from "./RequireAuth";
// import { Role } from "./Roles";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      <Route key="layout" path={config.routes.home} element={<StaffLayout />}>
        <Route key="home" path={config.routes.home} element={<Home />} />
      </Route>
    </Routes>
  );
};

export default AppRoute;
