import Iconify from "../../../components/Iconify";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { MenuItem } from "../../../types/menu";
import { RoleTypes } from "../../../types/roles";
import config from "../../../configs";

const AccessType = {
  MANAGER_SALE: [RoleTypes.MANAGER, RoleTypes.SALE],
  ALL_ACCESS: [RoleTypes.MANAGER, RoleTypes.ADMIN, RoleTypes.SALE],
  ADMIN_MANAGER_ACCESS: [RoleTypes.MANAGER, RoleTypes.ADMIN],
  ADMIN_ACCESS: [RoleTypes.ADMIN],
  MANGER_ACCESS: [RoleTypes.MANAGER],
};

export const menuItems: MenuItem[] = [
  {
    icon: <DashboardIcon />,
    label: config.Vntext.SideBar.Dashboard,
    path: config.adminRoutes.dashboard,
    // role: AccessType.ADMIN_ACCESS,
  },
  {
    icon: <MenuBookIcon />,
    label: config.Vntext.SideBar.Ordes,
    path: config.adminRoutes.orders,
  },
  {
    icon: <PeopleIcon />,
    label: config.Vntext.SideBar.Users,
    path: "#",
    children: [
      { label: "Danh sách", path: config.adminRoutes.manageUsers },
      // { label: "Vị trí", path: "/users/roles" },
    ],
  },
  {
    icon: <InventoryIcon />,
    label: config.Vntext.SideBar.Hotpot.hotpotSidebar,
    path: "#",
    children: [
      {
        label: config.Vntext.SideBar.Hotpot.hotpotCombo,
        path: config.adminRoutes.tableHotPotCombo,
      },
      {
        label: config.Vntext.SideBar.Hotpot.hotpotIngredients,
        path: config.adminRoutes.manageIngredients,
      },
      {
        label: config.Vntext.SideBar.Hotpot.hotpot,
        path: config.adminRoutes.hotpotType,
      },
    ],
  },
  {
    icon: <SettingsIcon />,
    label: config.Vntext.SideBar.Settings,
    path: "/settings",
  },
  {
    icon: <Iconify icon={"ri:feedback-line"} />,
    label: config.Vntext.SideBar.Feedback,
    path: config.adminRoutes.feedback,
  },
];
