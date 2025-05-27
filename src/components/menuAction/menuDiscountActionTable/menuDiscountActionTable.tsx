/* eslint-disable @typescript-eslint/no-explicit-any */
import InfoIcon from "@mui/icons-material/Info";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
// import { useNavigate } from "react-router";
// import config from "../../../configs";
import { Delete, Update } from "@mui/icons-material";

interface MenuActionTableDiscountProps {
  discountData: any;
  onOpenUpdate?: any;
  onOpenDetail?: any;
  onOpenDelete?: any;
  fetchData?: () => void;
}

const MenuActionTableDiscount: React.FC<MenuActionTableDiscountProps> = () => {
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  // const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ width: "20px" }}
      >
        <MoreHorizIcon
          sx={{
            color: "#6464CD",
          }}
        />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem>
          <InfoIcon sx={{ mr: "4px" }} color="success" />
          <span>Chi Tiết</span>
        </MenuItem>
        <MenuItem>
          <Update sx={{ mr: "4px" }} color="info" />
          <span>Cập nhật</span>
        </MenuItem>
        <MenuItem>
          <Delete sx={{ mr: "4px" }} color="error" />
          <span>Xóa</span>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default MenuActionTableDiscount;
