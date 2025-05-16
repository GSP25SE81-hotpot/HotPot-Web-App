import { MessageNotice, AdminMessageNotice } from "./messages";
import { managerRoutes, adminRoutes, authRoutes, staffRoutes } from "./routes";
import { Vntext } from "./texts";

const config = {
  authRoutes,
  managerRoutes,
  adminRoutes,
  staffRoutes,
  MessageNotice,
  AdminMessageNotice,
  Vntext,
};

export default config;
