export const managerRoutes = {
  home: "/",
  manageRentals: "/manage-rentals",
  manageRentalStatus: "/manage-rental-status",
  equipmentAvailability: "/equipment-availability",
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
};

export const authRoutes = {
  authenticate: "/auth",
};

export const adminRoutes = {
  dashboard: "/dashboard",
  feedbackDetail: "/dashboard/feedback/:id",
  feedback: "/dashboard/feedback",
  tableHotPotCombo: "/dashboard/hotpotCombo",
  createHotPotCombo: "/dashboard/createCombo",
  profile: "/profile",
  tableIngredients: "/dashboard/ingredients",
  createIngredients: "/dashboard/createIngredients",
  manageUsers: "/dashboard/listUsers",
};

export const staffRoutes = {
  paymentManagement: "/payment-management",
  depositConfirmation: "/deposit-confirmation",
  retrieveRentalEquipment: "/retrieve-rental-equipment",
  orderHistory: "/order-history",
  assignOrder: "/assign-order",
  proofOfDelivery: "/proof-of-delivery",
};
