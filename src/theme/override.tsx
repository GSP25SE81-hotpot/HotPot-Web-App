import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { ReactNode } from "react";
// Define your custom theme
const theme = createTheme({
  typography: {
    fontFamily: '"Lora", serif',
    h2: {
      fontWeight: 600,
    },
    body1: {
      fontWeight: 600,
    },
    button: { textTransform: "none" },
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
