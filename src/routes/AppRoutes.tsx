import React from "react";
import { Route, Routes } from "react-router-dom";
import config from "../configs";
import Home from "../pages/Home/HomePage";
import ManagerLayout from "../layouts/ManagerLayout/ManagerLayout";
import { ManageRentalsPage } from "../pages/Manager/ManageRental/ManageRentalsPage";
import { ManageRentalStatusPage } from "../pages/Manager/ManageRental/ManageRentalStatusPage";
import { EquipmentAvailabilityPage } from "../pages/Manager/ManageRental/EquipmentAvailabilityPage";
import { CheckDeviceAfterReturnPage } from "../pages/Staff/CheckDeviceAfterReturn/CheckDeviceAfterReturnPage";
import { WorkAssignmentSchedulePage } from "../pages/Manager/WorkAssignmentSchedule/WorkAssignmentSchedulePage";
import { ChatWithCustomerPage } from "../pages/Manager/ChatWithCustomer/ChatWithCustomerPage";
import { DepositConfirmationPage } from "../pages/Staff/DepositConfirmation/DepositConfirmationPage";
import { PaymentManagementPage } from "../pages/Staff/PaymentManagement/PaymentManagementPage";
import { ResolveEquipmentFailurePage } from "../pages/Manager/ResolveEquipmentFailure/ResolveEquipmentFailurePage";
import { EquipmentConditionLogPage } from "../pages/Manager/EquipmentConditionLog/EquipmentConditionLogPage";
import { EquipmentStatusReportPage } from "../pages/Manager/EquipmentStatusReport/EquipmentStatusReportPage";
import { OrderHistoryPage } from "../pages/Staff/OrderHistory/OrderHistoryPage";
import { FeedbackManagementPage } from "../pages/Manager/FeedbackManagement/FeedbackManagementPage";
import AdminLayout from "../layouts/AdminLayout/LayoutAdmin";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import FeedbackPage from "../pages/Admin/Feedback/FeedbackPage";
import FeedbackDetailPage from "../pages/Admin/Feedback/FeedbackDetailPage";
import CreateComboPage from "../pages/Admin/Combohotpot/CreateComboPage";
import CreateIngredientsPage from "../pages/Admin/CreateIngredients/CreateIngredientsPage";
import { ManageReplacementPage } from "../pages/Manager/ManageReplacement/ManageReplacementPage";
import ManageUserPage from "../pages/Admin/ManageUser/ManageUserPage";
import { AuthenticatePage } from "../pages/Global/Authenticate/SignIn";

// import CheckRoute from "./CheckRoute";
// import RequireAuth from "./RequireAuth";
// import { Role } from "./Roles";
import AssignOrder from "../containers/AssignOrder/AssignOrder";
import { ManageOrderPage } from "../pages/Manager/ManageOrder/ManageOrderPage";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      <Route
        key="login"
        path={config.authRoutes.authenticate}
        element={<AuthenticatePage />}
      />

      <Route
        key="layoutManager"
        path={config.managerRoutes.home}
        element={<ManagerLayout />}
      >
        <Route key="home" path={config.managerRoutes.home} element={<Home />} />
        <Route
          path={config.managerRoutes.manageRentals}
          element={<ManageRentalsPage />}
        />
        <Route
          path={config.managerRoutes.manageRentalStatus}
          element={<ManageRentalStatusPage />}
        />
        <Route
          path={config.managerRoutes.equipmentAvailability}
          element={<EquipmentAvailabilityPage />}
        />
        <Route
          path={config.managerRoutes.retrieveRentalEquipment}
          element={<CheckDeviceAfterReturnPage />}
        />
        <Route
          path={config.managerRoutes.manageOrder}
          element={<ManageOrderPage />}
        />
        <Route
          path={config.managerRoutes.workAssignment}
          element={<WorkAssignmentSchedulePage />}
        />
        <Route
          path={config.managerRoutes.assignOrder}
          element={<AssignOrder />}
        />
        <Route
          path={config.managerRoutes.customerChat}
          element={<ChatWithCustomerPage />}
        />
        <Route
          path={config.managerRoutes.depositConfirmation}
          element={<DepositConfirmationPage />}
        />
        <Route
          path={config.managerRoutes.paymentManagement}
          element={<PaymentManagementPage />}
        />
        <Route
          path={config.managerRoutes.resolveEquipmentFailure}
          element={<ResolveEquipmentFailurePage />}
        />
        <Route
          path={config.managerRoutes.equipmentConditionLog}
          element={<EquipmentConditionLogPage />}
        />
        <Route
          path={config.managerRoutes.equipmentStatusReport}
          element={<EquipmentStatusReportPage />}
        />
        <Route
          path={config.managerRoutes.orderHistory}
          element={<OrderHistoryPage />}
        />
        <Route
          path={config.managerRoutes.feedbackManagement}
          element={<FeedbackManagementPage />}
        />
        <Route
          path={config.managerRoutes.manageReplacement}
          element={<ManageReplacementPage />}
        />
      </Route>
      <Route
        key="layoutAdmin"
        path={config.adminRoutes.dashboard}
        element={<AdminLayout />}
      >
        <Route
          key="dashboard"
          path={config.adminRoutes.dashboard}
          element={<Dashboard />}
        />
        <Route
          key={"manageUser"}
          path={config.adminRoutes.manageUsers}
          element={<ManageUserPage />}
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
      </Route>
    </Routes>
  );
};

export default AppRoute;
