/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import adminHotpot from "../../../api/Services/adminHotpot";

interface DeleteHotpotModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  comboName?: any;
}

const DeleteHotpotModal: React.FC<DeleteHotpotModalProps> = ({
  open,
  onClose,
  onConfirm,
  comboName,
}) => {
  // States
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Handle delete submission
  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await adminHotpot.DeleteHotpot(comboName.hotpotId, {});

      if (onConfirm) {
        onConfirm();
      }

      toast.success("Xóa loại nồi thành công");
      onClose();
    } catch (error: any) {
      console.error("Error deleting ingredient:", error);
      // Handle specific error cases
      if (error.response?.status === 500) {
        toast.error(error.response.data.message);
        onClose();
      } else {
        toast.error("Xóa loại nồi thất bại");
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xoá loại nồi</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn xoá loại nồi{" "}
          <strong>{comboName.name || "này"}</strong>? Thao tác này không thể
          hoàn tác.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Hủy
        </Button>
        <LoadingButton
          onClick={handleDelete}
          color="error"
          variant="contained"
          loading={submitting}
        >
          Xoá
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteHotpotModal;
