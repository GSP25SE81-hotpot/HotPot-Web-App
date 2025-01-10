import { Link } from "react-router-dom";
import {
  PieChartOutlined,
  UserOutlined,
  ShoppingOutlined,
  ContainerOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EngineeringIcon from "@mui/icons-material/Engineering";
import config from "../../../../configs";
import Iconify from "../../../../components/Iconify";
import { RoleType } from "../../../../models/UserData";
import { CustomMenuItem } from "../../../../models/MenuSidebar";

const AccessType = {
  MANAGER_SALE: [RoleType.MANAGER, RoleType.SALE],
  ALL_ACCESS: [RoleType.MANAGER, RoleType.ADMIN, RoleType.SALE],
  ADMIN_MANAGER_ACCESS: [RoleType.MANAGER, RoleType.ADMIN],
  ADMIN_ACCESS: [RoleType.ADMIN],
  MANGER_ACCESS: [RoleType.MANAGER],
};

const MenuSideBars: CustomMenuItem[] = [
  {
    label: <Link to={config.adminRoutes.dashboard}>Thống kê</Link>,
    key: config.adminRoutes.dashboard,
    icon: <PieChartOutlined />,
    roles: AccessType.ADMIN_MANAGER_ACCESS,
  },
  {
    label: <Link to={config.adminRoutes.user}>Người dùng</Link>,
    key: config.adminRoutes.user,
    icon: <UserOutlined />,
    roles: AccessType.ALL_ACCESS,
  },
  {
    label: "Sản phẩm",
    key: "products",
    icon: <ShoppingOutlined />,
    roles: AccessType.MANAGER_SALE,
    children: [
      {
        label: <Link to={config.adminRoutes.product}>Tất cả máy</Link>,
        key: config.adminRoutes.product,
        roles: AccessType.MANGER_ACCESS,
      },
      {
        label: <Link to={config.adminRoutes.createProduct}>Thêm sản phẩm</Link>,
        key: config.adminRoutes.createProduct,
        roles: AccessType.MANGER_ACCESS,
      },
      {
        label: (
          <Link to={config.adminRoutes.viewMachineComponent}>
            Tất cả chi tiết máy
          </Link>
        ),
        key: config.adminRoutes.viewMachineComponent,
        roles: AccessType.MANGER_ACCESS,
      },
      {
        label: (
          <Link to={config.adminRoutes.createMachineComponent}>
            Tạo mới chi tiết máy
          </Link>
        ),
        key: config.adminRoutes.createMachineComponent,
        roles: AccessType.MANGER_ACCESS,
      },
      {
        label: <Link to={config.adminRoutes.category}>Loại máy</Link>,
        key: config.adminRoutes.category,
        roles: AccessType.MANGER_ACCESS,
      },
      {
        label: <Link to={config.adminRoutes.brand}>Thương hiệu</Link>,
        key: config.adminRoutes.brand,
        roles: AccessType.MANGER_ACCESS,
      },
      {
        label: <Link to={config.adminRoutes.discount}>Giảm giá</Link>,
        key: config.adminRoutes.discount,
        roles: AccessType.ALL_ACCESS,
      },
    ],
  },

  {
    label: "Tin tức",
    key: "news",
    icon: <ContainerOutlined />,
    roles: AccessType.MANAGER_SALE,
    children: [
      {
        label: <Link to={config.adminRoutes.blogs}>Tất cả tin tức</Link>,
        key: config.adminRoutes.blogs,
        roles: AccessType.ALL_ACCESS,
      },
      {
        label: <Link to={config.adminRoutes.createNew}>Thêm mới tin tức</Link>,
        key: config.adminRoutes.createNew,
        roles: AccessType.ALL_ACCESS,
      },
      {
        label: (
          <Link to={config.adminRoutes.newsCategory}>Thể loại tin tức</Link>
        ),
        key: config.adminRoutes.newsCategory,
        roles: AccessType.ADMIN_MANAGER_ACCESS,
      },
    ],
  },
  {
    label: "Đơn hàng",
    key: "orders",
    icon: <ReceiptLongIcon />,
    roles: AccessType.MANGER_ACCESS,
    children: [
      {
        label: <Link to={config.adminRoutes.order}>Tất cả đơn hàng</Link>,
        key: config.adminRoutes.order,
        roles: AccessType.ADMIN_MANAGER_ACCESS,
      },
    ],
  },
  {
    label: "Bảo hành",
    key: "warranty",
    icon: <EngineeringIcon />,
    roles: AccessType.MANGER_ACCESS,
    children: [
      {
        label: (
          <Link to={config.adminRoutes.maintenance}>Bảo hành định kỳ</Link>
        ),
        key: config.adminRoutes.maintenance,
        roles: AccessType.ADMIN_MANAGER_ACCESS,
      },
      {
        label: (
          <Link to={config.adminRoutes.maintenanceRequest}>
            Yêu cầu bảo hành
          </Link>
        ),
        key: config.adminRoutes.maintenanceRequest,
        roles: AccessType.ADMIN_MANAGER_ACCESS,
      },
    ],
  },
  {
    label: <Link to={config.adminRoutes.rank}>Hạng mức</Link>,
    key: config.adminRoutes.rank,
    icon: <TransactionOutlined />,
    roles: AccessType.MANGER_ACCESS,
  },
  {
    label: <Link to={config.adminRoutes.task}>Nhiệm vụ</Link>,
    key: config.adminRoutes.task,
    icon: <Iconify icon={"mingcute:task-2-fill"} />,
    roles: AccessType.MANGER_ACCESS,
  },
  {
    label: <Link to={config.adminRoutes.transaction}>Giao dịch</Link>,
    key: config.adminRoutes.transaction,
    icon: <Iconify icon={"ant-design:transaction-outlined"} />,
    roles: AccessType.MANGER_ACCESS,
  },
];

export default MenuSideBars;
