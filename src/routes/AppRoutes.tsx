import React from "react";
import { Route, Routes } from "react-router-dom";
import config from "../configs";
import Home from "../pages/Home/HomePage";
import ManagerLayout from "../layouts/ManagerLayout/ManagerLayout";
import { ManageRentalsPage } from "../pages/Manager/ManageRentals/ManageRentalsPage";
import { ManageRentalStatusPage } from "../pages/Manager/ManageRentals/ManageRentalStatusPage";
import { EquipmentAvailabilityPage } from "../pages/Manager/ManageRentals/EquipmentAvailabilityPage";
import { CheckDeviceAfterReturnPage } from "../pages/Manager/CheckDeviceAfterReturn/CheckDeviceAfterReturnPage";
import { ManageOrderPage } from "../pages/Manager/ManageOrder/ManageOrderPage";
import { WorkAssignmentSchedulePage } from "../pages/Manager/WorkAssignmentSchedule/WorkAssignmentSchedulePage";
import { DeliveryOrderPage } from "../pages/Manager/DeliveryOrder/DeliveryOrderPage";
import { ChatWithCustomerPage } from "../pages/Manager/ChatWithCustomer/ChatWithCustomerPage";
import { DepositConfirmationPage } from "../pages/Manager/DepositConfirmation/DepositConfirmationPage";
import { PaymentManagementPage } from "../pages/Manager/PaymentManagement/PaymentManagementPage";
import { RepairRequestsPage } from "../pages/Manager/RepairRequests/RepairRequestsPage";
import { EquipmentConditionLogPage } from "../pages/Manager/EquipmentConditionLog/EquipmentConditionLogPage";
import { EquipmentStatusReportPage } from "../pages/Manager/EquipmentStatusReport/EquipmentStatusReportPage";
import { OrderHistoryPage } from "../pages/Manager/OrderHistory/OrderHistoryPage";
import { FeedbackManagementPage } from "../pages/Manager/FeedbackManagement/FeedbackManagementPage";
import AdminLayout from "../layouts/AdminLayout/LayoutAdmin";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import FeedbackPage from "../pages/Admin/Feedback/FeedbackPage";
import FeedbackDetailPage from "../pages/Admin/Feedback/FeedbackDetailPage";
import CreateComboPage from "../pages/Admin/Combohotpot/CreateComboPage";
import CreateIngredientsPage from "../pages/Admin/CreateIngredients/CreateIngredientsPage";
import ManageUserPage from "../pages/Admin/ManageUser/ManageUserPage";
import { AuthenticatePage } from "../pages/Global/Authenticate/SignIn";

// import CheckRoute from "./CheckRoute";
// import RequireAuth from "./RequireAuth";
// import { Role } from "./Roles";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      <Route key = "login" path = {config.authRoutes.authenticate} element ={<AuthenticatePage/>} />
    
      <Route key="layout" path={config.routes.home} element={<ManagerLayout />}>
        <Route key="home" path={config.routes.home} element={<Home />} />
        <Route
          path={config.routes.manageRentals}
          element={<ManageRentalsPage />}
        />
        <Route
          path={config.routes.manageRentalStatus}
          element={<ManageRentalStatusPage />}
        />
        <Route
          path={config.routes.equipmentAvailability}
          element={<EquipmentAvailabilityPage />}
        />
        <Route
          path={config.routes.checkDevice}
          element={<CheckDeviceAfterReturnPage />}
        />
        <Route
          path={config.routes.manageOrders}
          element={<ManageOrderPage />}
        />
        <Route
          path={config.routes.workAssignment}
          element={<WorkAssignmentSchedulePage />}
        />
        <Route
          path={config.routes.workAssignment}
          element={<WorkAssignmentSchedulePage />}
        />
        <Route
          path={config.routes.deliveryOrder}
          element={<DeliveryOrderPage />}
        />
        <Route
          path={config.routes.customerChat}
          element={<ChatWithCustomerPage />}
        />
        <Route
          path={config.routes.depositConfirmation}
          element={<DepositConfirmationPage />}
        />
        <Route
          path={config.routes.paymentManagement}
          element={<PaymentManagementPage />}
        />
        <Route
          path={config.routes.repairRequests}
          element={<RepairRequestsPage />}
        />
        <Route
          path={config.routes.equipmentConditionLog}
          element={<EquipmentConditionLogPage />}
        />
        <Route
          path={config.routes.equipmentStatusReport}
          element={<EquipmentStatusReportPage />}
        />
        <Route
          path={config.routes.orderHistory}
          element={<OrderHistoryPage />}
        />
        <Route
          path={config.routes.feedbackManagement}
          element={<FeedbackManagementPage />}
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
          element={<ManageUserPage  />}
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
