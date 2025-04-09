/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Fade,
  Alert,
} from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";
import { colors } from "../../../styles/Color/color";
import adminIngredientsAPI from "../../../api/Services/adminIngredientsAPI";
import { toast } from "react-toastify";

interface DeleteIngredientModalProps {
  open: boolean;
  handleClose: () => void;
  ingredientId: string | number;
  ingredientName: string;
  onDeleteSuccess?: () => void;
}

const DeleteIngredientModal: React.FC<DeleteIngredientModalProps> = ({
  open,
  handleClose,
  ingredientId,
  ingredientName,
  onDeleteSuccess,
}) => {
  // States
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Handle delete submission
  const handleDelete = async () => {
    setSubmitting(true);
    try {
      await adminIngredientsAPI.removeIngredients(ingredientId);

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }

      toast.success("Xóa nguyên liệu thành công");
      handleClose();
    } catch (error: any) {
      console.error("Error deleting ingredient:", error);

      // Handle specific error cases
      if (error.response?.status === 400) {
        toast.error(
          "Không thể xóa nguyên liệu đang được sử dụng trong công thức"
        );
      } else {
        toast.error("Xóa nguyên liệu thất bại");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: colors.blue_500,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" color={colors.dark} fontWeight="bold">
          Xóa nguyên liệu
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: colors.white,
            bgcolor: "rgba(255,255,255,0.1)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        <Fade in={open} timeout={500}>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                my: 2,
              }}
            >
              <WarningIcon
                sx={{ fontSize: 64, color: colors.secondary, mb: 2 }}
              />
              <Typography variant="h6" align="center" fontWeight="bold">
                Bạn có chắc chắn muốn xóa nguyên liệu này?
              </Typography>
              <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                <strong>"{ingredientName}"</strong> sẽ bị xóa vĩnh viễn khỏi hệ
                thống.
              </Typography>
            </Box>

            <Alert severity="warning" sx={{ my: 2 }}>
              Lưu ý: Bạn không thể xóa nguyên liệu đang được sử dụng trong các
              công thức.
            </Alert>

            <Divider sx={{ my: 3 }} />

            {/* Actions */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={submitting}
              >
                Hủy
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={
                  submitting ? <CircularProgress size={20} /> : <DeleteIcon />
                }
                onClick={handleDelete}
                disabled={submitting}
              >
                {submitting ? "Đang xóa..." : "Xóa nguyên liệu"}
              </Button>
            </Box>
          </Box>
        </Fade>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteIngredientModal;
