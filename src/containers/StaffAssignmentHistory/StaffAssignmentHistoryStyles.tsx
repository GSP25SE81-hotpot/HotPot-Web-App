// StaffAssignmentHistoryStyles.tsx
import {
  Box,
  Card,
  Typography,
  TableHead,
  TableRow,
  Chip,
  Button,
  TableCell,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { StaffTaskType } from "../../types/orderManagement";

// Styled Components
export const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: "100%",
  overflow: "hidden",
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  color: theme.palette.primary.main,
}));

export const FilterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  position: "relative",
}));

export const FilterTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const FilterActions = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

export const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const ResetButton = styled(Button)(({ theme }) => ({
  borderColor: theme.palette.grey[400],
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
  },
}));

export const ResultsContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  overflow: "hidden",
}));

export const TableTitle = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2, 2, 1, 2),
}));

export const TableSummary = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  "& th": {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}));

interface StyledTableRowProps {
  $isEven: boolean;
}

export const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== "$isEven",
})<StyledTableRowProps>(({ theme, $isEven }) => ({
  backgroundColor: $isEven
    ? theme.palette.grey[50]
    : theme.palette.background.paper,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  transition: "background-color 0.2s",
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(8, 0),
}));

export const StaffInfoContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0),
}));

export const StaffName = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: "0.875rem",
}));

export const AdditionalStaffContainer = styled(Box)(({ theme }) => ({
  gap: theme.spacing(0),
}));

export const AdditionalStaffChip = styled(Chip)(() => ({
  fontSize: "0.75rem",
  height: 24,
}));

export const DateCell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.primary,
  height: "100%",
  verticalAlign: "middle", // Căn giữa theo chiều dọc
  padding: theme.spacing(1.5),
}));

interface StatusChipProps {
  $isActive: boolean;
}

export const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "$isActive",
})<StatusChipProps>(({ theme, $isActive }) => ({
  backgroundColor: $isActive
    ? theme.palette.success.main
    : theme.palette.grey[600],
  color: theme.palette.common.white,
  fontWeight: 500,
  "& .MuiChip-label": {
    padding: "0 10px",
  },
  border: `1px solid ${
    $isActive ? theme.palette.success.dark : theme.palette.grey[700]
  }`,
  boxShadow: `0 1px 2px ${
    theme.palette.mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"
  }`,
  height: 26,
  transition: "all 0.2s ease",
  "&:hover": {
    opacity: 0.9,
  },
}));

interface TaskTypeChipProps {
  $taskType: StaffTaskType;
}

export const TaskTypeChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "$taskType",
})<TaskTypeChipProps>(({ theme, $taskType }) => {
  let backgroundColor, textColor;

  switch ($taskType) {
    case StaffTaskType.Preparation:
      backgroundColor = theme.palette.primary.main;
      textColor = theme.palette.common.white;
      break;
    case StaffTaskType.Shipping:
      backgroundColor = theme.palette.secondary.main;
      textColor = theme.palette.common.white;
      break;
    case StaffTaskType.Pickup:
      backgroundColor = theme.palette.success.main;
      textColor = theme.palette.common.white;
      break;
    default:
      backgroundColor = theme.palette.grey[300];
      textColor = theme.palette.text.primary;
  }

  return {
    backgroundColor,
    color: textColor,
    fontWeight: 500,
    "& .MuiChip-label": {
      padding: "0 8px",
    },
    border: `5px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    transition: "background-color 0.2s ease-in-out",
  };
});

export const EmptyResultCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.grey[50],
  border: `1px dashed ${theme.palette.grey[300]}`,
  boxShadow: "none",
}));
