// src/pages/payments/PaymentTable.styles.ts
import { styled } from "@mui/material/styles";
import {
  Box,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControl,
} from "@mui/material";

export const TableWrapper = styled(Paper)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

export const StyledTableContainer = styled(TableContainer)(() => ({
  maxHeight: "calc(100vh - 300px)",
}));

export const TableHeader = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  "& .MuiTableCell-root": {
    fontWeight: 600,
  },
}));

export const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

export const ClickableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const LoadingCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
}));

export const EmptyCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export const PaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const PaginationInfo = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const PaginationControls = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

export const PageSizeSelector = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

export const PageSizeLabel = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

export const PageSizeControl = styled(FormControl)(() => ({
  minWidth: 80,
}));
