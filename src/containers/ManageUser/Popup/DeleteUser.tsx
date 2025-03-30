import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { colors } from "../../../styles/Color/color";
import { UserInterface } from "../../../types/user";
import adminUserManagementAPI from "../../../api/adminUserManagementAPI";
import { toast } from "react-toastify";

interface Props {
  onOpen: boolean;
  onClose: () => void;
  data: UserInterface;
  fetchData: () => void;
}

const DeleteUser: React.FC<Props> = ({ onOpen, onClose, data, fetchData }) => {
  //Call API
  const handleDeleteUser = async () => {
    try {
      const res: any = await adminUserManagementAPI.deleteUser(data?.userId);
      onClose();
      fetchData();
      toast.success(res?.message);
    } catch (error: any) {
      toast.error(error);
    }
  };

  return (
    <div>
      <Dialog open={onOpen}>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            bgcolor: colors.primary,
          }}
        >
          <Typography variant="h5">Thông báo</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: colors.white }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontWeight: 200, pt: 3 }}>
            Bạn có chắc xóa tài khoản của người dùng "{data?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDeleteUser()}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteUser;
