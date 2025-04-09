// src/pages/payments/PaymentReceiptDialog.styles.ts
import {
  Box,
  Button,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";

export const ReceiptDialogTitle = styled(DialogTitle)(() => ({
  position: "relative",
}));

export const PrintIconButton = styled(IconButton)(() => ({
  position: "absolute",
  right: 8,
  top: 8,
}));

export const ReceiptContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const ReceiptTitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(1),
}));

export const ReceiptSubtitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  marginBottom: theme.spacing(1),
}));

export const ReceiptDate = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

export const ReceiptDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(3, 0),
}));

export const ReceiptGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));

export const ThankYouText = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const CloseButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export const PrintButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));
