import React from "react";
import { Route, Routes } from "react-router-dom";
import config from "../configs";
import Home from "../pages/Home/HomePage";
import StaffLayout from "../layouts/StaffLayout/StaffLayout";
import { ManageRentalsPage } from "../pages/Staff/ManageRentals/ManageRentalsPage";
import { ManageRentalStatusPage } from "../pages/Staff/ManageRentals/ManageRentalStatusPage";
import { EquipmentAvailabilityPage } from "../pages/Staff/ManageRentals/EquipmentAvailabilityPage";
import { CheckDeviceAfterReturnPage } from "../pages/Staff/CheckDeviceAfterReturn/CheckDeviceAfterReturnPage";
import { ManageOrderPage } from "../pages/Staff/ManageOrder/ManageOrderPage";
import { WorkAssignmentSchedulePage } from "../pages/Staff/WorkAssignmentSchedule/WorkAssignmentSchedulePage";


// import CheckRoute from "./CheckRoute";
// import RequireAuth from "./RequireAuth";
// import { Role } from "./Roles";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      <Route key="layout" path={config.routes.home} element={<StaffLayout />}>
        <Route key="home" path={config.routes.home} element={<Home />} />
        <Route path={config.routes.manageRentals} element={<ManageRentalsPage />} />
        <Route path={config.routes.manageRentalStatus} element= {<ManageRentalStatusPage/>} />
        <Route path={config.routes.equipmentAvailability} element= {<EquipmentAvailabilityPage/>} />
        <Route path={config.routes.checkDevice} element= {<CheckDeviceAfterReturnPage/>} />
        <Route path={config.routes.manageOrders} element= {<ManageOrderPage/>} />
        <Route path={config.routes.workAssignment} element= {<WorkAssignmentSchedulePage/>} />
      </Route>
    </Routes>
  );
};

export default AppRoute;
