import React from "react";
import { Alert, AlertTitle } from "@mui/material";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => (
  <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
    <AlertTitle>Error</AlertTitle>
    {message}
  </Alert>
);

export default ErrorAlert;
