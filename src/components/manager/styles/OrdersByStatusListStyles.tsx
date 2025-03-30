// src/styles/OrdersByStatusListStyles.tsx
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Tab,
  TableCell,
  TableContainer,
  TableRow,
  Tabs,
  Typography,
  styled,
  alpha,
} from "@mui/material";

// Main container for the orders list
export const OrdersListContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  width: "100%",
}));

// Styled paper for the tabs and table
export const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: `0 6px 16px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(8px)",
}));

// Styled tabs with gradient background
export const StyledTabs = styled(Tabs)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.primary.main,
    0.05
  )}, ${alpha(theme.palette.primary.light, 0.1)})`,
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: "3px 3px 0 0",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
}));

// Styled tab with hover effect
export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.9rem",
  minHeight: 56,
  padding: theme.spacing(1.5, 3),
  transition: "all 0.2s",
  "&.Mui-selected": {
    color: theme.palette.primary.main,
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

// Tab panel container
export const StyledTabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0),
  "& .MuiBox-root": {
    paddingTop: theme.spacing(2),
  },
}));

// Table container with proper spacing
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "calc(100vh - 240px)",
  "&::-webkit-scrollbar": {
    width: 8,
    height: 8,
  },
  "&::-webkit-scrollbar-track": {
    background: alpha(theme.palette.background.paper, 0.1),
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(theme.palette.primary.main, 0.2),
    borderRadius: 4,
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: alpha(theme.palette.primary.main, 0.3),
  },
}));

// Table header cell with proper styling
export const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  color: theme.palette.text.secondary,
  fontWeight: 600,
  fontSize: "0.8rem",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  whiteSpace: "nowrap",
}));

// Table row with hover effect
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  "& td": {
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
}));

// Table cell with proper styling
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.9rem",
  padding: theme.spacing(1.5, 2),
}));

// Order ID cell
export const OrderIdCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  padding: theme.spacing(1.5, 2),
}));

// Customer name with proper styling
export const CustomerName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.9rem",
  marginBottom: theme.spacing(0.5),
}));

// Customer phone with proper styling
export const CustomerPhone = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
}));

// Order type chip with proper styling
export const OrderTypeChip = styled(Chip)(({ theme }) => ({
  height: 24,
  fontSize: "0.75rem",
  fontWeight: 600,
  marginRight: theme.spacing(0.5),
}));

// Shipping status chip with dynamic color
export const ShippingStatusChip = styled(Chip)<{ delivered?: boolean }>(
  ({ theme, delivered }) => ({
    height: 24,
    fontSize: "0.75rem",
    fontWeight: 600,
    backgroundColor: delivered
      ? theme.palette.success.main
      : theme.palette.warning.main,
    color: "white",
  })
);

// Unallocated chip
export const UnallocatedChip = styled(Chip)(({ theme }) => ({
  height: 24,
  fontSize: "0.75rem",
  fontWeight: 600,
  backgroundColor: alpha(theme.palette.text.secondary, 0.1),
  color: theme.palette.text.secondary,
}));

// Actions container
export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center",
}));

// Update status button
export const UpdateStatusButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.8rem",
  padding: theme.spacing(0.5, 1.5),
  borderRadius: 8,
  minWidth: "auto",
  transition: "all 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

// View details button
export const ViewDetailsButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    transform: "translateY(-2px)",
  },
}));

// Empty state container
export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(6, 2),
}));

// Empty state text
export const EmptyStateText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
}));

// Loading container
export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(6, 0),
}));
