import { Box, Button, Card } from "@mui/material";
import { styled } from "@mui/material/styles";

export const DetailContainer = styled(Box)(() => ({
  width: "100%",
}));

export const BackButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const DetailPaper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
}));

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

export const DetailCard = styled(Card)(() => ({
  height: "100%",
}));

export const ActionContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

export const FormContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));
