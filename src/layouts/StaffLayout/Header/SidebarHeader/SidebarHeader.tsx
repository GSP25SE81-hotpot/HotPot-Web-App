import AssignmentIcon from "@mui/icons-material/Assignment";
import BuildIcon from "@mui/icons-material/Build";
import ChatIcon from "@mui/icons-material/Chat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FeedbackIcon from "@mui/icons-material/Feedback";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MenuIcon from "@mui/icons-material/Menu";
import PaymentIcon from "@mui/icons-material/Payment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import LogoContainer from "../../../../components/Logo/Logo";
import { routes } from "../../../../configs/routes";

export const drawerWidth = 260;

interface SidebarHeaderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const features = [
  { id: "FE-01", text: "Login/Logout", icon: <HomeIcon />, route: routes.home },
  {
    id: "FE-02",
    text: "Rentals and Equipment Status",
    icon: <ListAltIcon />,
    route: routes.manageRentalStatus,
  },
  {
    id: "FE-03",
    text: "Check Device After Return",
    icon: <CheckCircleIcon />,
    route: routes.checkDevice,
  },
  {
    id: "FE-04",
    text: "Manage Order",
    icon: <ListAltIcon />,
    route: routes.manageOrders,
  },
  {
    id: "FE-05",
    text: "Deliver Order to Shipper",
    icon: <LocalShippingIcon />,
    route: routes.deliveryOrder,
  },
  {
    id: "FE-06",
    text: "Confirm Deposits",
    icon: <PaymentIcon />,
    route: routes.depositConfirmation,
  },
  {
    id: "FE-07",
    text: "Manage Payment",
    icon: <PaymentIcon />,
    route: routes.paymentManagement,
  },
  {
    id: "FE-08",
    text: "Chat with Customer",
    icon: <ChatIcon />,
    route: routes.customerChat,
  },
  {
    id: "FE-09",
    text: "Equipment Failure Reports",
    icon: <BuildIcon />,
    route: routes.repairRequests,
  },
  {
    id: "FE-10",
    text: "Log Equipment Conditions",
    icon: <AssignmentIcon />,
    route: routes.equipmentConditionLog,
  },
  {
    id: "FE-11",
    text: "Equipment stock status",
    icon: <AssignmentIcon />,
    route: routes.equipmentStatusReport,
  },
  {
    id: "FE-12",
    text: "View Feedback",
    icon: <FeedbackIcon />,
    route: routes.feedback,
  },
  {
    id: "FE-13",
    text: "View Order History",
    icon: <ListAltIcon />,
    route: routes.orderHistory,
  },
  {
    id: "FE-14",
    text: "Work Schedule",
    icon: <ScheduleIcon />,
    route: routes.workAssignment,
  },
];

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ open, setOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Use "temporary" drawer on mobile so it overlays the content
  const drawerVariant = isMobile ? "temporary" : "persistent";

  // Handle navigation
  const handleNavigation = (route: string) => {
    navigate(route);
    if (isMobile) setOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={4}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#ffffff",
          color: "#333",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(!open)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <LogoContainer />
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>

      <Drawer
        variant={drawerVariant}
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            paddingTop: 2,
          },
        }}
      >
        <Toolbar />
        <List>
          {features.map((feature) => (
            <ListItemButton
              key={feature.id}
              onClick={() => handleNavigation(feature.route)}
            >
              <ListItemIcon>{feature.icon}</ListItemIcon>
              <ListItemText primary={feature.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default SidebarHeader;
