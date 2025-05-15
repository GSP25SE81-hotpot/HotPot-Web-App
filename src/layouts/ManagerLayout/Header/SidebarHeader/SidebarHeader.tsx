import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
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
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../../../api/authAPI";
import LogoContainer from "../../../../components/Logo/Logo";
import useAuth from "../../../../hooks/useAuth";
import { menuItems } from "./MenuItems";
import NotificationCenter from "../../../../pages/Global/Notification/NotificationsPage";

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

          {/* Notification Center Component */}
          <Box sx={{ mr: 2 }}>
            <NotificationCenter userId={userData?.id} />
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
