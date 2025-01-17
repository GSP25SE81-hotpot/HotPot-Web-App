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
    h4: { 
      fontWeight: 600, 
      letterSpacing: "-0.02em" 
    },
    h6: { 
      fontWeight: 600, 
      letterSpacing: "-0.01em" 
    },
    body1: { 
      letterSpacing: "-0.01em", 
      lineHeight: 1.5,
      fontWeight: 600,
    },
    body2: { 
      letterSpacing: "0", 
      lineHeight: 1.6 
    },
    button: { 
      textTransform: "none" 
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
