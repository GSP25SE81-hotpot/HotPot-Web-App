import React from "react";
import { Route, Routes } from "react-router-dom";
import config from "../configs";
import Home from "../pages/Home/Home";
import StaffLayout from "../layouts/StaffLayout/StaffLayout";
import ManageRentals from "../pages/ManageRentals/ManageRentals";
import ManageRentalStatus from '../pages/ManageRentals/ManageRentalStatus';
import EquipmentAvailability from "../pages/ManageRentals/EquipmentAvailability";
import CheckDeviceAfterReturn from "../pages/CheckDeviceAfterReturn/CheckDeviceAfterReturn";

// import CheckRoute from "./CheckRoute";
// import RequireAuth from "./RequireAuth";
// import { Role } from "./Roles";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      <Route key="layout" path={config.routes.home} element={<StaffLayout />}>
        <Route key="home" path={config.routes.home} element={<Home />} />
        <Route path={config.routes.manageRentals} element={<ManageRentals />} />
        <Route path={config.routes.manageRentalStatus} element= {<ManageRentalStatus/>} />
        <Route path={config.routes.equipmentAvailability} element= {<EquipmentAvailability/>} />
        <Route path={config.routes.checkDevice} element= {<CheckDeviceAfterReturn/>} />

      </Route>
    </Routes>
  );
};

export default AppRoute;
