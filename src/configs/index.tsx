import { MessageNotice, AdminMessageNotice } from "./messages";
import { routes, adminRoutes, authRoute } from "./routes";
import { Vntext } from "./texts";

const config = {
  routes,
  authRoute,
  adminRoutes,
  MessageNotice,
  AdminMessageNotice,
  Vntext,
};

export default config;
