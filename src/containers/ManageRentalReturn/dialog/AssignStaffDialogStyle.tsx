import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  List,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemText,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

// Dialog styling
export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 24,
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.background.paper,
      0.9
    )}, ${alpha(theme.palette.background.default, 0.95)})`,
    backdropFilter: "blur(10px)",
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
    overflow: "hidden",
  },
}));

// Dialog title styling
export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  fontSize: "1.5rem",
  fontWeight: 700,
  padding: theme.spacing(3, 3, 2),
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.primary.main,
    0.05
  )}, transparent)`,
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: theme.spacing(3),
    width: "40%",
    height: 3,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
    borderRadius: 4,
  },
}));

// Dialog content styling
export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Dialog actions styling
export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3, 3),
  background: `linear-gradient(90deg, transparent, ${alpha(
    theme.palette.background.paper,
    0.5
  )})`,
}));

// Detail box styling
export const DetailBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2.5),
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  borderRadius: 16,
  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.04)}`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.06)}`,
  },
}));

// Section title styling
export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
  position: "relative",
  display: "inline-block",
  color: theme.palette.text.primary,
}));

// Detail text styling
export const DetailText = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  marginBottom: theme.spacing(0.75),
  "& strong": {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}));

// Equipment list styling
export const EquipmentList = styled(List)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  borderRadius: 16,
  padding: 0,
  overflow: "hidden",
  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.04)}`,
}));

// Equipment list item styling
export const EquipmentListItem = styled(ListItem)<{ selected?: boolean }>(
  ({ theme, selected }) => ({
    padding: 0,
    borderLeft: selected
      ? `4px solid ${theme.palette.primary.main}`
      : "4px solid transparent",
    transition: "all 0.2s ease-in-out",
  })
);

// Equipment list item button styling
export const EquipmentListItemButton = styled(
  ListItemButton
)<ListItemButtonProps>(({ theme, selected }) => ({
  padding: theme.spacing(1.5, 2),
  backgroundColor: selected
    ? alpha(theme.palette.primary.main, 0.08)
    : "transparent",
  "&:hover": {
    backgroundColor: selected
      ? alpha(theme.palette.primary.main, 0.12)
      : alpha(theme.palette.primary.main, 0.04),
  },
}));

// Equipment list item text styling
export const EquipmentListItemText = styled(ListItemText)(({ theme }) => ({
  "& .MuiListItemText-primary": {
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  "& .MuiListItemText-secondary": {
    fontSize: "0.8rem",
    color: theme.palette.text.secondary,
  },
}));

// Styled divider
export const StyledFormDivider = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(2)} 0 ${theme.spacing(3)} 0`,
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.primary.light,
    0.2
  )}, transparent)`,
  height: 1,
}));

// Styled form control
export const StyledFormControlSelect = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
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

// Styled notes text field
export const StyledNotesField = styled(TextField)(({ theme }) => ({
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

// Styled alert
export const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: theme.spacing(2),
  boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.1)}`,
}));

// Cancel button
export const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.black, 0.05),
  },
}));

// Submit button
export const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "8px 24px",
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.2s ease-in-out",
  boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
  "&:disabled": {
    backgroundColor: alpha(theme.palette.primary.main, 0.5),
  },
}));

// Loading indicator wrapper
export const LoadingWrapper = styled(Box)({
  display: "flex",
  alignItems: "center",
  "& .MuiCircularProgress-root": {
    marginRight: 8,
  },
});

// Staff item styling for the dropdown
export const StaffMenuItem = styled(MenuItem, {
  shouldForwardProp: (prop) => prop !== "isAvailable",
})<{ isAvailable?: boolean }>(({ theme, isAvailable }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(1.5, 2),
  "& .staff-status": {
    marginLeft: theme.spacing(1),
    fontSize: "0.75rem",
    fontWeight: 500,
    padding: theme.spacing(0.25, 1),
    borderRadius: 12,
    backgroundColor: isAvailable
      ? alpha(theme.palette.success.main, 0.1)
      : alpha(theme.palette.warning.main, 0.1),
    color: isAvailable
      ? theme.palette.success.main
      : theme.palette.warning.main,
  },
}));

// Vehicle item styling for the dropdown
export const VehicleMenuItem = styled(MenuItem)<{ vehicleType?: number }>(
  ({ theme, vehicleType }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1.5, 2),
    fontWeight: 500,
    color: theme.palette.text.primary,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
    "& .vehicle-icon": {
      marginRight: theme.spacing(1.5),
      color:
        vehicleType === 2
          ? theme.palette.primary.main
          : theme.palette.secondary.main,
      fontSize: "1.2rem",
    },
  })
);

// Loading state for the dialog
export const DialogLoadingOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  zIndex: 1,
  backdropFilter: "blur(4px)",
}));
