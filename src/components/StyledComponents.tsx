// src/components/order-management/components/StyledComponents.tsx

import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  ChipProps,
  Paper,
  Select,
  SelectProps,
  Stepper,
  TextField,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { OrderStatus } from "../types/orderManagement";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  padding: theme.spacing(3),
  height: "100%",
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(8px)",
  borderRadius: 16,
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 20px 0 ${alpha(theme.palette.common.black, 0.1)}`,
  },
}));

export const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "10px 24px",
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
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

export const StyledSelect = styled(Select)<SelectProps<unknown>>(() => ({
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: 12,
  },
  "& .MuiSelect-select": {
    padding: "12px 16px",
  },
}));

export const StyledStepper = styled(Stepper)(({ theme }) => ({
  "& .MuiStepLabel-root": {
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  "& .MuiStepLabel-label": {
    marginTop: theme.spacing(1),
    fontSize: "0.8rem",
  },
}));

interface StatusChipProps extends ChipProps {
  status: OrderStatus;
}

export const StatusChip = styled(Chip)<StatusChipProps>(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "PENDING_ASSIGNMENT":
        return theme.palette.info.main;
      case "ASSIGNED":
        return theme.palette.primary.main;
      case "SCHEDULED":
        return theme.palette.secondary.main;
      case "IN_PREPARATION":
        return theme.palette.warning.main;
      case "READY_FOR_PICKUP":
        return theme.palette.success.light;
      case "IN_TRANSIT":
        return theme.palette.warning.dark;
      case "DELIVERED":
        return theme.palette.success.main;
      case "CANCELLED":
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };
  return {
    backgroundColor: alpha(getStatusColor(), 0.1),
    color: getStatusColor(),
    borderRadius: 12,
    fontWeight: 600,
    border: `1px solid ${alpha(getStatusColor(), 0.3)}`,
    "& .MuiChip-icon": {
      color: getStatusColor(),
    },
  };
});

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  bgcolor: theme.palette.primary.main,
}));

export const CenteredBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  py: 8,
});
