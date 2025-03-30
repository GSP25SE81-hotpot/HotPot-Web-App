// src/styles/OrderManagementStyles.tsx
import {
  Box,
  Paper,
  Typography,
  Card,
  Tabs,
  Tab,
  styled,
  alpha,
} from "@mui/material";

// Dashboard container with gradient background and proper padding
export const DashboardWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(4), // Increased padding for better spacing
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.default,
    0.95
  )}, ${alpha(theme.palette.background.paper, 0.9)})`,
  minHeight: "100vh",
}));

// Dashboard title with proper margin
export const DashboardTitle = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 700,
  marginBottom: theme.spacing(4), // Increased margin for better separation
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

// Status cards grid with proper gap and margin
export const StatusCardsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", // Better responsive grid
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(2), // Smaller gap on mobile
  },
}));

// Status card with proper padding
export const StatusCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(8px)",
  borderRadius: 16,
  padding: theme.spacing(3), // Increased padding for better internal spacing
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  height: "100%", // Ensure consistent height
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 20px 0 ${alpha(theme.palette.common.black, 0.1)}`,
  },
}));

// Status card title with proper spacing
export const StatusCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2), // Increased margin for better separation
}));

// Status card count
export const StatusCardCount = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginTop: "auto", // Push to bottom if card grows
}));

// Tabs container with proper margin
export const StyledTabsContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(4), // Increased margin for better separation
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: `0 6px 16px 0 ${alpha(theme.palette.common.black, 0.08)}`,
}));

// Styled tabs with proper padding
export const StyledTabs = styled(Tabs)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(8px)",
  padding: theme.spacing(0, 2), // Add horizontal padding
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: "3px 3px 0 0",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
}));

// Styled tab with proper padding
export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.9rem",
  minHeight: 56, // Increased height for better touch targets
  padding: theme.spacing(2, 3), // Increased padding for better spacing
  transition: "all 0.2s",
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

// Tab panel container with proper padding
export const StyledTabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4), // Increased padding for better content spacing
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(8px)",
  borderRadius: "0 0 16px 16px",
}));

// Loading container with proper spacing
export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(8),
  width: "100%",
}));

// Error alert container with proper spacing
export const ErrorContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(4, 0),
  width: "100%",
}));
