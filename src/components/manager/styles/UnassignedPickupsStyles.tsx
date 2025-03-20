import {
  Box,
  Typography,
  TableContainer,
  TableCell,
  TableRow,
  Button,
  Chip,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

export const PageTitle = styled(Typography)(({ theme }) => ({
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

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 12,
  boxShadow: "none",
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
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

export const CustomerName = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "0.9rem",
  color: theme.palette.text.primary,
}));

export const CustomerPhone = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

export const StatusChip = styled(Chip)<{ status: string }>(
  ({ theme, status }) => {
    let color;

    switch (status.toLowerCase()) {
      case "ready for pickup":
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

export const AssignButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "6px 16px",
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "0.8rem",
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

export const EmptyMessage = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  color: theme.palette.text.secondary,
  fontStyle: "italic",
}));

export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(5),
}));
