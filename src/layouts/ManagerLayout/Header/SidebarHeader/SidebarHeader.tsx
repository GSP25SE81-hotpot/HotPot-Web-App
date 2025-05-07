import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ErrorIcon from "@mui/icons-material/Error";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import SyncIcon from "@mui/icons-material/Sync";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import {
  AppBar,
  Avatar,
  Box,
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
  Badge,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../../../api/authAPI";
import LogoContainer from "../../../../components/Logo/Logo";
import { useNotifications } from "../../../../context/NotificationContext";
import useAuth from "../../../../hooks/useAuth";
import {
  ConnectionState,
  Notification,
  NotificationGroup,
  NotificationPriority,
} from "../../../../types/notifications";
import { menuItems } from "./MenuItems";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import EquipmentIcon from "@mui/icons-material/Handyman";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SystemUpdateIcon from "@mui/icons-material/SystemUpdate";
import config from "../../../../configs";

export const drawerWidth = 280;

interface SidebarDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarDrawer: React.FC<SidebarDrawerProps> = ({ open, setOpen }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { auth } = useAuth();
  const role = auth?.user?.role;

  // Get notifications from context
  const { notifications, connectionState, markAsRead, markAllAsRead } =
    useNotifications();

  // State for expanding/collapsing menu categories
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({});

  // User data (replace with actual user data)
  const userData = auth?.user;

  // Toggle category open/close
  const handleCategoryToggle = (label: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // User menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(anchorEl);
  const drawerVariant = isMobile ? "temporary" : "persistent";

  // Notification state
  const [notificationAnchorEl, setNotificationAnchorEl] =
    useState<null | HTMLElement>(null);

  // Add state for notification filtering
  const [selectedGroup, setSelectedGroup] = useState<NotificationGroup | "all">(
    "all"
  );
  const [selectedPriority, setSelectedPriority] = useState<
    NotificationPriority | "all"
  >("all");

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

  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem("userInfor");
      handleUserMenuClose();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // Calculate unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    // Use config.adminRoutes for navigation
    switch (notification.type) {
      case "ConditionIssue":
        // Equipment Condition Log Detail
        navigate(
          config.adminRoutes.MaintenanceHotpot.replace(
            ":id",
            notification.data.conditionLogId?.toString() || ""
          )
        );
        break;
      case "FeedbackResponse":
        // Feedback Management Detail
        navigate(
          config.adminRoutes.feedbackDetail +
            "/" +
            (notification.data.feedbackId || "")
        );
        break;
      case "ScheduleUpdate":
        navigate(config.adminRoutes.manageUsers);
        break;
      case "RentalNotification":
        navigate(config.adminRoutes.dashboard);
        break;
      case "ReplacementVerified":
      case "ReplacementCompleted":
        navigate(
          config.staffRoutes.replacementDetail +
            "/" +
            (notification.data.RequestId || "")
        );
        break;
      case "LowStock":
        navigate(config.adminRoutes.manageIngredients);
        break;
      case "UnavailableEquipment":
        navigate(config.adminRoutes.HotpotDetail);
        break;
      // Add more navigation cases as needed
      default:
        break;
    }
    handleNotificationClose();
  };

  const handleViewAllNotifications = () => {
    // Use config.adminRoutes or fallback to "/notifications"
    navigate(config.adminRoutes.dashboard);
    handleNotificationClose();
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffMs = now.getTime() - notificationTime.getTime();
    const diffMins = Math.round(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return notificationTime.toLocaleDateString();
  };

  // Get connection status icon
  const getConnectionStatusIcon = (state: ConnectionState) => {
    switch (state) {
      case "connected":
        return <WifiIcon fontSize="small" color="success" />;
      case "disconnected":
        return <WifiOffIcon fontSize="small" color="error" />;
      case "reconnecting":
        return <SyncIcon fontSize="small" color="warning" />;
      case "error":
        return <ErrorIcon fontSize="small" color="error" />;
      default:
        return <WifiOffIcon fontSize="small" />;
    }
  };

  // Get filtered notifications
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    if (selectedGroup !== "all") {
      filtered = filtered.filter((n) => n.group === selectedGroup);
    }
    if (selectedPriority !== "all") {
      filtered = filtered.filter((n) => n.priority === selectedPriority);
    }
    return filtered;
  };

  const getNotificationIcon = (group: NotificationGroup) => {
    switch (group) {
      case "equipment":
        return <EquipmentIcon fontSize="small" />;
      case "feedback":
        return <FeedbackIcon fontSize="small" />;
      case "rental":
        return <LocalShippingIcon fontSize="small" />;
      case "replacement":
        return <SwapHorizIcon fontSize="small" />;
      case "schedule":
        return <ScheduleIcon fontSize="small" />;
      case "system":
        return <SystemUpdateIcon fontSize="small" />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority): string => {
    switch (priority) {
      case "high":
        return "#f44336";
      case "medium":
        return "#ff9800";
      case "low":
        return "#4caf50";
    }
  };

  // Find menu items for the current user role
  const currentRoleMenuItems =
    menuItems.find((item) => item.role == role)?.menu || [];

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
              "& > *": { transform: "scale(1.2)" },
            }}
          >
            <LogoContainer />
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {/* Connection status indicator */}
          <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
            <Chip
              icon={getConnectionStatusIcon(connectionState)}
              label={
                connectionState.charAt(0).toUpperCase() +
                connectionState.slice(1)
              }
              size="small"
              color={
                connectionState === "connected"
                  ? "success"
                  : connectionState === "reconnecting"
                  ? "warning"
                  : "error"
              }
              variant="outlined"
            />
          </Box>
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
              <Badge
                badgeContent={unreadCount}
                color="error"
                overlap="circular"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              slotProps={{
                paper: {
                  elevation: 3,
                  sx: {
                    width: 350,
                    maxHeight: 500,
                    overflowY: "auto",
                    borderRadius: 2,
                    mt: 1,
                  },
                },
              }}
            >
              <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, fontSize: "1rem" }}
                  >
                    Notifications
                  </Typography>
                  {unreadCount > 0 && (
                    <Button
                      size="small"
                      variant="text"
                      onClick={handleMarkAllAsRead}
                      sx={{ fontSize: "0.75rem" }}
                    >
                      Mark all read
                    </Button>
                  )}
                </Box>
                {/* Filters */}
                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Box sx={{ minWidth: 120 }}>
                    <select
                      value={selectedGroup}
                      onChange={(e) =>
                        setSelectedGroup(
                          e.target.value as NotificationGroup | "all"
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <option value="all">All Types</option>
                      <option value="equipment">Equipment</option>
                      <option value="feedback">Feedback</option>
                      <option value="rental">Rental</option>
                      <option value="replacement">Replacement</option>
                      <option value="schedule">Schedule</option>
                      <option value="system">System</option>
                    </select>
                  </Box>
                  <Box sx={{ minWidth: 120 }}>
                    <select
                      value={selectedPriority}
                      onChange={(e) =>
                        setSelectedPriority(
                          e.target.value as NotificationPriority | "all"
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <option value="all">All Priorities</option>
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </Box>
                </Box>
              </Box>
              {/* Notification list */}
              {getFilteredNotifications().length > 0 ? (
                <>
                  {getFilteredNotifications().map((notification) => (
                    <MenuItem
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
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
                      }}
                    >
                      <Box sx={{ display: "flex", width: "100%" }}>
                        {/* Priority indicator */}
                        <Box
                          sx={{
                            width: 4,
                            borderRadius: 2,
                            bgcolor: getPriorityColor(notification.priority),
                            mr: 2,
                            alignSelf: "stretch",
                          }}
                        />
                        {/* Notification content */}
                        <Box sx={{ flexGrow: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 0.5,
                            }}
                          >
                            {getNotificationIcon(notification.group)}
                            <Typography
                              variant="body2"
                              sx={{
                                ml: 1,
                                fontWeight: notification.read
                                  ? "normal"
                                  : "bold",
                              }}
                            >
                              {notification.title}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {notification.message}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mt: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {formatTimestamp(notification.timestamp)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: getPriorityColor(notification.priority),
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              {notification.priority === "high" && (
                                <PriorityHighIcon sx={{ fontSize: 14 }} />
                              )}
                              {notification.priority.charAt(0).toUpperCase() +
                                notification.priority.slice(1)}
                            </Typography>
                          </Box>
                        </Box>
                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "primary.main",
                              ml: 1,
                              mt: 0.8,
                            }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                  <Box
                    sx={{
                      p: 1.5,
                      textAlign: "center",
                      borderTop: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Button
                      color="primary"
                      size="small"
                      onClick={handleViewAllNotifications}
                      sx={{ fontWeight: 500, textTransform: "none" }}
                    >
                      View All Notifications
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    No notifications found
                  </Typography>
                </Box>
              )}
            </Menu>
          </Box>
          {/* User profile section */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Chip
              avatar={
                userData?.avatar ? (
                  <Avatar alt={userData?.name} src={userData?.avatar} />
                ) : (
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                )
              }
              label={userData?.name}
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
            paddingTop: 12,
          },
        }}
      >
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
            <Typography variant="h4">{userData?.name?.charAt(0)}</Typography>
          </Avatar>
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            Xin chào, {userData?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {userData?.role}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <List component="nav" sx={{ px: 1 }}>
          {currentRoleMenuItems.map((menuItem, index) => {
            // If menu item has no children, render a simple list item
            if (!menuItem.children) {
              return (
                <ListItemButton
                  key={`${menuItem.label}-${index}`}
                  onClick={() =>
                    menuItem.path !== "#" && handleNavigation(menuItem.path)
                  }
                >
                  <ListItemIcon>{menuItem.icon}</ListItemIcon>
                  <ListItemText primary={menuItem.label} />
                </ListItemButton>
              );
            }
            // If menu item has children, render expandable category
            return (
              <React.Fragment key={`${menuItem.label}-${index}`}>
                <ListItemButton
                  onClick={() => handleCategoryToggle(menuItem.label)}
                >
                  <ListItemIcon>{menuItem.icon}</ListItemIcon>
                  <ListItemText primary={menuItem.label} />
                  {openCategories[menuItem.label] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItemButton>
                <Collapse
                  in={openCategories[menuItem.label]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {menuItem.children.map((childItem, childIndex) => (
                      <ListItemButton
                        key={`${childItem.label}-${childIndex}`}
                        sx={{ pl: 4 }}
                        onClick={() => handleNavigation(childItem.path)}
                      >
                        <ListItemIcon>
                          {childItem.icon || menuItem.icon}
                        </ListItemIcon>
                        <ListItemText primary={childItem.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};

export default SidebarDrawer;
