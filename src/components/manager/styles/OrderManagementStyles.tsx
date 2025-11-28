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
  padding: theme.spacing(4),
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.default,
    0.95
  )}, ${alpha(theme.palette.background.paper, 0.9)})`,
  minHeight: "100vh",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.down("xs")]: {
    padding: theme.spacing(1),
  },
}));

// Dashboard title with proper margin
export const DashboardTitle = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 700,
  marginBottom: theme.spacing(4),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
    marginBottom: theme.spacing(2),
  },
}));

// Status cards grid with proper gap and margin
export const StatusCardsGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: theme.spacing(3),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
  padding: theme.spacing(3),
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 20px 0 ${alpha(theme.palette.common.black, 0.1)}`,
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
    borderRadius: 12,
  },
}));

// Status card title with proper spacing
export const StatusCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75rem",
    marginBottom: theme.spacing(1),
  },
}));

// Status card count
export const StatusCardCount = styled(Typography)(({ theme }) => ({
  fontSize: "2rem",
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginTop: "auto",
  [theme.breakpoints.down("sm")]: {
    fontSize: "1.5rem",
  },
}));

// Tabs container with proper margin
export const StyledTabsContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(4),
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: `0 6px 16px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  [theme.breakpoints.down("sm")]: {
    marginBottom: theme.spacing(2),
    borderRadius: 12,
  },
}));

// Styled tabs with proper padding
export const StyledTabs = styled(Tabs)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(8px)",
  padding: theme.spacing(0, 2),
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: "3px 3px 0 0",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
  "& .MuiTabs-flexContainer": {
    [theme.breakpoints.down("sm")]: {
      flexWrap: "nowrap",
    },
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(0, 1),
  },
}));

// Styled tab with proper padding
export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.9rem",
  minHeight: 56,
  padding: theme.spacing(2, 3),
  transition: "all 0.2s",
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75rem",
    minHeight: 48,
    padding: theme.spacing(1, 2),
    minWidth: "auto",
  },
}));

// Tab panel container with proper padding
export const StyledTabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: "blur(8px)",
  borderRadius: "0 0 16px 16px",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

// Loading container with proper spacing
export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(8),
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(4),
  },
}));

// Error alert container with proper spacing
export const ErrorContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(4, 0),
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    margin: theme.spacing(2, 0),
  },
}));
