/* eslint-disable @typescript-eslint/no-explicit-any */
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import MaintenanceHotpotDetailModal from "../../../containers/ManageHotpotDetail/Modal/MaintenanceHotpotDetailModal";

interface MenuActionTableMaintenanceProps {
  hotpotData: any;
  onOpenUpdate?: any;
  onOpenDetail?: any;
  onOpenDelete?: any;
  onFetch?: () => void;
}

const MenuActionTableMaintenanceDetail: React.FC<
  MenuActionTableMaintenanceProps
> = ({ hotpotData, onOpenUpdate, onOpenDetail, onOpenDelete, onFetch }) => {
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [openDetail, setOpenDetail] = React.useState<boolean>(false);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleUpdate = () => {
    onOpenUpdate(hotpotData);
    setAnchorEl(null);
  };
  const handleDetail = () => {
    onOpenDetail(hotpotData);
    setOpenDetail(true);
    setAnchorEl(null);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handleDelete = () => {
    onOpenDelete(hotpotData);
    setAnchorEl(null);
  };

  const handleStatusUpdate = () => {
    if (onFetch) {
      onFetch();
    }
    handleCloseDetail();
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
        <MenuItem onClick={() => handleDetail()}>
          <InfoIcon sx={{ mr: "4px" }} color="info" />
          <span>Chi Tiết Bảo Trì</span>
        </MenuItem>
        <MenuItem onClick={() => handleUpdate()}>
          <EditIcon sx={{ mr: "4px", color: "#9ADE7B" }} />
          <span>Cập nhật</span>
        </MenuItem>

        <MenuItem onClick={() => handleDelete()}>
          <BlockIcon sx={{ mr: "4px" }} color="error" />
          <span>Xóa</span>
        </MenuItem>
      </Menu>

      {openDetail && (
        <MaintenanceHotpotDetailModal
          handleCloseModal={handleCloseDetail}
          hotpotData={hotpotData}
          open={openDetail}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default MenuActionTableMaintenanceDetail;
