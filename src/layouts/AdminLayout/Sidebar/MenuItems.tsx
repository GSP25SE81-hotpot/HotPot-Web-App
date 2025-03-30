import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EngineeringIcon from "@mui/icons-material/Engineering";
import FeedbackIcon from "@mui/icons-material/Feedback";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Iconify from "../../../components/Iconify";
import config from "../../../configs";
import { managerRoutes, staffRoutes } from "../../../configs/routes";
import { MenuItemLayout } from "../../../types/menu";

// const AccessType = {
//   MANAGER_SALE: [RoleTypes.MANAGER, RoleTypes.SALE],
//   ALL_ACCESS: [RoleTypes.MANAGER, RoleTypes.ADMIN, RoleTypes.SALE],
//   ADMIN_MANAGER_ACCESS: [RoleTypes.MANAGER, RoleTypes.ADMIN],
//   ADMIN_ACCESS: [RoleTypes.ADMIN],
//   MANGER_ACCESS: [RoleTypes.MANAGER],
// };

export const menuItems: MenuItemLayout[] = [
  {
    role: "Admin",
    menu: [
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
          {
            label: "Loại nguyên liệu",
            path: config.adminRoutes.ingredientType,
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
    ],
  },
  {
    role: "Manager",
    menu: [
      //dashboard
      {
        icon: <DashboardIcon />,
        label: config.Vntext.SideBar.Dashboard,
        path: managerRoutes.home,
        // role: AccessType.ADMIN_ACCESS,
      },
      //inventory
      {
        label: "Inventory Management",
        icon: <InventoryIcon />,
        path: "#",
        children: [
          {
            label: "Equipment Stock Status",
            icon: <InventoryIcon />,
            path: managerRoutes.manageRentals,
          },
          {
            label: "Equipment Status Report",
            icon: <AssignmentIcon />,
            path: managerRoutes.equipmentStatusReport,
          },
        ],
      },
      //order
      {
        label: "Order Management",
        icon: <ReceiptIcon />,
        path: "#",
        children: [
          {
            label: "View Assigned Orders",
            icon: <ReceiptIcon />,
            path: staffRoutes.assignOrder,
          },
          {
            label: "Manage Orders",
            icon: <InventoryIcon />,
            path: managerRoutes.manageOrder,
          },
          {
            label: "Order History",
            icon: <AssignmentIcon />,
            path: staffRoutes.orderHistory,
          },
        ],
      },
      //maintenance
      {
        label: "Maintenance",
        icon: <EngineeringIcon />,
        path: "#",
        children: [
          {
            label: "Resolve Equipment Failure",
            icon: <EngineeringIcon />,
            path: managerRoutes.resolveEquipmentFailure,
          },
          {
            label: "Equipment Condition Log",
            icon: <AssignmentIcon />,
            path: managerRoutes.equipmentConditionLog,
          },
          {
            label: "Replacement Management",
            icon: <SwapHorizIcon />,
            path: managerRoutes.manageReplacement,
          },
        ],
      },

      //report items
      {
        label: "Report",
        icon: <EngineeringIcon />,
        path: "#",
        children: [
          {
            label: "View Feedback",
            icon: <FeedbackIcon />,
            path: managerRoutes.feedbackManagement,
          },
          {
            label: "Work Schedule",
            icon: <ScheduleIcon />,
            path: managerRoutes.workAssignment,
          },
        ],
      },
      //payments
      {
        label: "Payment",
        icon: <EngineeringIcon />,
        path: "#",
        children: [
          {
            label: "Confirm Deposits",
            icon: <PaymentIcon />,
            path: staffRoutes.depositConfirmation,
          },
          {
            label: "Manage Payment",
            icon: <PaymentIcon />,
            path: staffRoutes.paymentManagement,
          },
        ],
      },
      //customer
      {
        label: "Customer Service",
        icon: <SupportAgentIcon />,
        path: "#",
        children: [
          {
            label: "Retrieve Rental Equipment",
            icon: <InventoryIcon />,
            path: staffRoutes.checkDeviceAfterReturn,
          },
          {
            label: "Manage Return Rental",
            icon: <InventoryIcon />,
            path: managerRoutes.rentalDashboard,
          },
          {
            label: "Chat with Customer",
            icon: <SupportAgentIcon />,
            path: managerRoutes.customerChat,
          },
        ],
      },
    ],
  },
];
