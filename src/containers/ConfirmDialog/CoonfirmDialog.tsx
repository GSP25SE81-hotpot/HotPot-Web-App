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
import { colors } from "../../styles/Color/color";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CoonfirmDialog: React.FC<Props> = ({
  open,
  onClose,
  title,
  content,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}) => {
  return (
    <div>
      <Dialog open={open}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ color: colors.white }}>
            {title}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon sx={{ color: colors.white }} />
          </IconButton>
        </DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>{cancelText}</Button>
          <Button onClick={onConfirm}>{confirmText}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CoonfirmDialog;
