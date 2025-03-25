// src/components/manager/styles/OrderStatusCardStyles.tsx
import {
  Box,
  Paper,
  Typography,
  styled,
  alpha,
  TypographyProps,
} from "@mui/material";

// Status card with hover effect and status color border
export const StatusCardContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "statuscolor",
})<{ statuscolor: string }>(({ theme, statuscolor }) => ({
  padding: theme.spacing(3),
  display: "flex",
  flexDirection: "column",
  height: 140,
  borderRadius: 16,
  borderTop: `4px solid ${statuscolor}`,
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(8px)",
  transition: "all 0.3s ease-in-out",
  boxShadow: `0 6px 16px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 12px 24px 0 ${alpha(theme.palette.common.black, 0.12)}`,
    borderTopWidth: "6px",
  },
}));

// Status label with proper spacing
export const StatusLabel = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1.5),
}));

// Count container with flex layout
export const CountContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: theme.spacing(1),
}));

// Define the props interface for CountValue
interface CountValueProps extends TypographyProps {
  statuscolor: string;
}

// Count value with gradient text - fixed type definition
export const CountValue = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "statuscolor",
})<CountValueProps>(({ statuscolor }) => ({
  fontSize: "2.5rem",
  fontWeight: 700,
  background: `linear-gradient(45deg, ${statuscolor}, ${alpha(
    statuscolor,
    0.7
  )})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  lineHeight: 1.2,
}));

// Status indicator dot
export const StatusDot = styled(Box, {
  shouldForwardProp: (prop) => prop !== "statuscolor",
})<{ statuscolor: string }>(({ statuscolor }) => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  backgroundColor: statuscolor,
  boxShadow: `0 0 8px ${statuscolor}`,
}));

// Order count label
export const OrderCountLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(1),
  fontWeight: 500,
}));
