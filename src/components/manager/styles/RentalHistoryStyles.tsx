import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Button,
  TableContainer,
  TableCell,
  TableRow,
  Chip,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

export const HistoryTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.75rem",
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  position: "relative",
  display: "inline-block",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: 60,
    height: 3,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, transparent)`,
    borderRadius: 4,
  },
}));

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  "& .MuiTabs-indicator": {
    height: 3,
    borderRadius: "3px 3px 0 0",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.95rem",
  minHeight: 48,
  padding: "12px 24px",
  transition: "all 0.2s ease",
  "&:hover": {
    color: theme.palette.primary.main,
    opacity: 1,
  },
  "&.Mui-selected": {
    color: theme.palette.primary.main,
    fontWeight: 700,
  },
}));

export const SearchContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
    "& > *": {
      marginRight: 0,
      marginBottom: theme.spacing(2),
    },
  },
}));

export const SearchField = styled(TextField)(({ theme }) => ({
  marginRight: theme.spacing(2),
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
  [theme.breakpoints.down("sm")]: {
    marginRight: 0,
    marginBottom: theme.spacing(2),
    width: "100%",
  },
}));

export const SearchButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "8px 24px",
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  fontWeight: 600,
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "none",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  marginTop: theme.spacing(2),
  overflow: "hidden",
}));

export const HeaderTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  color: theme.palette.text.primary,
  fontWeight: 600,
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
}));

export const BodyTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  "&:last-child td, &:last-child th": {
    borderBottom: 0,
  },
}));

export const StatusChip = styled(Chip)<{ status: string }>(
  ({ theme, status }) => {
    let color;

    switch (status.toLowerCase()) {
      case "active":
        color = theme.palette.primary.main;
        break;
      case "completed":
        color = theme.palette.success.main;
        break;
      case "cancelled":
        color = theme.palette.error.main;
        break;
      case "overdue":
        color = theme.palette.warning.main;
        break;
      case "pending":
        color = theme.palette.info.main;
        break;
      default:
        color = theme.palette.grey[500];
    }

    return {
      borderRadius: 12,
      fontWeight: 600,
      fontSize: "0.75rem",
      backgroundColor: alpha(color, 0.1),
      color: color,
      border: `1px solid ${alpha(color, 0.3)}`,
      "& .MuiChip-label": {
        padding: "0 8px",
      },
    };
  }
);

export const TabPanelContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  transition: "opacity 0.3s ease",
  animation: "fadeIn 0.3s ease-in-out",
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "translateY(10px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

export const ResultsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  transition: "all 0.3s ease",
}));
