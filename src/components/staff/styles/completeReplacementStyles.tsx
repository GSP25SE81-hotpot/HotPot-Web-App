import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  BoxProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export const FormContainer = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.paper,
}));

export const FormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));

export const FormField = styled(TextField)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

export const ButtonContainer = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(3),
  justifyContent: "flex-end",
}));

export const CancelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  borderColor: theme.palette.divider,
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.success.dark,
  },
  "&:disabled": {
    backgroundColor: theme.palette.action.disabledBackground,
  },
}));
