// src/styles/ManageVehicleStyles.tsx
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  FormControl,
  TextField,
  styled,
  alpha,
} from "@mui/material";
import { VehicleStatus, VehicleType } from "../../../types/orderManagement";

// Main container for the vehicle management page
export const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.default,
    0.95
  )}, ${alpha(theme.palette.background.paper, 0.95)})`,
  minHeight: "100vh",
}));

// Page header with gradient text
export const PageHeader = styled(Typography)(({ theme }) => ({
  fontSize: "1.75rem",
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

// Controls container with flex layout
export const ControlsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  marginBottom: theme.spacing(3),
  gap: theme.spacing(2),
  alignItems: "center",
  flexWrap: "wrap",
}));

// Styled table with shadow and border radius
export const StyledTable = styled(Table)(({ theme }) => ({
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: `0 6px 16px 0 ${alpha(theme.palette.common.black, 0.08)}`,
}));

// Table header with gradient background
export const TableHeader = styled(TableHead)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.primary.main,
    0.05
  )}, ${alpha(theme.palette.primary.light, 0.1)})`,
}));

// Sortable table cell with hover effect
export const SortableTableCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== "active",
})<{ active?: boolean }>(({ theme, active }) => ({
  cursor: "pointer",
  fontWeight: 600,
  backgroundColor: active
    ? alpha(theme.palette.primary.main, 0.1)
    : "transparent",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

// Table row with hover effect
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.background.default, 0.5),
  },
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: "translateY(-1px)",
    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.05)}`,
  },
}));

// Empty row styling
export const EmptyRow = styled(TableRow)(() => ({
  height: 100,
}));

// Empty message styling
export const EmptyMessage = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  color: theme.palette.text.secondary,
  fontStyle: "italic",
  padding: theme.spacing(4),
}));

// Action button with hover effect
export const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

// Status chip with dynamic color based on status
export const StatusChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: number }>(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case VehicleStatus.Available:
        return theme.palette.success.main;
      case VehicleStatus.InUse:
        return theme.palette.warning.main;
      case VehicleStatus.Unavailable:
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return {
    display: "inline-block",
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 12,
    fontSize: "0.875rem",
    fontWeight: 600,
    backgroundColor: alpha(getStatusColor(), 0.15),
    color: getStatusColor(),
    boxShadow: `0 2px 8px ${alpha(getStatusColor(), 0.2)}`,
  };
});

// Type chip with dynamic color based on type
export const TypeChip = styled(Box, {
  shouldForwardProp: (prop) => prop !== "type",
})<{ type: number }>(({ theme, type }) => {
  const getTypeColor = () => {
    return type === VehicleType.Car
      ? theme.palette.info.main
      : theme.palette.secondary.main;
  };

  return {
    display: "inline-block",
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 12,
    fontSize: "0.875rem",
    fontWeight: 600,
    backgroundColor: alpha(getTypeColor(), 0.15),
    color: getTypeColor(),
    boxShadow: `0 2px 8px ${alpha(getTypeColor(), 0.2)}`,
  };
});

// Dialog styling
export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: `0 12px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
  },
}));

// Dialog title with gradient background
export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.common.white,
  padding: theme.spacing(2, 3),
  fontWeight: 600,
}));

// Dialog content with proper padding
export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Dialog actions with background
export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  background: alpha(theme.palette.background.default, 0.7),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

// Add button with gradient and hover effect
export const AddButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 2),
  textTransform: "none",
  fontWeight: 600,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  color: theme.palette.common.white,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

// Loading container
export const LoadingContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "80vh",
}));

// Form section with spacing and divider
export const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  position: "relative",
}));

// Form section title
export const FormSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
  position: "relative",
  paddingLeft: theme.spacing(1.5),
  "&:before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    height: "70%",
    width: 3,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 3,
  },
}));

// Styled form control with better spacing
export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiInputLabel-root": {
    fontWeight: 500,
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    transition: "all 0.2s",
    "&:hover": {
      boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    "&.Mui-focused": {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

// Styled text field with better spacing and hover effects
export const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiInputLabel-root": {
    fontWeight: 500,
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    transition: "all 0.2s",
    "&:hover": {
      boxShadow: `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
    "&.Mui-focused": {
      boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
    },
  },
}));

// Dialog content with scrollbar styling
export const EnhancedDialogContent = styled(StyledDialogContent)(
  ({ theme }) => ({
    "&::-webkit-scrollbar": {
      width: 8,
    },
    "&::-webkit-scrollbar-track": {
      background: alpha(theme.palette.background.default, 0.7),
      borderRadius: 4,
    },
    "&::-webkit-scrollbar-thumb": {
      background: alpha(theme.palette.primary.main, 0.2),
      borderRadius: 4,
      "&:hover": {
        background: alpha(theme.palette.primary.main, 0.3),
      },
    },
    padding: theme.spacing(3, 4),
  })
);

// Dialog subtitle
export const DialogSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  color: alpha(theme.palette.common.white, 0.8),
  marginTop: theme.spacing(0.5),
}));

// Enhanced dialog title container
export const EnhancedDialogTitle = styled(Box)(({ theme }) => ({
  background: `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
  color: theme.palette.common.white,
  padding: theme.spacing(2, 3),
}));

// Form divider
export const FormDivider = styled(Box)(({ theme }) => ({
  height: 1,
  backgroundColor: alpha(theme.palette.divider, 0.1),
  margin: theme.spacing(3, 0),
}));

// Save button with gradient and animation
export const SaveButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 3),
  textTransform: "none",
  fontWeight: 600,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  color: theme.palette.common.white,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

// Cancel button with subtle styling
export const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 3),
  textTransform: "none",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.default, 0.9),
    color: theme.palette.text.primary,
  },
}));
