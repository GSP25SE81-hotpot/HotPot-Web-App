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

// import CheckRoute from "./CheckRoute";
// import RequireAuth from "./RequireAuth";
// import { Role } from "./Roles";

const AppRoute: React.FC = () => {
  return (
    <Routes>
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
          path={config.managerRoutes.checkDevice}
          element={<CheckDeviceAfterReturnPage />}
        />
        <Route
          path={config.managerRoutes.manageOrders}
          element={<ManageOrderPage />}
        />
        <Route
          path={config.managerRoutes.workAssignment}
          element={<WorkAssignmentSchedulePage />}
        />
        <Route
          path={config.managerRoutes.workAssignment}
          element={<WorkAssignmentSchedulePage />}
        />
        <Route
          path={config.managerRoutes.deliveryOrder}
          element={<DeliveryOrderPage />}
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
          path={config.managerRoutes.repairRequests}
          element={<RepairRequestsPage />}
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
