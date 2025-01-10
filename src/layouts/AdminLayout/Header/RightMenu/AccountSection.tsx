import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Logout from "@mui/icons-material/Logout";
import config from "../../../../configs";
import { Typography } from "@mui/material";
import { useAuthContext } from "../../../../context/AuthContext";
import { RoleType } from "../../../../models/UserData";

const AccountSection = () => {
  const jsonString = localStorage.getItem("loginInfo");
  const user = JSON.parse(jsonString || "{}");
  const { setAuthUser, setRole } = useAuthContext();
  const [name, setName] = React.useState(
    user?.data?.fullName ? user?.data?.fullName : "U"
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("loginInfo");
    setAuthUser(null);
    setRole(null);
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const getRoleType = (role: RoleType) => {
    switch (role) {
      case RoleType.ADMIN:
        return "Quản trị viên";
      case RoleType.MANAGER:
        return "Quản lý";
      case RoleType.SALE:
        return "Nhân viên Bán hàng";
      case RoleType.TECHNICAL:
        return "Nhân viên kỹ thuật";
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography>
            {user?.data?.fullName ? user?.data?.fullName : ""}
          </Typography>
          <Typography sx={{ fontSize: "12px", color: "#95a5a6" }}>
            {getRoleType(user?.data?.role)}
          </Typography>
        </Box>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>{name}</Avatar>
        </IconButton>
      </Box>
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
        <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountSection;
