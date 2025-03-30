import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { menuItems } from "../../../AdminLayout/Sidebar/MenuItems";
import LogoContainer from "../../../../components/Logo/Logo";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import useAuth from "../../../../hooks/useAuth";

export const drawerWidth = 280;
interface SidebarDrawerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}
const SidebarDrawer: React.FC<SidebarDrawerProps> = ({ open, setOpen }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { auth } = useAuth();

  const role = auth?.user?.role;
  console.log("role: ", role);
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
    navigate("/");
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
