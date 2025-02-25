import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoContainer from "../../../../components/Logo/Logo";

// Icons
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { managerRoutes } from "../../../../configs/routes";

export const drawerWidth = 280;

interface SidebarHeaderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ open, setOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // State for menu categories
  const [openInventory, setOpenInventory] = useState(true);
  const [openOrders, setOpenOrders] = useState(true);
  const [openMaintenance, setOpenMaintenance] = useState(false);
  const [openReports, setOpenReports] = useState(false);

  // User menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(anchorEl);

  // Mock user data (replace with actual user data)
  const userData = {
    name: "Manager",
    role: "Store Manager",
    avatar: null, // URL to avatar image if available
  };

  // Use "temporary" drawer on mobile so it overlays the content
  const drawerVariant = isMobile ? "temporary" : "persistent";

  // Handle navigation
  const handleNavigation = (route: string) => {
    navigate(route);
    if (isMobile) setOpen(false);
  };

  // Handle user menu
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add logout logic here
    handleUserMenuClose();
    // navigate to login page
    navigate("/login");
  };

  // Menu categories
  const inventoryItems = [
    {
      id: "FE-02",
      text: "Equipment Stock Status",
      icon: <InventoryIcon />,
      route: managerRoutes.manageRentals,
    },
    {
      id: "FE-11",
      text: "Equipment Status Report",
      icon: <AssignmentIcon />,
      route: managerRoutes.equipmentStatusReport,
    },
  ];

  const orderItems = [
    {
      id: "FE-04",
      text: "View Assigned Orders",
      icon: <ReceiptIcon />,
      route: managerRoutes.manageOrders,
    },
    {
      id: "FE-05",
      text: "Manage Orders",
      icon: <InventoryIcon />,
      route: managerRoutes.deliveryOrder,
    },
    {
      id: "FE-13",
      text: "Order History",
      icon: <AssignmentIcon />,
      route: managerRoutes.orderHistory,
    },
  ];

  const maintenanceItems = [
    {
      id: "FE-09",
      text: "Resolve Equipment Failure",
      icon: <EngineeringIcon />,
      route: managerRoutes.resolveEquipmentFailure,
    },
    {
      id: "FE-10",
      text: "Equipment Condition Log",
      icon: <AssignmentIcon />,
      route: managerRoutes.equipmentConditionLog,
    },
    {
      id: "FE-15",
      text: "Replacement Management",
      icon: <SwapHorizIcon />,
      route: managerRoutes.manageReplacement,
    },
  ];

  const reportItems = [
    {
      id: "FE-12",
      text: "View Feedback",
      icon: <FeedbackIcon />,
      route: managerRoutes.feedbackManagement,
    },
    {
      id: "FE-14",
      text: "Work Schedule",
      icon: <ScheduleIcon />,
      route: managerRoutes.workAssignment,
    },
  ];

  const paymentItems = [
    {
      id: "FE-06",
      text: "Confirm Deposits",
      icon: <PaymentIcon />,
      route: managerRoutes.depositConfirmation,
    },
    {
      id: "FE-07",
      text: "Manage Payment",
      icon: <PaymentIcon />,
      route: managerRoutes.paymentManagement,
    },
  ];

  const customerItems = [
    {
      id: "FE-03",
      text: "Retrieve Rental Equipment",
      icon: <InventoryIcon />,
      route: managerRoutes.checkDevice,
    },
    {
      id: "FE-08",
      text: "Chat with Customer",
      icon: <SupportAgentIcon />,
      route: managerRoutes.customerChat,
    },
  ];

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

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              "& > *": { transform: "scale(1.2)" }, // Make logo bigger
            }}
          >
            <LogoContainer />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* User profile section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Chip
              avatar={
                userData.avatar ? (
                  <Avatar alt={userData.name} src={userData.avatar} />
                ) : (
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                )
              }
              label={userData.name}
              onClick={handleUserMenuOpen}
              sx={{
                height: 40,
                borderRadius: 20,
                "& .MuiChip-label": {
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  pr: 1,
                },
              }}
            />
            <Menu
              anchorEl={anchorEl}
              open={userMenuOpen}
              onClose={handleUserMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
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

        {/* User welcome section */}
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              margin: "0 auto",
              bgcolor: theme.palette.primary.main,
            }}
          >
            <Typography variant="h4">{userData.name.charAt(0)}</Typography>
          </Avatar>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            Welcome, {userData.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userData.role}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <List component="nav" sx={{ px: 1 }}>
          {/* Dashboard */}
          <ListItemButton onClick={() => handleNavigation(managerRoutes.home)}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <Divider sx={{ my: 1 }} />

          {/* Inventory Category */}
          <ListItemButton onClick={() => setOpenInventory(!openInventory)}>
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Inventory Management" />
            {openInventory ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openInventory} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {inventoryItems.map((item) => (
                <ListItemButton
                  key={item.id}
                  sx={{ pl: 4 }}
                  onClick={() => handleNavigation(item.route)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          {/* Orders Category */}
          <ListItemButton onClick={() => setOpenOrders(!openOrders)}>
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Order Management" />
            {openOrders ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openOrders} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {orderItems.map((item) => (
                <ListItemButton
                  key={item.id}
                  sx={{ pl: 4 }}
                  onClick={() => handleNavigation(item.route)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          {/* Maintenance Category */}
          <ListItemButton onClick={() => setOpenMaintenance(!openMaintenance)}>
            <ListItemIcon>
              <EngineeringIcon />
            </ListItemIcon>
            <ListItemText primary="Maintenance" />
            {openMaintenance ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openMaintenance} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {maintenanceItems.map((item) => (
                <ListItemButton
                  key={item.id}
                  sx={{ pl: 4 }}
                  onClick={() => handleNavigation(item.route)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          {/* Customer Service */}
          <ListItemButton onClick={() => setOpenReports(!openReports)}>
            <ListItemIcon>
              <SupportAgentIcon />
            </ListItemIcon>
            <ListItemText primary="Customer Service" />
            {openReports ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openReports} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {customerItems.map((item) => (
                <ListItemButton
                  key={item.id}
                  sx={{ pl: 4 }}
                  onClick={() => handleNavigation(item.route)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>

          <Divider sx={{ my: 1 }} />

          {/* Payment Items */}
          {paymentItems.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => handleNavigation(item.route)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}

          <Divider sx={{ my: 1 }} />

          {/* Reports and Schedules */}
          {reportItems.map((item) => (
            <ListItemButton
              key={item.id}
              onClick={() => handleNavigation(item.route)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default SidebarHeader;
