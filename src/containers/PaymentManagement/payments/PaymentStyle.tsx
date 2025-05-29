import {
  Box,
  Button,
  Chip,
  ChipProps,
  Dialog,
  DialogTitle,
  Divider,
  FormControl,
  Grid2,
  IconButton,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  TypographyProps,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(1),
}));

export const ActionIconButton = styled(IconButton)(({ theme }) => ({
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

export const StyledTooltip = styled(Tooltip)(({ theme }) => ({
  tooltip: {
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[3],
    fontSize: 12,
    borderRadius: 8,
    padding: theme.spacing(1, 1.5),
    backdropFilter: "blur(8px)",
  },
}));

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 24,
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.background.paper,
      0.9
    )}, ${alpha(theme.palette.background.default, 0.95)})`,
    backdropFilter: "blur(10px)",
    boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
    overflow: "hidden",
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2, 3),
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.primary.main,
    0.05
  )}, transparent)`,
  "& .MuiTypography-root": {
    fontSize: "1.25rem",
    fontWeight: 600,
  },
}));

export const InfoSection = styled(Grid2)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const SectionTitle = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: "1.1rem",
    fontWeight: 600,
    marginBottom: theme.spacing(2),
    position: "relative",
    display: "inline-block",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: -5,
      left: 0,
      width: "40%",
      height: 3,
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
      borderRadius: 4,
    },
  })
);

export const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: theme.spacing(1.5),
}));

export const InfoLabel = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

export const InfoValue = styled(Typography)(({ theme }) => ({
  fontSize: "0.95rem",
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(2)} 0`,
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.primary.light,
    0.2
  )}, transparent)`,
  height: 1,
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.15)}`,
  },
}));

export const FilterContainer = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

export const FilterGrid = styled(Grid2)(() => ({
  alignItems: "center",
}));

export const FilterFormControl = styled(FormControl)(({ theme }) => ({
  width: "100%",
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
  "& .MuiInputLabel-root": {
    fontSize: "0.9rem",
  },
}));

export const ButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  justifyContent: "flex-end",
  alignItems: "center",
  height: "100%",
}));

export const SearchButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.2s ease-in-out",
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const ResetButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "8px 16px",
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.2s ease-in-out",
  borderColor: alpha(theme.palette.primary.main, 0.5),
  color: theme.palette.primary.main,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

export const DatePickerWrapper = styled(Box)(({ theme }) => ({
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

export const ReceiptDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2, 3),
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.secondary.main,
    0.05
  )}, transparent)`,
  "& .MuiTypography-root": {
    fontSize: "1.25rem",
    fontWeight: 600,
  },
}));

export const PrintIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    color: theme.palette.primary.main,
    transform: "rotate(90deg)",
  },
}));

export const ReceiptContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
}));

export const ReceiptTitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
}));

export const ReceiptSubtitle = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
}));

export const ReceiptDate = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(2),
}));

export const ReceiptDivider = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(2)} 0`,
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.primary.light,
    0.2
  )}, transparent, ${alpha(theme.palette.primary.light, 0.2)})`,
  height: 1,
}));

export const ReceiptGrid = styled(Grid2)(({ theme }) => ({
  padding: theme.spacing(2, 0),
}));

export const PrintButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "8px 24px",
  textTransform: "none",
  fontWeight: 600,
  transition: "all 0.2s ease-in-out",
  backgroundColor: theme.palette.secondary.main,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.secondary.main, 0.2)}`,
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export const StyledStatusChip = styled(Chip)<ChipProps & { status: string }>(
  ({ theme, status }) => {
    const getStatusColor = () => {
      switch (status) {
        case "Pending":
          return theme.palette.warning.main;
        case "Success":
          return theme.palette.success.main;
        case "Cancelled":
          return theme.palette.error.main;
        case "Refunded":
          return theme.palette.secondary.main;
        default:
          return theme.palette.grey[500];
      }
    };

    return {
      borderRadius: 12,
      fontWeight: 500,
      backgroundColor: alpha(getStatusColor(), 0.1),
      color: getStatusColor(),
      border: `1px solid ${alpha(getStatusColor(), 0.3)}`,
      "& .MuiChip-label": {
        padding: "0 8px",
      },
    };
  }
);

export const TableWrapper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  overflow: "hidden",
}));

export const StyledTableContainer = styled(TableContainer)(() => ({
  overflowX: "auto",
}));

export const TableHeader = styled(TableHead)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
}));

export const HeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

export const ClickableRow = styled(TableRow)(({ theme }) => ({
  cursor: "pointer",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    transform: "translateY(-1px)",
    boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.05)}`,
  },
  "& .MuiTableCell-root": {
    padding: theme.spacing(1.5, 2),
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
}));

export const LoadingCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
}));

export const EmptyCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
  fontSize: "0.95rem",
}));

export const PaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  flexWrap: "wrap",
  gap: theme.spacing(2),
}));

export const PaginationInfo = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
}));

export const PaginationControls = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  "& .MuiPagination-ul": {
    "& .MuiPaginationItem-root": {
      borderRadius: 8,
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
      "&.Mui-selected": {
        backgroundColor: alpha(theme.palette.primary.main, 0.15),
        color: theme.palette.primary.main,
        fontWeight: 600,
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
        },
      },
    },
  },
}));

export const PageSizeSelector = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

export const PageSizeLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  whiteSpace: "nowrap",
}));

export const PageSizeControl = styled(FormControl)(({ theme }) => ({
  minWidth: 70,
  "& .MuiOutlinedInput-root": {
    borderRadius: 8,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    "& .MuiSelect-select": {
      padding: theme.spacing(0.5, 1),
    },
  },
}));

export const AmountCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.success.main,
}));

export const IdCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.85rem",
}));

export const TransactionCodeCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.primary.main,
}));

export const CustomerNameCell = styled(TableCell)(() => ({
  fontWeight: 500,
}));

export const OrderCodeCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.info.main,
  fontWeight: 500,
}));

export const DateCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.85rem",
}));
