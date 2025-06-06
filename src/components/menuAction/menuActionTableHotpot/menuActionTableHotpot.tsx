/* eslint-disable @typescript-eslint/no-explicit-any */
import InfoIcon from "@mui/icons-material/Info";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import BlockIcon from "@mui/icons-material/Block";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import { useNavigate } from "react-router";
import config from "../../../configs";
import DeleteHotpotModal from "../../../containers/ManageHotpot/Modal/ModalDeleteHotpot";

interface MenuActionTableHotpotDetailProps {
  hotpotData: any;
  onOpenUpdate?: any;
  onOpenDetail?: any;
  onOpenDelete?: any;
  onFetch?: () => void;
}

const MenuActionTableHotpot: React.FC<MenuActionTableHotpotDetailProps> = ({
  hotpotData,
  onOpenDetail,
  onOpenDelete,
  onFetch,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [openDelete, setOpenDelete] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDetail = () => {
    onOpenDetail(hotpotData);
    navigate(
      config.adminRoutes.DetailHotpotType.replace(
        ":hotpotId",
        hotpotData.hotpotId
      )
    );
  };

  const handleCloseDelete = () => {
    onOpenDelete(null);
    setOpenDelete(false);
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onOpenDelete(hotpotData);
    setOpenDelete(true);
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
        <MenuItem onClick={() => handleDetail()}>
          <InfoIcon sx={{ mr: "4px" }} color="info" />
          <span>Chi Tiết</span>
        </MenuItem>
        <MenuItem onClick={() => handleDelete()}>
          <BlockIcon sx={{ mr: "4px" }} color="error" />
          <span>Xoá</span>
        </MenuItem>
      </Menu>

      {openDelete && (
        <DeleteHotpotModal
          open={openDelete}
          onClose={handleCloseDelete}
          onConfirm={onFetch}
          comboName={hotpotData}
        />
      )}
    </div>
  );
};

export default MenuActionTableHotpot;
