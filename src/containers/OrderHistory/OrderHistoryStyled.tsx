// src/components/OrderHistory/OrderHistoryStyled.tsx
import {
  Box,
  Chip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TablePagination,
  TablePaginationProps,
  Paper,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

// Order History Container
export const OrderHistoryContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.7
  )}, ${alpha(theme.palette.background.default, 0.8)})`,
  backdropFilter: "blur(10px)",
}));

// Order History Accordion
export const OrderHistoryAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: "16px !important",
  overflow: "hidden",
  "&:before": { display: "none" },
  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.08)}`,
  },
  "&.Mui-expanded": {
    margin: theme.spacing(6, 0),
    boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.1)}`,
  },
}));

// Order History Accordion Summary
export const OrderHistoryAccordionSummary = styled(AccordionSummary)(
  ({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? alpha(theme.palette.background.paper, 0.6)
        : alpha(theme.palette.background.default, 0.6),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    transition: "background-color 0.2s ease-in-out",
    padding: theme.spacing(2, 3),
    "&:hover": {
      backgroundColor:
        theme.palette.mode === "dark"
          ? alpha(theme.palette.background.paper, 0.8)
          : alpha(theme.palette.background.default, 0.8),
    },
    "& .MuiAccordionSummary-content": {
      margin: theme.spacing(1.5, 0),
    },
  })
);

// Order History Accordion Details
export const OrderHistoryAccordionDetails = styled(AccordionDetails)(
  ({ theme }) => ({
    padding: theme.spacing(6),
    backgroundColor: alpha(theme.palette.background.paper, 0.5),
  })
);

// Order Code Typography
export const OrderCode = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.125rem", // Increased from 1rem
  color: theme.palette.primary.main,
}));

// Customer Name Typography
export const CustomerNameTypography = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem", // Increased from 0.875rem
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

// Order Status Container
export const OrderStatusContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
}));

// Order Price Typography
export const OrderPrice = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.125rem", // Increased from 1rem
  color: theme.palette.primary.main,
  display: "flex",
  alignItems: "center",
}));

// Order Date Container
export const OrderDateContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  color: theme.palette.text.secondary,
  fontSize: "0.95rem", // Increased from 0.875rem
}));

// Order Detail Label
export const OrderDetailLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem", // Increased from 0.875rem
  color: theme.palette.text.secondary,
  fontWeight: 500,
}));

// Order Detail Value
export const OrderDetailValue = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem", // Increased from 0.875rem
  color: theme.palette.text.primary,
}));

// Order Items Table Container
export const OrderItemsTableContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  borderRadius: 12,
  overflow: "hidden",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  marginBottom: theme.spacing(3),
}));

// Order Item Name
export const OrderItemName = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "0.95rem", // Increased from 0.875rem
  color: theme.palette.text.primary,
}));

// Order Item Type
export const OrderItemType = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem", // Increased from 0.75rem
  color: theme.palette.text.secondary,
}));

// Rental Info Container
export const RentalInfoContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(3),
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

// Rental Item Container
export const RentalItemContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2.5),
  borderRadius: 8,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  "&:last-child": {
    marginBottom: 0,
  },
}));

// Rental Date Label
export const RentalDateLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem", // Increased from 0.75rem
  color: theme.palette.text.secondary,
  fontWeight: 500,
}));

// Rental Date Value
export const RentalDateValue = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem", // Increased from 0.875rem
  color: theme.palette.text.primary,
}));

// Fee Typography
export const FeeTypography = styled(Typography)<{ isPositive?: boolean }>(
  ({ theme, isPositive }) => ({
    fontSize: "0.95rem", // Increased from 0.875rem
    color: isPositive ? theme.palette.success.main : theme.palette.error.main,
    fontWeight: 500,
  })
);

// Feature Chip
export const FeatureChip = styled(Chip)(({ theme }) => ({
  borderRadius: 10,
  height: 30, // Increased from 28
  fontSize: "0.85rem", // Increased from 0.75rem
  backgroundColor: alpha(theme.palette.info.main, 0.1),
  color: theme.palette.info.main,
  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
  "& .MuiChip-icon": {
    color: "inherit",
  },
}));

// Custom Table Pagination
export const OrderHistoryPagination = styled(
  TablePagination
)<TablePaginationProps>(({ theme }) => ({
  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
    margin: 0,
    fontSize: "0.95rem", // Increased from 0.875rem
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
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginTop: theme.spacing(2),
}));

// Filter Form Container
export const FilterFormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: 16,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: "blur(8px)",
  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
}));

// Filter Section Title
export const FilterSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem", // Increased from 1.1rem
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  position: "relative",
  paddingLeft: theme.spacing(1),
  "&:before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    height: "70%",
    width: 3,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 4,
  },
}));

// Filter Actions Container
export const FilterActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

// Empty State Paper
export const EmptyStatePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 300,
  borderRadius: 24,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: "blur(10px)",
}));

// Empty State Icon
export const EmptyStateIcon = styled(Box)(({ theme }) => ({
  fontSize: 80, // Increased from 72
  color: alpha(theme.palette.text.secondary, 0.3),
  marginBottom: theme.spacing(2),
}));

// Empty State Title
export const EmptyStateTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.35rem", // Increased from 1.25rem
  fontWeight: 600,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// Empty State Message
export const EmptyStateMessage = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem", // Increased from 0.875rem
  color: alpha(theme.palette.text.secondary, 0.7),
}));
