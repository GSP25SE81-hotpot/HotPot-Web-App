// src/components/payments/PaymentFilter.styles.ts
import { styled } from "@mui/material/styles";
import { Paper, Button, Box, FormControl } from "@mui/material";
import Grid from "@mui/material/Grid2";

export const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
}));

export const FilterGrid = styled(Grid)(() => ({
  alignItems: "center",
}));

export const FilterFormControl = styled(FormControl)(() => ({
  width: "100%",
}));

export const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
}));

export const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const ResetButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey[400],
  color: theme.palette.text.primary,
}));
