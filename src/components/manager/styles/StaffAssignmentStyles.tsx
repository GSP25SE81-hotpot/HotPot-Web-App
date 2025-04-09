import {
  Box,
  Button,
  Checkbox,
  FormControl,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TableContainerProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components
export const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1200,
  margin: "0 auto",
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  color: theme.palette.primary.main,
}));

export const StyledFormControl = styled(FormControl)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  minWidth: 250,
}));

export const BackButton = styled(Button)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
}));

type StyledTableContainerProps = TableContainerProps & {
  component?: React.ElementType;
};

export const StyledTableContainer = styled(
  TableContainer
)<StyledTableContainerProps>(({ theme }) => ({
  marginTop: theme.spacing(2),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

export const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

export const HeadTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  fontSize: "1rem",
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    transition: "background-color 0.2s ease",
  },
}));

export const StyledTableCell = styled(TableCell)(() => ({
  fontSize: "0.95rem",
}));

export const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  color: theme.palette.primary.main,
  "&.Mui-checked": {
    color: theme.palette.primary.main,
  },
}));

export const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2),
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: theme.spacing(4),
}));

export const EmptyMessage = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.text.secondary,
  fontStyle: "italic",
}));
