import {
  Dashboard as DashboardIcon,
  Discount,
  Feedback,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  TakeoutDining as TakeoutDiningIcon,
  SetMeal as IngredientIcon,
  ListAlt as ListAltIcon,
} from "@mui/icons-material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EngineeringIcon from "@mui/icons-material/Engineering";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import config from "../../../../configs";
import { managerRoutes, staffRoutes } from "../../../../configs/routes";
import { Role } from "../../../../routes/Roles";
import { MenuItemLayout } from "../../../../types/menu";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Iconify from "../../../../components/Iconify";

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
        icon: <AssessmentIcon />,
        label: "Nhập hàng",
        path: config.adminRoutes.importProduct,
        // role: AccessType.ADMIN_ACCESS,
      },
      {
        icon: <Discount />,
        label: config.Vntext.SideBar.discount,
        path: config.adminRoutes.discountManagement,
      },

      {
        icon: <Feedback />,
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
        path: config.adminRoutes.dashboard,
        // role: AccessType.ADMIN_ACCESS,
      },
      //inventory
      {
        label: "Quản lý kho",
        icon: <InventoryIcon />,
        path: "#",
        children: [
          {
            label: "Tình trạng thiết bị trong kho",
            icon: <InventoryIcon />,
            path: managerRoutes.manageEquipmentStock,
          },
        ],
      },
      //order
      {
        label: "Quản lý đơn hàng",
        icon: <ListAltIcon />,
        path: managerRoutes.manageOrder,
      },
      //maintenance
      {
        label: "Bảo trì",
        icon: <EngineeringIcon />,
        path: "#",
        children: [
          {
            label: "Danh sách bảo trì thiết bị",
            icon: <AssignmentIcon />,
            path: managerRoutes.equipmentConditionLog,
          },
          // {
          //   label: "Quản lý thay thế thiết bị",
          //   icon: <SwapHorizIcon />,
          //   path: managerRoutes.manageReplacement,
          // },
          {
            label: "Quản lý xe",
            icon: <SwapHorizIcon />,
            path: managerRoutes.manageVehicle,
          },
        ],
      },
      //report items
      {
        // label: "Báo cáo",
        // icon: <EngineeringIcon />,
        // path: "#",
        label: "Lịch làm việc",
        icon: <ScheduleIcon />,
        path: managerRoutes.workAssignment,
        // children: [
        //   {
        //     label: "Xem phản hồi",
        //     icon: <FeedbackIcon />,
        //     path: managerRoutes.feedbackManagement,
        //   },
        //   {
        //     label: "Lịch làm việc",
        //     icon: <ScheduleIcon />,
        //     path: managerRoutes.workAssignment,
        //   },
        // ],
      },
      {
        label: "Xem phản hồi",
        icon: <FeedbackIcon />,
        path: managerRoutes.feedbackManagement,
      },
      {
        label: "Dịch vụ khách hàng",
        icon: <SupportAgentIcon />,
        path: "#",
        children: [
          {
            label: "Quản lý trả thiết bị thuê",
            icon: <InventoryIcon />,
            path: managerRoutes.rentalDashboard,
          },
          {
            label: "Trò chuyện với khách hàng",
            icon: <SupportAgentIcon />,
            path: managerRoutes.customerChat,
          },
        ],
      },
    ],
  },
  {
    role: Role.Staff,
    menu: [
      //Assign Order
      {
        icon: <ListAltIcon />,
        label: config.Vntext.SideBar.Ordes,
        path: staffRoutes.assignOrder,
      },
      //Shipping List
      {
        label: config.Vntext.SideBar.shippingList,
        icon: <LocalShippingIcon />,
        path: staffRoutes.shippingOrder,
      },
      //dashboard
      {
        icon: <DashboardIcon />,
        label: "Công việc",
        path: config.staffRoutes.staffMyAssignment,
        // role: AccessType.ADMIN_ACCESS,
      },
      {
        label: "Quản lý thanh toán",
        icon: <PaymentIcon />,
        path: staffRoutes.paymentManagement,
      },
      // Rental Management
      {
        label: "Lấy thiết bị thuê",
        icon: <Iconify icon="mdi:package-variant-closed" />,
        path: staffRoutes.pickupRental,
      },
      // Order History
      {
        label: "Lịch sử đơn hàng",
        icon: <Iconify icon="mdi:history" />,
        path: staffRoutes.orderHistory,
      },
    ],
  },
];
