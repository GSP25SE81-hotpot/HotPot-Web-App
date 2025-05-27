import {
  Assignment as AssignmentIcon,
  // Notifications as NotificationIcon,
  // Assessment as ReportIcon,
  ReceiptLong as BatchIcon,
  Chat as ChatIcon,
  Dashboard as DashboardIcon,
  Discount,
  Build as EquipmentIcon,
  Feedback,
  Restaurant as HotpotIcon,
  SetMeal as IngredientIcon,
  Inventory as InventoryIcon,
  Engineering as MaintenanceIcon,
  // ListAlt as ListAltIcon,
  ShoppingCart as OrderIcon,
  Payment as PaymentIcon,
  People as PeopleIcon,
  LocalMall as PickupIcon,
  // AddShoppingCart as ImportIcon,
  EventAvailable as RentalIcon,
  EventNote as ScheduleIcon,
  LocalShipping as ShippingIcon,
  TakeoutDining as TakeoutDiningIcon,
  DirectionsCar as VehicleIcon,
} from "@mui/icons-material";
// import Iconify from "../../../../components/Iconify";
import AssessmentIcon from "@mui/icons-material/Assessment";
import config from "../../../../configs";
import { managerRoutes, staffRoutes } from "../../../../configs/routes";
import { Role } from "../../../../routes/Roles";
import { MenuItemLayout } from "../../../../types/menu";

export const menuItems: MenuItemLayout[] = [
  {
    role: "Admin",
    menu: [
      {
        icon: <DashboardIcon />,
        label: config.Vntext.SideBar.Dashboard,
        path: config.adminRoutes.dashboard,
      },
      {
        icon: <OrderIcon />,
        label: config.Vntext.SideBar.Ordes,
        path: config.adminRoutes.orders,
      },
      {
        icon: <PeopleIcon />,
        label: config.Vntext.SideBar.Users,
        path: "#",
        children: [
          { label: "Danh sách", path: config.adminRoutes.manageUsers },
        ],
      },
      {
        icon: <HotpotIcon />,
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
        icon: <BatchIcon />,
        label: "Quản lí nhập hàng",
        path: "#",
        children: [
          {
            label: "Quản lí lô hàng",
            path: config.adminRoutes.manageBatch,
          },
          {
            label: "Nhập hàng",
            path: config.adminRoutes.importProduct,
          },
        ],
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
      {
        icon: <DashboardIcon />,
        label: config.Vntext.SideBar.Dashboard,
        path: config.adminRoutes.dashboard,
      },
      {
        label: "Quản lý kho",
        icon: <InventoryIcon />,
        path: "#",
        children: [
          {
            label: "Quản lý nồi",
            icon: <TakeoutDiningIcon />,
            path: managerRoutes.equipmentAvailability,
          },
          {
            label: "Quản lý nguyên liệu",
            icon: <IngredientIcon />,
            path: config.adminRoutes.manageIngredients,
          },
        ],
      },
      {
        label: "Quản lý đơn hàng",
        icon: <OrderIcon />,
        path: "#",
        children: [
          {
            label: "Quản lý giao hàng",
            icon: <ShippingIcon />,
            path: managerRoutes.manageOrder,
          },
          {
            label: "Quản lý trả hàng",
            icon: <RentalIcon />,
            path: managerRoutes.rentalDashboard,
          },
        ],
      },
      {
        label: "Bảo trì",
        icon: <MaintenanceIcon />,
        path: "#",
        children: [
          {
            label: "Danh sách bảo trì thiết bị",
            icon: <EquipmentIcon />,
            path: managerRoutes.equipmentConditionLog,
          },
          {
            label: "Quản lý xe",
            icon: <VehicleIcon />,
            path: managerRoutes.manageVehicle,
          },
        ],
      },
      {
        label: "Lịch làm việc",
        icon: <ScheduleIcon />,
        path: managerRoutes.workAssignment,
      },
      {
        label: "Xem phản hồi",
        icon: <Feedback />,
        path: managerRoutes.feedbackManagement,
      },
      {
        label: "Trò chuyện với khách hàng",
        icon: <ChatIcon />,
        path: managerRoutes.customerChat,
      },
      {
        label: "Lịch sử phân công nhân viên",
        icon: <AssignmentIcon />,
        path: managerRoutes.staffAssignmentHistory,
      },
      {
        label: "Lịch sử đơn hàng",
        icon: <AssignmentIcon />,
        path: staffRoutes.orderHistory,
      },
      {
        label: "Lịch sử phân công nhân viên",
        icon: <PaymentIcon />,
        path: managerRoutes.staffAssignmentHistory,
      },
    ],
  },
  {
    role: Role.Staff,
    menu: [
      {
        icon: <AssignmentIcon />,
        label: config.Vntext.SideBar.Ordes,
        path: staffRoutes.assignOrder,
      },
      {
        label: config.Vntext.SideBar.shippingList,
        icon: <ShippingIcon />,
        path: staffRoutes.shippingOrder,
      },
      {
        label: "In hóa đơn",
        icon: <PaymentIcon />,
        path: staffRoutes.paymentManagement,
      },
      {
        label: "Lấy thiết bị thuê",
        icon: <PickupIcon />,
        path: staffRoutes.pickupRental,
      },
      {
        label: "Lịch làm việc",
        icon: <ScheduleIcon />,
        path: managerRoutes.workAssignment,
      },
    ],
  },
];
