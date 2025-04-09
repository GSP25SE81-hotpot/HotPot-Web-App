import {
  Box,
  Button,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled Components
export const ListContainer = styled(Box)(() => ({
  width: "100%",
}));

export const TableWrapper = styled(TableContainer)(({ theme }) => ({
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

export const StyledTable = styled(Table)(() => ({
  minWidth: 650,
}));

export const TableHeader = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

export const HeaderCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: "bold",
}));

export const DataRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

export const ActionButton = styled(Button)(() => ({
  textTransform: "none",
}));

export const EmptyMessage = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
  textAlign: "center",
}));
