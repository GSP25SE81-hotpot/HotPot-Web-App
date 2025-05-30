// ConfirmationDialog.tsx
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { styled, alpha } from "@mui/material/styles";
import { Typography, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.12)}`,
    overflow: "hidden",
    maxWidth: 450,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  padding: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.25rem",
  color: theme.palette.primary.main,
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(4, 3),
}));

const StyledDialogContentText = styled(DialogContentText)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "1rem",
  marginBottom: 0,
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3, 3),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 2.5),
  textTransform: "none",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  backgroundColor: alpha(theme.palette.divider, 0.1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.divider, 0.2),
  },
}));

const ConfirmButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 2.5),
  textTransform: "none",
  fontWeight: 600,
  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: 8,
  "&:hover": {
    backgroundColor: alpha(theme.palette.divider, 0.1),
  },
}));

function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
}: React.PropsWithChildren<ConfirmationDialogProps>) {
  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <StyledDialogTitle id="confirmation-dialog-title">
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <TitleText>{title || "Xác nhận hành động"}</TitleText>
        </Box>
        <CloseButton aria-label="close" onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </CloseButton>
      </StyledDialogTitle>

      <StyledDialogContent>
        <StyledDialogContentText id="confirmation-dialog-description">
          {description || "Bạn có chắc chắn muốn thực hiện hành động này?"}
        </StyledDialogContentText>
      </StyledDialogContent>

      <StyledDialogActions>
        <CancelButton onClick={onClose} variant="text">
          Hủy
        </CancelButton>
        <ConfirmButton
          onClick={onConfirm}
          autoFocus
          color="primary"
          variant="contained"
          startIcon={<CheckCircleOutlineIcon />}
        >
          Xác nhận
        </ConfirmButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}

export default ConfirmationDialog;
