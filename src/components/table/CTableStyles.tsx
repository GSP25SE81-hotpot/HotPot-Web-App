// CTableStyles.tsx
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  TableCell,
  TableContainer,
  TablePagination,
  TablePaginationProps,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { colors } from "../../styles/Color/color";

// Main card container with glass effect
export const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
  overflow: "hidden",
}));

// Card title with gradient effect
export const StyledCardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
}));

// Card header with proper spacing
export const StyledCardHeader = styled(CardHeader)(() => ({
  paddingBottom: 0,
}));

// Action buttons container
export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  paddingRight: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(1),
}));

// Search tools container
export const SearchToolsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 1),
}));

// Card content with reduced top padding
export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  paddingTop: theme.spacing(1),
}));

// Table container with scrolling
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "70vh",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: alpha(theme.palette.background.default, 0.5),
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: alpha(theme.palette.primary.main, 0.2),
    borderRadius: "4px",
    "&:hover": {
      background: alpha(theme.palette.primary.main, 0.3),
    },
  },
  "& .MuiTable-root": {
    minWidth: 650,
  },
  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    padding: theme.spacing(1.5),
    fontSize: "0.875rem",
  },
  "& .MuiTableHead-root": {
    backgroundColor: alpha(theme.palette.primary.main, 1),
    position: "sticky",
    top: 0,
    zIndex: 10,
    "& .MuiTableCell-head": {
      fontWeight: 600,
      fontSize: "0.875rem",
      color: "#ffffff",
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
      borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
  "& .MuiTableBody-root": {
    "& .MuiTableRow-root": {
      transition: "all 0.2s ease-in-out",
      cursor: "default",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.06),
        transform: "translateY(-1px)",
        boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.08)}`,
      },
      "&.clickable": {
        cursor: "pointer",
      },
      "&.selected": {
        backgroundColor: alpha(theme.palette.primary.main, 0.12),
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.16),
        },
      },
      '&[data-expired="true"]': {
        backgroundColor: alpha(theme.palette.error.main, 0.05),
        "&:hover": {
          backgroundColor: alpha(theme.palette.error.main, 0.1),
        },
      },
      '&[data-expiring-soon="true"]': {
        backgroundColor: alpha(theme.palette.warning.main, 0.05),
        "&:hover": {
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
        },
      },
    },
  },
}));

// Styled table pagination
export const StyledTablePagination = styled(TablePagination, {
  shouldForwardProp: (prop) => prop !== "component",
})<TablePaginationProps>(({ theme }) => ({
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  "& .MuiTablePagination-toolbar": {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
    fontSize: "0.875rem",
    color: theme.palette.text.secondary,
  },
}));

// Loading overlay with blur effect
export const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2,
  backdropFilter: "blur(2px)",
  borderRadius: "inherit",
}));

// Styled circular progress
export const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

// Index cell
export const IndexCell = styled(TableCell)(() => ({
  fontWeight: "medium",
}));

// Image container for thumbnails
export const ImageContainer = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: 8,
  overflow: "hidden",
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  objectFit: "cover",
}));

// Empty state alert
export const StyledEmptyAlert = styled(Alert)(({ theme }) => ({
  border: "none",
  backgroundColor: "transparent",
  justifyContent: "center",
  padding: theme.spacing(6, 2),
}));

// Status chip with consistent styling
export const StyledStatusChip = styled(Chip)(() => ({
  minWidth: "90px",
  fontWeight: 500,
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}));

// Header container
export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.spacing(2),
}));

export const StyledAlert = styled(Alert)(() => ({
  border: "none",
  backgroundColor: "transparent",
  justifyContent: "center",
}));

export const StyledTableCell = styled(TableCell)(() => ({
  fontWeight: "bold",
  minWidth: "60px",
}));

export const StyledHeaderCell = styled(TableCell)(() => ({
  fontWeight: "bold",
  color: colors.white,
}));

export const StyledActionCell = styled(TableCell)(() => ({
  fontWeight: "bold",
  minWidth: "100px",
  textAlign: "center",
}));

export const StyledIndexCell = styled(TableCell)(() => ({
  fontWeight: "medium",
}));

export const StyledImageContainer = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: 8,
  objectFit: "cover",
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  overflow: "hidden",
}));
