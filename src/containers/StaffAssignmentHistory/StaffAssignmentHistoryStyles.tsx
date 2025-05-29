import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  ChipProps,
  Container,
  Paper,
  TableCell,
  TableHead,
  TablePagination,
  TablePaginationProps,
  TableRow,
  Typography,
  TypographyProps,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { StaffTaskType } from "../../types/orderManagement";

// Page container
export const PageContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: "100%",
}));

// Page title
export const PageTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: "1.8rem",
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  display: "flex",
  alignItems: "center",
}));

// Filter container
export const FilterContainer = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
}));

// Filter title
export const FilterTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

// Filter actions container
export const FilterActions = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

// Search button
export const SearchButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "8px 24px",
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

// Reset button
export const ResetButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "8px 24px",
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.2s ease-in-out",
  borderColor: alpha(theme.palette.primary.main, 0.5),
  color: theme.palette.primary.main,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

// Loading container
export const LoadingContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 200,
  width: "100%",
}));

// Results container
export const ResultsContainer = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  overflow: "hidden",
}));

// Table title container
export const TableTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2, 3),
}));

// Table summary text
export const TableSummary = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));

// Styled table head
export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    fontWeight: 600,
    padding: theme.spacing(1.5, 2),
  },
}));

// Styled table row
export const StyledTableRow = styled(TableRow)<{ $isEven: boolean }>(
  ({ theme, $isEven }) => ({
    backgroundColor: $isEven
      ? alpha(theme.palette.background.default, 0.5)
      : alpha(theme.palette.background.paper, 0.8),
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
    "& .MuiTableCell-body": {
      padding: theme.spacing(1.5, 2),
      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    },
  })
);

// Staff info container
export const StaffInfoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
}));

// Staff name
export const StaffName = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "0.9rem",
  color: theme.palette.text.primary,
}));

// Additional staff container
export const AdditionalStaffContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
  paddingLeft: theme.spacing(1),
  borderLeft: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
  marginTop: theme.spacing(0.5),
}));

// Date cell
export const DateCell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
}));

// Status chip
export const StatusChip = styled(Chip)<ChipProps & { $isActive: boolean }>(
  ({ theme, $isActive }) => ({
    borderRadius: 12,
    fontWeight: 500,
    backgroundColor: $isActive
      ? alpha(theme.palette.primary.main, 0.1)
      : alpha(theme.palette.success.main, 0.1),
    color: $isActive ? theme.palette.primary.main : theme.palette.success.main,
    border: `1px solid ${
      $isActive
        ? alpha(theme.palette.primary.main, 0.3)
        : alpha(theme.palette.success.main, 0.3)
    }`,
  })
);

// Task type chip
export const TaskTypeChip = styled(Chip)<
  ChipProps & { $taskType: StaffTaskType }
>(({ theme, $taskType }) => {
  const getTaskTypeColor = () => {
    switch ($taskType) {
      case StaffTaskType.Preparation:
        return theme.palette.primary.main;
      case StaffTaskType.Shipping:
        return theme.palette.secondary.main;
      case StaffTaskType.Pickup:
        return theme.palette.success.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return {
    borderRadius: 12,
    fontWeight: 500,
    backgroundColor: alpha(getTaskTypeColor(), 0.1),
    color: getTaskTypeColor(),
    border: `1px solid ${alpha(getTaskTypeColor(), 0.3)}`,
  };
});

// Empty result card
export const EmptyResultCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(8px)",
  borderRadius: 16,
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  padding: theme.spacing(4),
  textAlign: "center",
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.05)}`,
}));

// Styled form controls
export const StyledFormControl = styled(Box)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.9rem",
  },
}));

export const StyledTablePagination = styled(
  TablePagination
)<TablePaginationProps>(({ theme }) => ({
  borderTop: `1px solid ${theme.palette.divider}`,
  ".MuiTablePagination-toolbar": {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    padding: theme.spacing(0, 2),
  },
  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
    margin: 0,
  },
  ".MuiTablePagination-select": {
    paddingTop: 8,
    paddingBottom: 8,
  },
  ".MuiTablePagination-actions": {
    "& .MuiIconButton-root": {
      padding: 8,
      borderRadius: 8,
      transition: "all 0.2s",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    },
  },
}));

// Order code text
export const OrderCodeText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.9rem",
  color: theme.palette.primary.main,
  cursor: "pointer",
  transition: "color 0.2s ease-in-out",
  "&:hover": {
    color: theme.palette.primary.dark,
    textDecoration: "underline",
  },
}));

// Customer name text
export const CustomerNameText = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.primary,
}));

// Error alert
export const StyledErrorAlert = styled(Alert)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.1)}`,
  marginBottom: theme.spacing(3),
}));

// Date picker wrapper
export const DatePickerWrapper = styled(Box)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
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
