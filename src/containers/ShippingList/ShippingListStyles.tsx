import {
  Box,
  Button,
  Chip,
  ChipProps,
  CircularProgress,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  TypographyProps,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

// Page container
export const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

// Content paper
export const ContentPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: 16,
  boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.08)}`,
}));

// Page title
export const PageTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: "1.8rem",
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: 60,
    height: 4,
    backgroundColor: alpha(theme.palette.primary.main, 0.5),
    borderRadius: 2,
  },
}));

// Table container
export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

// Table header
export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableRow-root": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

// Header cell
export const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

// Table row
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  "&:nth-of-type(even)": {
    backgroundColor: alpha(theme.palette.background.default, 0.5),
  },
}));

// Order code cell
export const OrderCodeCell = styled(TableCell)(({ theme }) => ({
  cursor: "pointer",
  textDecoration: "underline",
  color: theme.palette.primary.main,
  fontWeight: 600,
  transition: "color 0.2s ease-in-out",
  "&:hover": {
    color: theme.palette.primary.dark,
  },
}));

// Customer name cell
export const CustomerNameCell = styled(TableCell)(() => ({
  fontWeight: 500,
}));

// Address cell
export const AddressCell = styled(TableCell)(() => ({
  maxWidth: 250,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
}));

// Status cell
export const StatusCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
}));

// Actions cell
export const ActionsCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
}));

// Status chip
interface StatusChipProps extends Omit<ChipProps, "color"> {
  statusType: "shipping" | "processed";
}

export const StatusChip = styled(Chip)<StatusChipProps>(
  ({ theme, statusType }) => {
    const colors = {
      shipping: {
        border: theme.palette.warning.main,
        color: theme.palette.warning.main,
        background: alpha(theme.palette.warning.main, 0.1),
      },
      processed: {
        border: theme.palette.primary.main,
        color: theme.palette.primary.main,
        background: alpha(theme.palette.primary.main, 0.1),
      },
    };

    return {
      minWidth: 90,
      borderColor: colors[statusType].border,
      color: colors[statusType].color,
      backgroundColor: colors[statusType].background,
      fontWeight: 500,
      "& .MuiChip-label": {
        padding: "0 8px",
      },
    };
  }
);

// Direction button
export const DirectionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.2s ease-in-out",
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
    backgroundColor: theme.palette.primary.dark,
  },
}));

// Delivered button
export const DeliveredButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 600,
  marginLeft: theme.spacing(2),
  border: `1px solid ${theme.palette.success.main}`,
  color: theme.palette.success.main,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.success.main, 0.1),
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.1)}`,
  },
}));

// Start delivery button
export const StartDeliveryButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 600,
  marginLeft: theme.spacing(2),
  border: `1px solid ${theme.palette.info.main}`,
  color: theme.palette.info.main,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.info.main, 0.1),
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.1)}`,
  },
}));

// Empty state container
export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  borderRadius: 16,
  margin: theme.spacing(2, 0),
}));

// Empty state text
export const EmptyStateText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(2),
  textAlign: "center",
}));

export const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.primary.main,
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(4),
}));

export const AddressTooltip = styled(Tooltip)(({ theme }) => ({
  tooltip: {
    backgroundColor: alpha(theme.palette.background.paper, 0.95),
    color: theme.palette.text.primary,
    maxWidth: 300,
    fontSize: "0.875rem",
    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    boxShadow: theme.shadows[6],
    padding: theme.spacing(1, 1.5),
    borderRadius: 8,
  },
}));

export const ResponsiveTableContainer = styled(StyledTableContainer)(
  ({ theme }) => ({
    [theme.breakpoints.down("md")]: {
      "& .MuiTable-root": {
        minWidth: "auto",
      },
    },
  })
);

export const MobileOnlyBox = styled(Box)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("sm")]: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
}));

export const DesktopOnlyBox = styled(Box)(({ theme }) => ({
  display: "flex",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));
