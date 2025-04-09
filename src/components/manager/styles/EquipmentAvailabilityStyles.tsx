// src/components/EquipmentAvailabilityStyles.tsx
import {
    Box,
    Card,
    CardContent,
    Chip,
    Paper,
    Stack,
    styled,
    Typography,
    TypographyProps,
  } from "@mui/material";
  import { alpha } from "@mui/material/styles";
  
  // Main container
  export const EquipmentContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
    borderRadius: theme.shape.borderRadius,
  }));
  
  // Equipment card
  export const EquipmentCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.shadows[8],
    },
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius * 2,
    overflow: "hidden",
  }));
  
  // Card content with padding
  export const StyledCardContent = styled(CardContent)(({ theme }) => ({
    padding: theme.spacing(3),
  }));
  
  // Equipment name typography
  export const EquipmentName = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(1),
  }));
  
  // Status chip with custom styling
  export const StatusChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== "isAvailable",
  })<{ isAvailable?: boolean }>(({ theme, isAvailable }) => ({
    borderRadius: theme.shape.borderRadius * 3,
    fontWeight: 500,
    padding: theme.spacing(0.5, 0),
    "& .MuiChip-icon": {
      marginLeft: theme.spacing(1),
    },
    ...(isAvailable
      ? {
          backgroundColor: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.dark,
          borderColor: theme.palette.success.light,
        }
      : {
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.dark,
          borderColor: theme.palette.warning.light,
        }),
  }));
  
  // Condition chip with custom styling
  export const ConditionChip = styled(Chip, {
    shouldForwardProp: (prop) => prop !== "condition",
  })<{ condition?: string }>(({ theme, condition }) => ({
    borderRadius: theme.shape.borderRadius * 3,
    fontWeight: 500,
    padding: theme.spacing(0.5, 0),
    "& .MuiChip-icon": {
      marginLeft: theme.spacing(1),
    },
    ...(condition === "Good"
      ? {
          backgroundColor: alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.dark,
          borderColor: theme.palette.success.light,
        }
      : condition === "Damaged"
      ? {
          backgroundColor: alpha(theme.palette.error.main, 0.1),
          color: theme.palette.error.dark,
          borderColor: theme.palette.error.light,
        }
      : {
          backgroundColor: alpha(theme.palette.warning.main, 0.1),
          color: theme.palette.warning.dark,
          borderColor: theme.palette.warning.light,
        }),
  }));
  
  // Filter chip with custom styling
  export const FilterChip = styled(Chip)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 3,
    fontWeight: 500,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.dark,
    borderColor: theme.palette.primary.light,
    "& .MuiChip-deleteIcon": {
      color: theme.palette.primary.main,
      "&:hover": {
        color: theme.palette.primary.dark,
      },
    },
  }));
  
  // Sorting paper with custom styling
  export const SortingPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    backdropFilter: "blur(8px)",
    boxShadow: theme.shadows[2],
  }));
  
  // Sort button container
  export const SortButtonsContainer = styled(Stack)(({ theme }) => ({
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    alignItems: "center",
  }));
  
  // Equipment details stack
  export const EquipmentDetailsStack = styled(Stack)(({ theme }) => ({
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
  }));
  
  // Quantity display
  export const QuantityDisplay = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  }));
  
  // Hover info container
  export const HoverInfoContainer = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(1.5),
    padding: theme.spacing(1.5),
    backgroundColor: alpha(theme.palette.background.default, 0.6),
    borderRadius: theme.shape.borderRadius,
    border: `1px dashed ${theme.palette.divider}`,
  }));
  
  // Pagination container
  export const PaginationContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(3),
    "& .MuiTablePagination-root": {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[1],
    },
  }));
  
  // Header container
  export const HeaderContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
  }));
  
  // Title typography
  export const PageTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
    fontWeight: 700,
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
  }));
  
  // Filter chips container
  export const FilterChipsContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
  }));
  
  // Empty state container
  export const EmptyStateContainer = styled(Box)(({ theme }) => ({
    textAlign: "center",
    padding: theme.spacing(6),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    border: `1px dashed ${theme.palette.divider}`,
  }));
  