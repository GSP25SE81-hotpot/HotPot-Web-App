import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoContainer from "../../../../components/Logo/Logo";

// Icons
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EngineeringIcon from "@mui/icons-material/Engineering";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FeedbackIcon from "@mui/icons-material/Feedback";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaymentIcon from "@mui/icons-material/Payment";
import PersonIcon from "@mui/icons-material/Person";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import { managerRoutes } from "../../../../configs/routes";

export const drawerWidth = 280;

interface SidebarHeaderProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
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

  // Notification state
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);

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
  const [notifications] = useState([
    {
      id: 1,
      message: "New order #123 received",
      time: "5 min ago",
      read: false,
    },
    {
      id: 2,
      message: "Equipment HP-001 maintenance due",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      message: "Customer feedback received",
      time: "2 hours ago",
      read: true,
    },
  ]);
  const [unreadCount] = useState(2);

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
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
      route: managerRoutes.assignOrder,
    },
    {
      id: "FE-05",
      text: "Manage Orders",
      icon: <InventoryIcon />,
      route: managerRoutes.manageOrder,
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
      route: managerRoutes.retrieveRentalEquipment,
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

          {/* Notification section */}
          <Box sx={{ mr: 2 }}>
            <IconButton
              color="inherit"
              onClick={handleNotificationOpen}
              sx={{
                position: "relative",
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <NotificationsIcon />
              {unreadCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    backgroundColor: "error.main",
                    color: "white",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    boxShadow: "0 0 0 2px #fff",
                  }}
                >
                  {unreadCount}
                </Box>
              )}
            </IconButton>
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              PaperProps={{
                elevation: 3,
                sx: {
                  width: 320,
                  maxHeight: 400,
                  overflowY: "auto",
                  borderRadius: 2,
                  mt: 1,
                  "& .MuiList-root": {
                    padding: 0,
                  },
                },
              }}
            >
              <Box
                sx={{
                  p: 2,
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, fontSize: "1rem" }}
                >
                  Notifications
                </Typography>
                {unreadCount > 0 && (
                  <Chip
                    size="small"
                    label={`${unreadCount} new`}
                    color="primary"
                    sx={{ height: 24 }}
                  />
                )}
              </Box>

              {notifications.length > 0 ? (
                <>
                  {notifications.map((notification: Notification) => (
                    <MenuItem
                      key={notification.id}
                      onClick={handleNotificationClose}
                      sx={{
                        py: 1.5,
                        px: 2,
                        borderBottom: 1,
                        borderColor: "divider",
                        backgroundColor: notification.read
                          ? "transparent"
                          : "action.hover",
                        "&:hover": {
                          backgroundColor: notification.read
                            ? "action.hover"
                            : "action.selected",
                        },
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      <Box sx={{ width: "100%" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: notification.read ? "normal" : "bold",
                              fontSize: "0.9rem",
                              lineHeight: 1.3,
                            }}
                          >
                            {notification.message}
                          </Typography>
                          {!notification.read && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                                ml: 1,
                                mt: 0.8,
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {notification.time}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                  <Box
                    sx={{
                      p: 1.5,
                      textAlign: "center",
                      borderTop: 1,
                      borderColor: "divider",
                      bgcolor: "background.default",
                    }}
                  >
                    <Button
                      color="primary"
                      size="small"
                      sx={{
                        fontWeight: 500,
                        textTransform: "none",
                        fontSize: "0.85rem",
                      }}
                    >
                      View All Notifications
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No notifications yet
                  </Typography>
                </Box>
              )}
            </Menu>
          </Box>

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
