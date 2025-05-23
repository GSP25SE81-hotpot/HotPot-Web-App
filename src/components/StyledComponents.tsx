import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Paper,
  Select,
  SelectProps,
  Stepper,
  TextField,
  Container,
  Table,
  FormControl,
  IconButton,
  Typography,
  Divider,
  TypographyProps,
  TableContainer,
  TablePagination,
  Stack,
} from "@mui/material";
import { ReplacementRequestStatus } from "../types/replacement";
import { alpha, styled } from "@mui/material/styles";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 24,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  padding: theme.spacing(3),
  height: "100%",
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(8px)",
  borderRadius: 16,
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: `0 12px 20px 0 ${alpha(theme.palette.common.black, 0.1)}`,
  },
}));

export const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "10px 24px",
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  fontWeight: 600,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
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
}));

export const StyledSelect = styled(Select)<SelectProps<unknown>>(() => ({
  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: 12,
  },
  "& .MuiSelect-select": {
    padding: "12px 16px",
  },
}));

export const StyledStepper = styled(Stepper)(({ theme }) => ({
  "& .MuiStepLabel-root": {
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  "& .MuiStepLabel-label": {
    marginTop: theme.spacing(1),
    fontSize: "0.8rem",
  },
}));

export const StyledAvatar = styled(Avatar)(({ theme }) => ({
  bgcolor: theme.palette.primary.main,
}));

export const CenteredBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  py: 8,
});

export const StyledContainer = styled(Container)(({ theme }) => ({
  "& .MuiTypography-h4": {
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontWeight: 700,
    marginBottom: theme.spacing(3),
  },
}));

export const StyledTable = styled(Table)(({ theme }) => ({
  "& .MuiTableCell-head": {
    fontWeight: 600,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  "& .MuiTableCell-root": {
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
}));

export const StyledFormControl = styled(FormControl)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
  },
  "& .MuiSelect-select": {
    padding: "8px 14px",
  },
}));

export const StyledChip = styled(Chip)<{
  status: ReplacementRequestStatus | string;
}>(({ theme, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case ReplacementRequestStatus.Pending:
        return theme.palette.warning.main;
      case ReplacementRequestStatus.Approved:
        return theme.palette.info.main;
      case ReplacementRequestStatus.InProgress:
        return theme.palette.primary.main;
      case ReplacementRequestStatus.Completed:
        return theme.palette.success.main;
      case ReplacementRequestStatus.Rejected:
      case ReplacementRequestStatus.Cancelled:
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };
  return {
    borderRadius: 12,
    fontWeight: 500,
    backgroundColor: alpha(getStatusColor(), 0.1),
    color: getStatusColor(),
  };
});

export const FilterButton = styled(IconButton)(({ theme }) => ({
  borderRadius: 10,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
}));

export const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.7
  )}, ${alpha(theme.palette.background.default, 0.8)})`,
  backdropFilter: "blur(10px)",
}));

export const SectionHeading = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: "1.5rem",
    fontWeight: 700,
    marginBottom: theme.spacing(1),
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

export const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: `${theme.spacing(2)} 0 ${theme.spacing(4)} 0`,
  background: `linear-gradient(90deg, ${alpha(
    theme.palette.primary.light,
    0.2
  )}, transparent)`,
  height: 1,
}));

export const CardIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  borderRadius: 12,
  marginRight: theme.spacing(2),
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0.1
  )}, ${alpha(theme.palette.primary.light, 0.2)})`,
  color: theme.palette.primary.main,
  transition: "all 0.3s ease",
  "& svg": {
    fontSize: 24,
  },
}));

export const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.1rem",
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(0.5),
}));

export const CardDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.9rem",
  lineHeight: 1.5,
}));

