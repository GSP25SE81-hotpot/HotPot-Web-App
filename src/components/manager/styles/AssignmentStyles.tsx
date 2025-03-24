import {
  Box,
  Card,
  Typography,
  Chip,
  Avatar,
  Paper,
  Divider,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

export const AssignmentCard = styled(Card)(({ theme }) => ({
  height: "100%",
  borderRadius: 16,
  transition: "all 0.3s ease",
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(8px)",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: `0 12px 20px 0 ${alpha(theme.palette.common.black, 0.09)}`,
  },
}));

export const AssignmentHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(0, 0, 1, 0),
}));

export const StatusChip = styled(Chip)<{ status: "completed" | "inProgress" }>(
  ({ theme, status }) => {
    const color =
      status === "completed"
        ? theme.palette.success.main
        : theme.palette.primary.main;

    return {
      borderRadius: 12,
      fontWeight: 600,
      backgroundColor: alpha(color, 0.1),
      color: color,
      border: `1px solid ${alpha(color, 0.3)}`,
      "& .MuiChip-label": {
        padding: "0 10px",
      },
    };
  }
);

export const StaffAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: 48,
  height: 48,
  marginRight: theme.spacing(2),
  boxShadow: `0 4px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
}));

export const StaffInfo = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

export const StaffName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.1rem",
  color: theme.palette.text.primary,
}));

export const StaffId = styled(Typography)(({ theme }) => ({
  fontSize: "0.85rem",
  color: theme.palette.text.secondary,
}));

export const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1.5),
  "& svg": {
    color: theme.palette.primary.main,
    marginRight: theme.spacing(1.5),
    fontSize: 20,
  },
}));

export const InfoText = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
  fontWeight: 500,
}));

export const NotesContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  borderRadius: 12,
  border: `1px dashed ${alpha(theme.palette.divider, 0.5)}`,
}));

export const EmptyStateContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  textAlign: "center",
  borderRadius: 16,
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
}));

export const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(2)} 0`,
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.primary.light,
    0.2
  )}, transparent)`,
}));

export const TimeAgo = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: alpha(theme.palette.text.secondary, 0.8),
  fontStyle: "italic",
}));

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
