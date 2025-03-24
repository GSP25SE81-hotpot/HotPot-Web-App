export const routes = {
  home: "/",
};

export const authRoute = {
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
