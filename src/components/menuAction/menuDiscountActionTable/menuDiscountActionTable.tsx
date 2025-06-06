/* eslint-disable @typescript-eslint/no-explicit-any */
// import InfoIcon from "@mui/icons-material/Info";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import {
  Delete,
  // Update
} from "@mui/icons-material";

interface MenuActionTableDiscountProps {
  discountData: any;
  onOpenUpdate?: (data: any) => void;
  onOpenDetail?: (data: any) => void;
  onOpenDelete?: (data: any) => void;
  fetchData?: () => void;
}

const MenuActionTableDiscount: React.FC<MenuActionTableDiscountProps> = ({
  discountData,
  // onOpenUpdate,
  // onOpenDetail,
  onOpenDelete,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const handleDetailClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   onOpenDetail?.(discountData);
  //   handleClose();
  // };

  // const handleUpdateClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   onOpenUpdate?.(discountData);
  //   handleClose();
  // };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenDelete?.(discountData);
    handleClose();
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
        <MoreHorizIcon sx={{ color: "#6464CD" }} />
      </Button>
      <Menu
        id="demo-positioned-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {/* <MenuItem onClick={handleDetailClick}>
          <InfoIcon sx={{ mr: "4px" }} color="success" />
          <span>Chi Tiết</span>
        </MenuItem>
        <MenuItem onClick={handleUpdateClick}>
          <Update sx={{ mr: "4px" }} color="info" />
          <span>Cập nhật</span>
        </MenuItem> */}
        <MenuItem onClick={handleDeleteClick}>
          <Delete sx={{ mr: "4px" }} color="error" />
          <span>Xóa</span>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default MenuActionTableDiscount;
