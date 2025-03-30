/* eslint-disable @typescript-eslint/no-explicit-any */
import BlockIcon from "@mui/icons-material/Block";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import * as React from "react";
import DetailPopup from "../../../containers/ManageUser/Popup/DetailPopup";
import UpdatePopup from "../../../containers/ManageUser/Popup/UpdatePopup";
import DeleteUser from "../../../containers/ManageUser/Popup/DeleteUser";

interface MenuActionTableUserProps {
  userData: any;
  onOpenUpdate?: any;
  onOpenDetail?: any;
  onOpenDelete?: any;
  fetchData: () => void;
}

const MenuActionTableUser: React.FC<MenuActionTableUserProps> = ({
  userData,
  onOpenUpdate,
  onOpenDetail,
  onOpenDelete,
  fetchData,
}) => {
  console.log("data dc chọn: ", userData);
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [openDetail, setOpenDetail] = React.useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = React.useState<boolean>(false);
  const [openDelete, setOpenDelete] = React.useState<boolean>(false);
  const open = Boolean(anchorEl);

  //func
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleUpdate = () => {
    onOpenUpdate(userData);
    setOpenUpdate(true);
    setAnchorEl(null);
  };
  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };
  const handleDetail = () => {
    onOpenDetail(userData);
    setOpenDetail(true);
    setAnchorEl(null);
  };
  const handleCloseDetail = () => {
    setOpenDetail(false);
  };
  const handleDelete = () => {
    onOpenDelete(userData);
    setOpenDelete(true);
    setAnchorEl(null);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
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
        <MenuItem onClick={() => handleUpdate()}>
          <EditIcon sx={{ mr: "4px", color: "#9ADE7B" }} />
          <span>Cập nhật</span>
        </MenuItem>

        <MenuItem onClick={() => handleDelete()}>
          <BlockIcon sx={{ mr: "4px" }} color="error" />
          <span>Xóa</span>
        </MenuItem>

        {/* <MenuItem onClick={() => handleStartFeedBack(id)}>
          <FeedbackOutlinedIcon sx={{ mr: "4px" }} color="success" />
          <span>Mở phản hồi</span>
        </MenuItem> */}
      </Menu>
      {openDetail == true && (
        <DetailPopup
          handleOpen={openDetail}
          handleClose={handleCloseDetail}
          UserData={userData}
        />
      )}

      {openUpdate == true && (
        <UpdatePopup
          onOpen={openUpdate}
          onClose={handleCloseUpdate}
          userData={userData}
          fetchData={fetchData}
        />
      )}
      {openDelete == true && (
        <DeleteUser
          onOpen={openDelete}
          onClose={handleCloseDelete}
          data={userData}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default MenuActionTableUser;
