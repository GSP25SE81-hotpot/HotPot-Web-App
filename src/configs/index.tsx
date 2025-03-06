import { MessageNotice, AdminMessageNotice } from "./message";
import { managerRoutes, adminRoutes, authRoutes } from "./routes";
import { Vntext } from "./texts";

const config = {
  authRoutes,
  managerRoutes,
  adminRoutes,
  MessageNotice,
  AdminMessageNotice,
  Vntext,
};

export default config;
