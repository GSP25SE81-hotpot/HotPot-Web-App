// src/components/replacement/UpdateStatusForm.tsx
import {
  Box,
  BoxProps,
  Button,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

// Styled Components
export const FormContainer = styled(Box)<
  BoxProps & {
    component?: React.ElementType;
  } & React.FormHTMLAttributes<HTMLFormElement>
>(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  backgroundColor: theme.palette.background.paper,
}));

export const FormTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
}));

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

export const NotesField = styled(TextField)(({ theme }) => ({
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

export const UpdateButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));
