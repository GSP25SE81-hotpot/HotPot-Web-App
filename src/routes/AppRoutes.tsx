import React from "react";
import { Route, Routes } from "react-router-dom";
import config from "../configs";
// import Home from "../pages/Home/HomePage";
import ManagerLayout from "../layouts/ManagerLayout/ManagerLayout";
import { ManageRentalsPage } from "../pages/Manager/ManageRental/ManageRentalsPage";
import { ManageRentalStatusPage } from "../pages/Manager/ManageRental/ManageRentalStatusPage";
import { EquipmentAvailabilityPage } from "../pages/Manager/ManageRental/EquipmentAvailabilityPage";
import { CheckDeviceAfterReturnPage } from "../pages/Staff/CheckDeviceAfterReturn/CheckDeviceAfterReturnPage";
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
import { ManageOrderPage } from "../pages/Manager/ManageOrder/ManageOrderPage";
import WorkAssignmentSchedulePage from "../pages/Manager/WorkAssignmentSchedule/WorkAssignmentSchedulePage";
import { AssignOrderPage } from "../pages/Staff/AssignOrder/AssignOrderPage";
import { ProofOfDeliveryPage } from "../pages/Staff/ProofOfDelivery/ProofOfDeliveryPage";
import { ManagerRentalReturnPage } from "../pages/Manager/ManagerRentalReturnPage/ManagerRentalReturnPage";
import { UnassignedPickupsPage } from "../pages/Manager/ManagerRentalReturnPage/UnassignedPickupsPage";
import { CurrentAssignmentsPage } from "../pages/Manager/ManagerRentalReturnPage/CurrentAssignmentsPage";
import { RentalHistoryPage } from "../pages/Manager/ManagerRentalReturnPage/RentalHistoryPage";
import { LateFeeCalculatorPage } from "../pages/Manager/ManagerRentalReturnPage/LateFeeCalculatorPage";
import { ReturnDateAdjustmentPage } from "../pages/Manager/ManagerRentalReturnPage/ReturnDateAdjustmentPage";
import { RentalDetailPage } from "../pages/Staff/PickupRental/RentalDetailPage";
import { RecordReturnPage } from "../pages/Staff/PickupRental/RecordReturnPage";
import { PickupRentalPage } from "../pages/Staff/PickupRental/PickupRentalPage";

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
          path={config.managerRoutes.manageOrder}
          element={<ManageOrderPage />}
        />
        <Route
          path={config.managerRoutes.workAssignment}
          element={<WorkAssignmentSchedulePage />}
        />
        <Route
          path={config.managerRoutes.customerChat}
          element={<ChatWithCustomerPage />}
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
          path={config.managerRoutes.feedbackManagement}
          element={<FeedbackManagementPage />}
        />
        <Route
          path={config.managerRoutes.manageReplacement}
          element={<ManageReplacementPage />}
        />
        <Route
          path={config.managerRoutes.rentalDashboard}
          element={<ManagerRentalReturnPage />}
        />
        <Route
          path={config.managerRoutes.unassignedPickups}
          element={<UnassignedPickupsPage />}
        />
        <Route
          path={config.managerRoutes.currentAssignments}
          element={<CurrentAssignmentsPage />}
        />
        <Route
          path={config.managerRoutes.rentalHistory}
          element={<RentalHistoryPage />}
        />
        <Route
          path={config.managerRoutes.calculateLateFee}
          element={<LateFeeCalculatorPage />}
        />
        <Route
          path={config.managerRoutes.adjustReturnDate}
          element={<ReturnDateAdjustmentPage />}
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

      <Route
        key="layoutStaff"
        path={config.managerRoutes.home}
        element={<ManagerLayout />}
      >
        <Route
          path={config.staffRoutes.depositConfirmation}
          element={<DepositConfirmationPage />}
        />
        <Route
          path={config.staffRoutes.paymentManagement}
          element={<PaymentManagementPage />}
        />
        <Route
          path={config.staffRoutes.checkDeviceAfterReturn}
          element={<CheckDeviceAfterReturnPage />}
        />
        <Route
          path={config.staffRoutes.assignOrder}
          element={<AssignOrderPage />}
        />
        <Route
          path={config.staffRoutes.orderHistory}
          element={<OrderHistoryPage />}
        />
        <Route
          path={config.staffRoutes.proofOfDelivery}
          element={<ProofOfDeliveryPage />}
        />
        <Route
          path={config.staffRoutes.rentalDetail}
          element={<RentalDetailPage />}
        />
        <Route
          path={config.staffRoutes.recordReturn}
          element={<RecordReturnPage />}
        />
        <Route
          path={config.staffRoutes.pickupRental}
          element={<PickupRentalPage />}
        />
        {/* <Route
          path={config.staffRoutes.retrieveRentalEquipment}
          element={<RetrieveRentalEquipmentPage />}
        /> */}
      </Route>
    </Routes>
  );
};

export default AppRoute;
