import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  MenuOpen as MenuOpenIcon,
} from "@mui/icons-material";
import classNames from "classnames/bind";
import styles from "./Navbar.module.scss";
import { Link, useNavigate } from "react-router-dom";
import Logout from "@mui/icons-material/Logout";
import config from "../../../configs";
import useAuth from "../../../hooks/useAuth";

interface NavbarProps {
  onMenuClick?: () => void;
  isSidebarCollapsed: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, isSidebarCollapsed }) => {
  const cx = classNames.bind(styles);

  const jsonString = localStorage.getItem("userInfor");
  const user = JSON.parse(jsonString || "{}");
  const [name, setName] = React.useState(
    user?.data?.fullName ? user?.data?.fullName : "U"
  );

  const { setAuth } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfor");
    setAuth(null);
    navigate(config.authRoutes.authenticate);
  };

  const open = Boolean(anchorEl);

  const setAbrevName = () => {
    const temp = name.substring(0, 1) || "";
    setName(temp);
  };

  React.useEffect(() => {
    setAbrevName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={4}
      className={cx("navbar")}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          {!isSidebarCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>

        <Box className={cx("search-wrapper")}>
          <SearchIcon className={cx("search-icon")} />
          <InputBase
            placeholder="Search..."
            className={cx("search-input")}
            inputProps={{ "aria-label": "search" }}
          />
        </Box>

        <Box className={cx("navbar-actions")}>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar className={cx("user-avatar")}>{name}</Avatar>
          </IconButton>
        </Box>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        sx={{
          padding: "10px",
          overflow: "visible",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 20,
            ml: -0.5,
            mr: 1,
            zIndex: 1,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Link
            to={config.adminRoutes.profile}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Thông tin cá nhân
          </Link>
        </MenuItem>
        <Divider />
        {/* <MenuItem sx={{ color: "red" }} onClick={() => handleLogout()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem> */}
        <Button onClick={() => handleLogout()} sx={{ color: "red" }}>
          Đằng xuất
        </Button>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