export const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: `0 6px 16px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  "& .MuiTableCell-head": {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    color: theme.palette.primary.main,
    fontWeight: 600,
    padding: "16px",
  },
  "& .MuiTableRow-root": {
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    },
    "&:last-child td": {
      borderBottom: 0,
    },
  },
  "& .MuiTableCell-body": {
    padding: "16px",
  },
}));

export const CustomerCell = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export const CustomerName = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: "0.9rem",
}));

export const CustomerPhone = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.8rem",
}));

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
}));

export const StatusContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
}));

export const AssignmentChip = styled(Chip)<{ status: "completed" | "pending" }>(
  ({ theme, status }) => ({
    borderRadius: 12,
    fontWeight: 600,
    fontSize: "0.75rem",
    backgroundColor:
      status === "completed"
        ? alpha(theme.palette.success.main, 0.1)
        : alpha(theme.palette.warning.main, 0.1),
    color:
      status === "completed"
        ? theme.palette.success.main
        : theme.palette.warning.main,
    border: `1px solid ${
      status === "completed"
        ? alpha(theme.palette.success.main, 0.3)
        : alpha(theme.palette.warning.main, 0.3)
    }`,
  })
);

export const FilterContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: "blur(8px)",
  boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
}));

export const EmptyStateContainer = styled(StyledPaper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 200,
  gap: theme.spacing(2),
}));
export const OverdueChip = styled(Chip)<{
  severity: "high" | "medium" | "low";
}>(({ theme, severity }) => {
  const getSeverityColor = () => {
    switch (severity) {
      case "high":
        return theme.palette.error.main;
      case "medium":
        return theme.palette.warning.main;
      case "low":
        return theme.palette.warning.light;
      default:
        return theme.palette.warning.main;
    }
  };

  return {
    borderRadius: 12,
    fontWeight: 600,
    fontSize: "0.75rem",
    backgroundColor: alpha(getSeverityColor(), 0.1),
    color: getSeverityColor(),
    border: `1px solid ${alpha(getSeverityColor(), 0.3)}`,
  };
});

export const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
    margin: 0,
  },
  ".MuiTablePagination-select": {
    paddingTop: 8,
    paddingBottom: 8,
  },
  ".MuiTablePagination-actions": {
    "& .MuiIconButton-root": {
      padding: 8,
      borderRadius: 8,
      transition: "all 0.2s",
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      },
    },
  },
}));

export const EquipmentCell = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
}));

export const EquipmentName = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: "0.9rem",
}));

export const EquipmentType = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.8rem",
}));

export const PriceCell = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.main,
  fontSize: "0.95rem",
}));

export const DateCell = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "0.9rem",
  display: "flex",
  alignItems: "center",
  "& svg": {
    marginRight: theme.spacing(0.5),
    fontSize: "1rem",
    color: theme.palette.info.main,
  },
}));

// Container for the entire feedback management page
export const FeedbackContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.default,
    0.95
  )}, ${alpha(theme.palette.background.paper, 0.95)})`,
  minHeight: "100vh",
}));

// Title for the feedback management page
export const FeedbackTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(4),
}));

// Stats container
export const StatsContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
}));

// Stats item
export const StatItem = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
}));

// Loading container
export const LoadingContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  margin: "2rem 0",
}));

// Empty state message
export const EmptyStateMessage = styled(Typography)(() => ({
  textAlign: "center",
  margin: "2rem 0",
}));

// Feedback list container
export const FeedbackList = styled(Stack)(() => ({
  spacing: 3,
}));

// Response input container
export const ResponseInputContainer = styled(Stack)(({ theme }) => ({
  spacing: theme.spacing(2),
}));

// Response actions container
export const ResponseActionsContainer = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  spacing: theme.spacing(2),
  justifyContent: "flex-end",
}));

// Pagination container
export const PaginationContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  marginTop: "2rem",
}));

// Submit button
export const SubmitButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  borderRadius: 8,
  textTransform: "none",
  fontWeight: 600,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: theme.palette.success.dark,
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
}));

// Response button
export const ResponseButton = styled(Button)(() => ({
  alignSelf: "flex-start",
  marginTop: "0.5rem",
}));

// Feedback response section
export const ResponseSection = styled(Stack)(({ theme }) => ({
  spacing: theme.spacing(1),
}));

// Feedback date text
export const DateText = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
}));

// Rating container
export const RatingContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
}));

// Rating score text
export const RatingScoreText = styled(Typography)(({ theme }) => ({
  fontSize: "0.875rem",
  color: theme.palette.text.secondary,
}));

// Order info text
export const OrderInfoText = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
}));
