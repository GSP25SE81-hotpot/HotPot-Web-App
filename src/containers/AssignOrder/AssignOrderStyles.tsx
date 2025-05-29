import {
  Box,
  Button,
  Chip,
  ChipProps,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TypographyProps,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

// Page container
export const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
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
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.08)}`,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

// Table header row
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

// Notes cell
export const NotesCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
}));

// Status cell
export const StatusCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
}));

// Actions cell
export const ActionsCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
}));

// Notes text field
export const NotesTextField = styled(TextField)(({ theme }) => ({
  width: "300px",
  "& .MuiInputBase-root": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
  },
}));

interface StatusChipProps extends ChipProps {
  statuscolor: string;
}

export const StyledStatusChip = styled(Chip)<StatusChipProps>(
  ({ theme, statuscolor }) => ({
    backgroundColor: statuscolor,
    color: theme.palette.common.white,
    fontWeight: 500,
    borderRadius: 12,
    "& .MuiChip-label": {
      padding: "0 8px",
    },
  })
);

// Action button
export const ActionButton = styled(Button)(({ theme }) => ({
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
