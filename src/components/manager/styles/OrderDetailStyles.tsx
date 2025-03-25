// src/styles/OrderDetailStyles.tsx
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Paper,
  Typography,
  styled,
  alpha,
} from "@mui/material";
import { OrderStatus } from "../../../api/Services/orderManagementService";

// Main container for the order detail page
export const DetailPageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.default,
    0.95
  )}, ${alpha(theme.palette.background.paper, 0.95)})`,
  minHeight: "100vh",
}));

// Back button with hover effect
export const BackButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.2s",
  "&:hover": {
    transform: "translateX(-4px)",
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
}));

// Header paper with gradient background
export const HeaderPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(8px)",
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
}));

// Header container with flex layout
export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(2),
  },
}));

// Order title with gradient text
export const OrderTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.75rem",
  fontWeight: 700,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

// Status chip with dynamic color based on status
export const StatusChip = styled(Chip)<{ status: OrderStatus }>(
  ({ theme, status }) => {
    const getStatusColor = () => {
      switch (status) {
        case OrderStatus.Pending:
          return theme.palette.warning.main;
        case OrderStatus.Processing:
          return theme.palette.info.main;
        case OrderStatus.Shipping:
          return theme.palette.primary.main;
        case OrderStatus.Delivered:
          return theme.palette.success.light;
        case OrderStatus.Completed:
          return theme.palette.success.main;
        case OrderStatus.Cancelled:
          return theme.palette.error.main;
        case OrderStatus.Returning:
          return theme.palette.warning.dark;
        default:
          return theme.palette.grey[500];
      }
    };

    return {
      backgroundColor: getStatusColor(),
      color: "white",
      fontWeight: 600,
      fontSize: "0.9rem",
      padding: theme.spacing(1, 2),
      borderRadius: 12,
      boxShadow: `0 2px 8px ${alpha(getStatusColor(), 0.4)}`,
    };
  }
);

// Order info grid
export const OrderInfoGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

// Order info item
export const OrderInfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
}));

// Label for order info
export const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  fontWeight: 500,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

// Value for order info
export const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

// Action buttons container
export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
}));

// Action button
export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  padding: theme.spacing(1, 2),
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

// Detail card with hover effect
export const DetailCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: 16,
  overflow: "hidden",
  transition: "all 0.3s ease",
  boxShadow: `0 6px 16px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 24px 0 ${alpha(theme.palette.common.black, 0.12)}`,
  },
}));

// Card header with gradient background
export const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.primary.main,
    0.05
  )}, ${alpha(theme.palette.primary.light, 0.1)})`,
  "& .MuiCardHeader-title": {
    fontSize: "1.25rem",
    fontWeight: 600,
    color: theme.palette.primary.main,
  },
}));

// Card content with proper padding
export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

// Customer name with gradient text
export const CustomerName = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
  background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${alpha(
    theme.palette.text.primary,
    0.7
  )})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
}));

// Customer email
export const CustomerEmail = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

// Section title
export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
  marginTop: theme.spacing(2),
}));

// Section value
export const SectionValue = styled(Typography)(({ theme }) => ({
  fontSize: "1rem",
  fontWeight: 500,
  marginBottom: theme.spacing(2),
}));

// Delivery chip
export const DeliveryChip = styled(Chip)<{ delivered: boolean }>(
  ({ theme, delivered }) => ({
    backgroundColor: delivered
      ? theme.palette.success.main
      : theme.palette.warning.main,
    color: "white",
    fontWeight: 600,
    fontSize: "0.8rem",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(0.5),
  })
);

// Empty state container
export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4),
}));

// Empty state text
export const EmptyStateText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

// Order items list container
export const OrderItemsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

// Order item section title
export const ItemSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(3),
  position: "relative",
  paddingLeft: theme.spacing(2),
  "&:before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
  },
}));

// Order total container
export const OrderTotalContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

// Order total text
export const OrderTotal = styled(Typography)(({ theme }) => ({
  fontSize: "1.25rem",
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

// Loading container
export const LoadingContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "80vh",
}));

// Error container
export const ErrorContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
}));
