export const managerRoutes = {
  home: "/",
  manageEquipmentStock: "/manage-equipment-stock",
  equipmentAvailability: "/equipment-availability",
  lowStockUtensil: "/low-stock-utensil",
  workAssignment: "/work-assignment",
  manageOrder: "/manage-order",
  customerChat: "/chat",
  feedback: "/feedback",
  resolveEquipmentFailure: "/resolve-equipment-failure",
  equipmentConditionLog: "/equipment-condition-log",
  equipmentStatusReport: "/equipment-status-report",
  feedbackManagement: "/feedback-management",
  manageReplacement: "/manage-replacement",
  rentalDashboard: "/rental-dashboard",
  unassignedPickups: "/unassigned-pickups",
  currentAssignments: "/current-assignments",
  rentalHistory: "/rental-history",
  calculateLateFee: "/calculate-late-fee",
  adjustReturnDate: "/adjust-return-date",
  orderDetail: "/orders/:orderId",
};

export const authRoutes = {
  authenticate: "/auth",
};

export const adminRoutes = {
  dashboard: "/dashboard",
  orders: "/dashboard/orders",
  feedbackDetail: "/dashboard/feedback/:id",
  feedback: "/dashboard/feedback",
  tableHotPotCombo: "/dashboard/hotpotCombo",
  createHotPotCombo: "/dashboard/createCombo",
  profile: "/profile",
  createIngredients: "/dashboard/createIngredients",
  manageUsers: "/dashboard/listUsers",
  manageIngredients: "/dashboard/listIngredients",
  hotpotType: "/dashboard/hotpot",
  addHotpot: "/dashboard/addHotpot",
  HotpotDetail: "/dashboard/hotpotCombo/detail/:comboId",
};

export const staffRoutes = {
  paymentManagement: "/payment-management",
  depositConfirmation: "/deposit-confirmation",
  retrieveRentalEquipment: "/retrieve-rental-equipment",
  checkDeviceAfterReturn: "/check-device-after-return",
  orderHistory: "/order-history",
  assignOrder: "/assign-order",
  proofOfDelivery: "/proof-of-delivery",
  rentalDetail: "/staff/rentals/:id",
  recordReturn: "/staff/rentals/record-return",
  pickupRental: "/pickup-rental",
};
