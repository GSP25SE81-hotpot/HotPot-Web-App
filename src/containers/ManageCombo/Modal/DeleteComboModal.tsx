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
import adminComboAPI from "../../../api/Services/adminComboAPI";

interface DeleteComboModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  comboName?: any;
}

const DeleteComboModal: React.FC<DeleteComboModalProps> = ({
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
      await adminComboAPI.DeleteCombo(comboName.comboId);

      if (onConfirm) {
        onConfirm();
      }

      toast.success("Xóa nguyên liệu thành công");
      onClose();
    } catch (error: any) {
      console.error("Error deleting ingredient:", error);
      // Handle specific error cases
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Xóa nguyên liệu thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xoá combo</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Bạn có chắc chắn muốn xoá combo{" "}
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

export default DeleteComboModal;
