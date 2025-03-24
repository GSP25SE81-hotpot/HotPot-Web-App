import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

export const CalculatorContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.7
  )}, ${alpha(theme.palette.background.default, 0.8)})`,
  backdropFilter: "blur(10px)",
}));

export const CalculatorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 16,
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(8px)",
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
}));

export const CalculatorTitle = styled(Typography)(({ theme }) => ({
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

export const CalculateButton = styled(Button)(({ theme }) => ({
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

export const ResultContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  animation: "fadeIn 0.5s ease-in-out",
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

export const ResultDivider = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(2)} 0 ${theme.spacing(3)} 0`,
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.primary.light,
    0.3
  )}, transparent)`,
  height: 1,
}));

export const ResultTitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

export const ResultBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

export const ResultItem = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  fontSize: "0.95rem",
  "& strong": {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
}));

export const FeeAmount = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: "1.5rem",
  fontWeight: 700,
  color: theme.palette.primary.main,
  textAlign: "center",
  padding: theme.spacing(1.5),
  borderRadius: 8,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}));
