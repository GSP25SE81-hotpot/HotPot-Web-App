// src/pages/payments/ProcessPaymentDialog.styles.ts
import { styled } from "@mui/material/styles";
import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

export const InstructionText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const ErrorAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  justifyContent: "space-between",
}));

export const ActionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "actionType",
})<{ actionType?: string }>(({ theme, actionType }) => ({
  minWidth: 100,
  fontWeight: 500,
  ...(actionType === "approve" && {
    backgroundColor: theme.palette.success.main,
    "&:hover": {
      backgroundColor: theme.palette.success.dark,
    },
  }),
  ...(actionType === "cancel" && {
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.dark,
    },
  }),
  ...(actionType === "refund" && {
    backgroundColor: theme.palette.warning.main,
    "&:hover": {
      backgroundColor: theme.palette.warning.dark,
    },
  }),
}));

export const CloseButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
}));
