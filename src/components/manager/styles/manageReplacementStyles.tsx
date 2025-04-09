import { Box, Paper, Stack, TextField, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

export const PageTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.h4.fontSize,
  fontWeight: theme.typography.fontWeightBold,
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  flexGrow: 1,
  "& .MuiOutlinedInput-root": {
    borderRadius: theme.shape.borderRadius * 3,
  },
}));

export const LiveIndicator = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.success.main,
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
  borderRadius: theme.shape.borderRadius * 2,
}));

export const LiveDot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: theme.palette.success.main,
  marginRight: theme.spacing(1),
}));

export const NoResultsMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  padding: theme.spacing(3),
  textAlign: "center",
}));

export const DialogHeader = styled(Stack)({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

export const LoadingOverlay = styled(Box)(() => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: alpha("#fff", 0.7),
  zIndex: 1,
}));

export const NoActionsMessage = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: alpha(theme.palette.info.light, 0.1),
}));
