// src/pages/payments/paymentDetailDialog.styles.ts
import { styled } from "@mui/material/styles";
import { Button, DialogTitle, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  "& .MuiChip-root": {
    marginLeft: theme.spacing(2),
  },
}));

export const InfoSection = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(1),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

export const InfoItem = styled("div")(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const InfoLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));

export const InfoValue = styled(Typography)(() => ({
  fontSize: "1rem",
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 1),
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));
