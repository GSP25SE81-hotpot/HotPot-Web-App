// src/styles/GroupedVehicleSelectionStyles.tsx
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Typography,
  styled,
  alpha,
} from "@mui/material";

// Main container for the vehicle selection
export const VehicleSelectionContainer = styled(Box)(() => ({
  width: "100%",
}));

// Styled form control with consistent spacing
export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  "& .MuiInputLabel-root": {
    fontSize: "0.9rem",
  },
  "& .MuiSelect-select": {
    padding: theme.spacing(1.5, 2),
  },
}));

// Styled select with custom dropdown styling
export const StyledSelect = styled(Select<string | number>)(({ theme }) => ({
  borderRadius: 8,
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.divider, 0.3),
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: alpha(theme.palette.primary.main, 0.5),
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main,
  },
}));

// Styled menu item for vehicle options
export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  "&.Mui-selected": {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.15),
    },
  },
}));

// Vehicle item container within dropdown
export const VehicleItemContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

// Section title for direct selection
export const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
}));

// Vehicle type header with icon
export const VehicleTypeHeader = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(0.5),
  fontWeight: 600,
  fontSize: "0.85rem",
  color: theme.palette.text.primary,
}));

// Container for vehicle buttons
export const VehicleButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

// Styled vehicle selection button
export const VehicleButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isSelected",
})<{ isSelected?: boolean }>(({ theme, isSelected }) => ({
  borderRadius: 16,
  textTransform: "none",
  fontSize: "0.85rem",
  padding: theme.spacing(0.5, 1.5),
  transition: "all 0.2s",
  backgroundColor: isSelected ? theme.palette.primary.main : "transparent",
  color: isSelected
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  borderColor: isSelected
    ? theme.palette.primary.main
    : alpha(theme.palette.divider, 0.5),
  "&:hover": {
    backgroundColor: isSelected
      ? theme.palette.primary.dark
      : alpha(theme.palette.primary.main, 0.05),
    transform: "translateY(-2px)",
    boxShadow: isSelected
      ? `0 4px 8px ${alpha(theme.palette.primary.main, 0.3)}`
      : `0 2px 4px ${alpha(theme.palette.common.black, 0.05)}`,
  },
}));

// Debug information container
export const DebugContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
  backgroundColor: alpha(theme.palette.background.paper, 0.6),
  borderRadius: 8,
  border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`,
}));

// Order size helper text container
export const OrderSizeContainer = styled(FormHelperText)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  fontSize: "0.8rem",
}));

// Suggestion chip for vehicle type
export const SuggestionChip = styled(Chip)(({ theme }) => ({
  height: 20,
  fontSize: "0.7rem",
  fontWeight: 500,
  backgroundColor: alpha(theme.palette.success.main, 0.1),
  color: theme.palette.success.main,
  borderColor: alpha(theme.palette.success.main, 0.3),
  "& .MuiChip-icon": {
    fontSize: "0.8rem",
    color: theme.palette.success.main,
  },
}));
