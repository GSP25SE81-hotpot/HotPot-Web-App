import React from "react";
import { Route, Routes } from "react-router-dom";
import config from "../configs";
import Home from "../pages/Home/Home";
import StaffLayout from "../layouts/StaffLayout/StaffLayout";
import AdminLayout from "../layouts/AdminLayout/LayoutAdmin";
import FeedbackDetailPage from "../pages/Admin/Feedback/FeedbackDetailPage";
import FeedbackPage from "../pages/Admin/Feedback/FeedbackPage";
import CreateComboPage from "../pages/Admin/Combohotpot/CreateComboPage";
import CreateIngredientsPage from "../pages/Admin/CreateIngredients/CreateIngredientsPage";
import ManageUserPage from "../pages/Admin/ManageUser/ManageUserPage";
import { AuthenticatePage } from "../pages/Global/Authenticate/SignIn";
import TableIngredientsPage from "../pages/Admin/TableIngredients/TableIngredientsPage";
import TableHotpotPage from "../pages/Admin/Tablehotpot/TableHotpotPage";
import TableHotpotComboPage from "../pages/Admin/TableCombo/TableHotpoComboPage";
import CreateHotpotPage from "../pages/Admin/CreateHotpot/CreateHotpotPage";
import DashboardPage from "../pages/Admin/Dashboard/DashboardPage";
import OrderPage from "../pages/Admin/ManageOrder/OrderPage";
import HotpotComboDetailPage from "../pages/Admin/ComboDetail/HotpotComboDetailPage";

// import CheckRoute from "./CheckRoute";
// import RequireAuth from "./RequireAuth";
// import { Role } from "./Roles";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      <Route
        key={"Login"}
        path={config.authRoute.authenticate}
        element={<AuthenticatePage />}
      />
      <Route
        key="layoutAdmin"
        path={config.adminRoutes.dashboard}
        element={<AdminLayout />}
      >
        <Route
          key="dashboard"
          path={config.adminRoutes.dashboard}
          element={<DashboardPage />}
        />
        <Route
          key="order"
          path={config.adminRoutes.orders}
          element={<OrderPage />}
        />
        <Route
          key="feedbackTable"
          path={config.adminRoutes.feedback}
          element={<FeedbackPage />}
        />
        <Route
          key="feedbackDetail"
          path={config.adminRoutes.feedbackDetail}
          element={<FeedbackDetailPage />}
        />
        <Route
          key="createCombo"
          path={config.adminRoutes.createHotPotCombo}
          element={<CreateComboPage />}
        />
        <Route
          key="createIngredients"
          path={config.adminRoutes.createIngredients}
          element={<CreateIngredientsPage />}
        />
        <Route
          key="listIngredients"
          path={config.adminRoutes.manageIngredients}
          element={<TableIngredientsPage />}
        />
        <Route
          key="listHotpot"
          path={config.adminRoutes.hotpotType}
          element={<TableHotpotPage />}
        />

        <Route
          key="ListHotpotCombo"
          path={config.adminRoutes.tableHotPotCombo}
          element={<TableHotpotComboPage />}
        />

        <Route
          key="AddHotpot"
          path={config.adminRoutes.addHotpot}
          element={<CreateHotpotPage />}
        />

        <Route
          key="hotpotDetail"
          path={config.adminRoutes.HotpotDetail}
          element={<HotpotComboDetailPage />}
        />
        <Route
          key={"manageUser"}
          path={config.adminRoutes.manageUsers}
          element={<ManageUserPage />}
        />
      </Route>
      <Route key="layout" path={config.routes.home} element={<StaffLayout />}>
        <Route key="home" path={config.routes.home} element={<Home />} />
      </Route>
    </Routes>
  );
};

export default AppRoute;
