import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { ReactNode } from "react";
// Define your custom theme
const theme = createTheme({
  typography: {
    fontFamily: '"Lato", sans-serif',
    h2: {
      fontWeight: 600,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      letterSpacing: "-0.02em",
      fontSize: "1.5rem",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
      fontSize: "1.125rem",
    },
    body1: {
      letterSpacing: "-0.01em",
      lineHeight: 1.5,
      fontWeight: 400,
      fontSize: "0.875rem",
    },
    body2: {
      letterSpacing: "0",
      lineHeight: 1.6,
      fontSize: "0.875rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
      fontSize: "0.875rem",
    },
  },
});

interface MuiOverideProps {
  children: ReactNode;
}
// You can also customize other typography variants if needed

const OverrideMuiTheme: React.FC<MuiOverideProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default OverrideMuiTheme;
