import {
  Box,
  Button,
  Chip,
  Paper,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  alpha,
  styled,
} from "@mui/material";

// Main container for the deliveries list
export const OrdersListContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  width: "100%",
}));

// Styled paper for the table
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

// List title
export const ListTitle = styled(Typography)(() => ({
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
}));

// Count badge
export const CountBadge = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  padding: theme.spacing(0.5, 1.5),
  borderRadius: 12,
  fontSize: "0.875rem",
  fontWeight: 600,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
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
export const IdCell = styled(TableCell)(({ theme }) => ({
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

// Status chip with dynamic color
export const StatusChip = styled(Chip)<{ statuscolor: string }>(
  ({ statuscolor }) => ({
    height: 24,
    fontSize: "0.75rem",
    fontWeight: 600,
    backgroundColor: statuscolor,
    color: "white",
  })
);

// Actions container
export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  alignItems: "center",
}));

// Dialog action button
export const DialogActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(0.75, 2),
  textTransform: "none",
  fontWeight: 600,
}));

// Empty state container
export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(6, 2),
}));

// Empty state title
export const EmptyStateTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
}));

// Empty state subtitle
export const EmptyStateSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

// Loading container
export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(6, 0),
}));
