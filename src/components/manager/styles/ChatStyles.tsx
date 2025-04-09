// src/components/Chat/ChatStyledComponents.tsx
import {
    alpha,
    Badge,
    Box,
    ListItemButton,
    Paper,
    styled,
    TextField,
  } from "@mui/material";
  
  export const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: "#44b700",
      color: "#44b700",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      "&::after": {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));
  
  export const StyledPaper = styled(Paper)(({ theme }) => ({
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.background.paper,
      0.9
    )}, ${alpha(theme.palette.background.default, 0.95)})`,
    backdropFilter: "blur(10px)",
    borderRadius: 24,
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: `0 12px 48px 0 ${alpha(theme.palette.common.black, 0.12)}`,
    },
  }));
  
  export const MessageBubble = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isStaff",
  })<{ isStaff?: boolean }>(({ theme, isStaff }) => ({
    maxWidth: "70%",
    padding: "12px 16px",
    borderRadius: isStaff ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
    background: isStaff
      ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
      : theme.palette.grey[100],
    boxShadow: `0 4px 12px ${alpha(
      isStaff ? theme.palette.primary.main : theme.palette.common.black,
      0.08
    )}`,
    color: isStaff ? "white" : "inherit",
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-1px)",
      boxShadow: `0 6px 16px ${alpha(
        isStaff ? theme.palette.primary.main : theme.palette.common.black,
        0.12
      )}`,
    },
  }));
  
  export const AnimatedListItem = styled(ListItemButton)(({ theme }) => ({
    transition: "all 0.2s ease-in-out",
    borderRadius: 12,
    margin: "4px 8px",
    "&:hover": {
      transform: "translateX(4px)",
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
    "&.Mui-selected": {
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.16),
      },
    },
  }));
  
  // src/components/Chat/ChatStyledComponents.tsx (continued)
  export const StyledInput = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 30,
      backgroundColor: alpha(theme.palette.background.paper, 0.8),
      backdropFilter: "blur(8px)",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
      },
      "&.Mui-focused": {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.12)}`,
      },
    },
  }));
  
  export const TypingIndicator = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: "8px 16px",
    borderRadius: 20,
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    width: "fit-content",
    marginTop: 8,
    "& .dot": {
      width: 8,
      height: 8,
      margin: "0 2px",
      borderRadius: "50%",
      backgroundColor: theme.palette.text.secondary,
      display: "inline-block",
      animation: "typing 1.4s infinite ease-in-out both",
    },
    "& .dot:nth-of-type(1)": {
      animationDelay: "0s",
    },
    "& .dot:nth-of-type(2)": {
      animationDelay: "0.2s",
    },
    "& .dot:nth-of-type(3)": {
      animationDelay: "0.4s",
    },
    "@keyframes typing": {
      "0%": {
        transform: "scale(1)",
        opacity: 0.7,
      },
      "50%": {
        transform: "scale(1.4)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(1)",
        opacity: 0.7,
      },
    },
  }));
  
  export const ConnectionStatusIndicator = styled(Box, {
    shouldForwardProp: (prop) => prop !== "isConnected",
  })<{ isConnected: boolean }>(({ theme, isConnected }) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    "& .indicator": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: isConnected ? "#44b700" : theme.palette.error.main,
    },
  }));
  