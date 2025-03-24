import { Button, Paper, TextField, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

export const AdjustmentTitle = styled(Typography)(({ theme }) => ({
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

export const WarningText = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: 8,
  backgroundColor: alpha(theme.palette.warning.light, 0.1),
  border: `1px solid ${alpha(theme.palette.warning.light, 0.3)}`,
  "&::before": {
    content: '"⚠️ "',
    marginRight: theme.spacing(1),
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
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
    fontWeight: 500,
  },
}));

export const NotesTextField = styled(TextField)(({ theme }) => ({
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
    fontWeight: 500,
  },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "12px 24px",
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  fontWeight: 600,
  marginTop: theme.spacing(2),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
  },
}));

export const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(8px)",
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
}));
