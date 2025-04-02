import React from "react";
import { Route, Routes } from "react-router-dom";
import config from "../configs";
// import Home from "../pages/Home/HomePage";

import { ManageEquipmentStockPage } from "../pages/Manager/ManageEquipmentStock/ManageEquipmentStockPage";
import { EquipmentAvailabilityPage } from "../pages/Manager/ManageEquipmentStock/EquipmentAvailabilityPage";
import { CheckDeviceAfterReturnPage } from "../pages/Staff/CheckDeviceAfterReturn/CheckDeviceAfterReturnPage";
import { ChatWithCustomerPage } from "../pages/Manager/ChatWithCustomer/ChatWithCustomerPage";
import { DepositConfirmationPage } from "../pages/Staff/DepositConfirmation/DepositConfirmationPage";
import { PaymentManagementPage } from "../pages/Staff/PaymentManagement/PaymentManagementPage";
import { EquipmentConditionLogPage } from "../pages/Manager/EquipmentConditionLog/EquipmentConditionLogPage";
import { OrderHistoryPage } from "../pages/Staff/OrderHistory/OrderHistoryPage";
import { FeedbackManagementPage } from "../pages/Manager/FeedbackManagement/FeedbackManagementPage";
import FeedbackDetailPage from "../pages/Admin/Feedback/FeedbackDetailPage";
import FeedbackPage from "../pages/Admin/Feedback/FeedbackPage";
import CreateComboPage from "../pages/Admin/Combohotpot/CreateComboPage";
import CreateIngredientsPage from "../pages/Admin/CreateIngredients/CreateIngredientsPage";
import { ManageReplacementPage } from "../pages/Manager/ManageReplacement/ManageReplacementPage";
import ManageUserPage from "../pages/Admin/ManageUser/ManageUserPage";
import { AuthenticatePage } from "../pages/Global/Authenticate/SignIn";
import TableIngredientsPage from "../pages/Admin/TableIngredients/TableIngredientsPage";
import TableHotpotPage from "../pages/Admin/Tablehotpot/TableHotpotPage";
import TableHotpotComboPage from "../pages/Admin/TableCombo/TableHotpoComboPage";
import CreateHotpotPage from "../pages/Admin/CreateHotpot/CreateHotpotPage";
import DashboardPage from "../pages/Admin/Dashboard/DashboardPage";
import OrderPage from "../pages/Admin/ManageOrder/OrderPage";
import HotpotComboDetailPage from "../pages/Admin/ComboDetail/HotpotComboDetailPage";
import TableIngredientTypePage from "../pages/Admin/TableIngredientType/TableIngredientTypePage";

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
import ManagerLayout from "../layouts/ManagerLayout/ManagerLayout";
import OrderDetail from "../containers/ManageOrder/SubPage/OrderDetail";
import TableHotpotDetailPage from "../pages/Admin/TableHotpotDetail/TableHotpotDetailPage";
import TableMaintenanceHotpotDetailPage from "../pages/Admin/TableMaintenanceHotpot/TableMaintenanceHopotPage";
import { OrderDetailViewPage } from "../pages/Manager/ManageOrder/OrderDetailViewPage";
import { LowStockUtensilsPage } from "../pages/Manager/ManageEquipmentStock/LowStockUtensilsPage";
import { EquipmentConditionDetailPage } from "../pages/Manager/EquipmentConditionLog/EquipmentConditionDetailPage";
import StaffAssignmentPage from "../pages/Manager/WorkAssignmentSchedule/StaffAssignmentPage";
import { PickupReplacementPage } from "../pages/Staff/PickupReplacement/PickupReplacementPage";
import { ReplacementDetailPage } from "../pages/Staff/PickupReplacement/ReplacementDetailPage";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      <Route
        key={"Login"}
        path={config.managerRoutes.home}
        element={<AuthenticatePage />}
      />

      <Route key="layoutManager" element={<ManagerLayout />}>
        <Route
          path={config.managerRoutes.manageEquipmentStock}
          element={<ManageEquipmentStockPage />}
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
          path={config.managerRoutes.staffAssignment}
          element={<StaffAssignmentPage />}
        />
        <Route
          path={config.managerRoutes.customerChat}
          element={<ChatWithCustomerPage />}
        />
        <Route
          path={config.managerRoutes.equipmentConditionLog}
          element={<EquipmentConditionLogPage />}
        />
        <Route
          path={config.managerRoutes.equipmentConditionDetail}
          element={<EquipmentConditionDetailPage />}
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
        <Route
          path={config.managerRoutes.orderDetail}
          element={<OrderDetailViewPage />}
        />
        <Route
          path={config.managerRoutes.lowStockUtensil}
          element={<LowStockUtensilsPage />}
        />
      </Route>

      <Route
        key="layoutAdmin"
        path={config.adminRoutes.dashboard}
        element={<ManagerLayout />}
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
          key={"manageUser"}
          path={config.adminRoutes.manageUsers}
          element={<ManageUserPage />}
        />
        <Route
          key={"orderDetail"}
          path={config.adminRoutes.orderDetail}
          element={<OrderDetail />}
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

        <Route
          key="ingredientType"
          path={config.adminRoutes.ingredientType}
          element={<TableIngredientTypePage />}
        />
        <Route
          key="maintenanceHotpot"
          path={config.adminRoutes.MaintenanceHotpot}
          element={<TableMaintenanceHotpotDetailPage />}
        />
        <Route
          key="hotpotTypeDetail"
          path={config.adminRoutes.DetailHotpotType}
          element={<TableHotpotDetailPage />}
        />
      </Route>
      {/* <Route key="layout" path={config.routes.home} element={<StaffLayout />}>
        <Route key="home" path={config.routes.home} element={<Home />} />
      </Route> */}

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
        <Route
          path={config.staffRoutes.pickupReplacement}
          element={<PickupReplacementPage />}
        />
        <Route
          path={config.staffRoutes.replacementDetail}
          element={<ReplacementDetailPage />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoute;
