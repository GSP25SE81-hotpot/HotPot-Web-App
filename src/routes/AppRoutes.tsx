import React from "react";
import { Route, Routes } from "react-router-dom";
import config from "../configs";
// import Home from "../pages/Home/HomePage";

import HotpotComboDetailPage from "../pages/Admin/ComboDetail/HotpotComboDetailPage";
import CreateComboPage from "../pages/Admin/Combohotpot/CreateComboPage";
import CreateHotpotPage from "../pages/Admin/CreateHotpot/CreateHotpotPage";
import CreateIngredientsPage from "../pages/Admin/CreateIngredients/CreateIngredientsPage";
import DashboardPage from "../pages/Admin/Dashboard/DashboardPage";
import FeedbackDetailPage from "../pages/Admin/Feedback/FeedbackDetailPage";
import FeedbackPage from "../pages/Admin/Feedback/FeedbackPage";
import OrderPage from "../pages/Admin/ManageOrder/OrderPage";
import ManageUserPage from "../pages/Admin/ManageUser/ManageUserPage";
import TableHotpotComboPage from "../pages/Admin/TableCombo/TableHotpoComboPage";
import TableIngredientTypePage from "../pages/Admin/TableIngredientType/TableIngredientTypePage";
import TableIngredientsPage from "../pages/Admin/TableIngredients/TableIngredientsPage";
import TableHotpotPage from "../pages/Admin/Tablehotpot/TableHotpotPage";
import { AuthenticatePage } from "../pages/Global/Authenticate/SignIn";
import { ChatWithCustomerPage } from "../pages/Manager/ChatWithCustomer/ChatWithCustomerPage";
import { EquipmentConditionLogPage } from "../pages/Manager/EquipmentConditionLog/EquipmentConditionLogPage";
import { FeedbackManagementPage } from "../pages/Manager/FeedbackManagement/FeedbackManagementPage";
import { ManageReplacementPage } from "../pages/Manager/ManageReplacement/ManageReplacementPage";
import { CheckDeviceAfterReturnPage } from "../pages/Staff/CheckDeviceAfterReturn/CheckDeviceAfterReturnPage";
import { OrderHistoryPage } from "../pages/Staff/OrderHistory/OrderHistoryPage";
import { PaymentManagementPage } from "../pages/Staff/PaymentManagement/PaymentManagementPage";

// import CheckRoute from "./CheckRoute";
// import RequireAuth from "./RequireAuth";
// import { Role } from "./Roles";
import OrderDetail from "../containers/ManageOrder/SubPage/OrderDetail";
import ManagerLayout from "../layouts/ManagerLayout/ManagerLayout";
import TableHotpotDetailPage from "../pages/Admin/TableHotpotDetail/TableHotpotDetailPage";
import TableMaintenanceHotpotDetailPage from "../pages/Admin/TableMaintenanceHotpot/TableMaintenanceHopotPage";
import NotificationsPage from "../pages/Global/Notification/NotificationsPage";
import { EquipmentConditionDetailPage } from "../pages/Manager/EquipmentConditionLog/EquipmentConditionDetailPage";
import { LowStockUtensilsPage } from "../pages/Manager/ManageEquipmentStock/LowStockUtensilsPage";
import { ManageEquipmentStockPage } from "../pages/Manager/ManageEquipmentStock/ManageEquipmentStockPage";
import { ManageOrderPage } from "../pages/Manager/ManageOrder/ManageOrderPage";
import { OrderDetailViewPage } from "../pages/Manager/ManageOrder/OrderDetailViewPage";
import { CurrentAssignmentsPage } from "../pages/Manager/ManagerRentalReturnPage/CurrentAssignmentsPage";
import { LateFeeCalculatorPage } from "../pages/Manager/ManagerRentalReturnPage/LateFeeCalculatorPage";
import { ManagerRentalReturnPage } from "../pages/Manager/ManagerRentalReturnPage/ManagerRentalReturnPage";
import { RentalHistoryPage } from "../pages/Manager/ManagerRentalReturnPage/RentalHistoryPage";
import { ReturnDateAdjustmentPage } from "../pages/Manager/ManagerRentalReturnPage/ReturnDateAdjustmentPage";
import { UnassignedPickupsPage } from "../pages/Manager/ManagerRentalReturnPage/UnassignedPickupsPage";
import StaffAssignmentPage from "../pages/Manager/WorkAssignmentSchedule/StaffAssignmentPage";
import WorkAssignmentSchedulePage from "../pages/Manager/WorkAssignmentSchedule/WorkAssignmentSchedulePage";
import { AssignOrderPage } from "../pages/Staff/AssignOrder/AssignOrderPage";
import { AssignmentDetailPage } from "../pages/Staff/ManageAssignemt/AssignmetDetailPage";
import { ManageAssignmentStaffPage } from "../pages/Staff/ManageAssignemt/ManageAssigmentStaffPage";
import { PickupRentalPage } from "../pages/Staff/PickupRental/PickupRentalPage";
import { RecordReturnPage } from "../pages/Staff/PickupRental/RecordReturnPage";
import { RentalDetailPage } from "../pages/Staff/PickupRental/RentalDetailPage";
import { ProofOfDeliveryPage } from "../pages/Staff/ProofOfDelivery/ProofOfDeliveryPage";
import ShippingListPage from "../pages/Staff/Shipping/ShippingListPage";
import { ManageVehiclePage } from "../pages/Manager/ManageVehicle/ManageVehiclePage";
import { EquipmentAvailabilityPage } from "../pages/Manager/ManageEquipmentStock/EquipmentAvailabilityPage";

const AppRoute: React.FC = () => {
  return (
    <Routes>
      <Route
        key={"Login"}
        path={config.managerRoutes.home}
        element={<AuthenticatePage />}
      />
      <Route
        key={"Notification"}
        path={config.authRoutes.notification}
        element={<NotificationsPage />}
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
        <Route
          path={config.managerRoutes.manageVehicle}
          element={<ManageVehiclePage />}
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

      <Route
        key="layoutStaff"
        path={config.managerRoutes.home}
        element={<ManagerLayout />}
      >
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
          path={config.staffRoutes.shippingOrder}
          element={<ShippingListPage />}
        />
        {/* <Route
          path={config.staffRoutes.retrieveRentalEquipment}
          element={<RetrieveRentalEquipmentPage />}
        /> */}

        <Route
          path={config.staffRoutes.staffMyAssignment}
          element={<ManageAssignmentStaffPage />}
        />
        <Route
          key={"detailAssignment"}
          path={config.staffRoutes.staffMyAssignmentDetail}
          element={<AssignmentDetailPage />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoute;
