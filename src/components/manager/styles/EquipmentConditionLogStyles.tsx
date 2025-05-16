import {
  Box,
  Button,
  Dialog,
  Paper,
  Table,
  TextField,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableContainer as MuiTableContainer,
  TableContainerProps as MuiTableContainerProps,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { MaintenanceStatus } from "../../../api/Services/equipmentConditionService";

export const StyledBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  borderRadius: 24,
  padding: theme.spacing(4),
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(145deg, ${alpha(
    theme.palette.background.paper,
    0.8
  )}, ${alpha(theme.palette.background.default, 0.9)})`,
  backdropFilter: "blur(8px)",
  borderRadius: 16,
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
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
  "& .MuiTableRow-root": {
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
      transform: "translateY(-2px)",
    },
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "10px 24px",
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.background.paper,
      0.95
    )}, ${alpha(theme.palette.background.default, 0.95)})`,
    backdropFilter: "blur(10px)",
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

export const StatusChip = styled(Box)<{ status: MaintenanceStatus }>(
  ({ theme, status }) => ({
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 12,
    fontSize: "0.875rem",
    fontWeight: 500,
    backgroundColor: alpha(
      status === MaintenanceStatus.Completed
        ? theme.palette.success.main
        : status === MaintenanceStatus.Pending
        ? theme.palette.warning.main
        : status === MaintenanceStatus.InProgress
        ? theme.palette.info.main
        : theme.palette.error.main,
      0.1
    ),
    color:
      status === MaintenanceStatus.Completed
        ? theme.palette.success.main
        : status === MaintenanceStatus.Pending
        ? theme.palette.warning.main
        : status === MaintenanceStatus.InProgress
        ? theme.palette.info.main
        : theme.palette.error.main,
    border: `1px solid ${alpha(
      status === MaintenanceStatus.Completed
        ? theme.palette.success.main
        : status === MaintenanceStatus.Pending
        ? theme.palette.warning.main
        : status === MaintenanceStatus.InProgress
        ? theme.palette.info.main
        : theme.palette.error.main,
      0.2
    )}`,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-1px)",
      backgroundColor: alpha(
        status === MaintenanceStatus.Completed
          ? theme.palette.success.main
          : status === MaintenanceStatus.Pending
          ? theme.palette.warning.main
          : status === MaintenanceStatus.InProgress
          ? theme.palette.info.main
          : theme.palette.error.main,
        0.2
      ),
    },
  })
);

export const getStatusText = (status: MaintenanceStatus) => {
  switch (status) {
    case MaintenanceStatus.Pending:
      return "Đang chờ xử lý";
    case MaintenanceStatus.InProgress:
      return "Đang tiến hành";
    case MaintenanceStatus.Completed:
      return "Đã hoàn thành";
    case MaintenanceStatus.Cancelled:
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

export const TableContainer: React.FC<MuiTableContainerProps> = (props) => {
  return (
    <MuiTableContainer
      {...props}
      sx={{
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: (theme) =>
          `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
        background: (theme) => alpha(theme.palette.background.paper, 0.8),
        backdropFilter: "blur(8px)",
        ...props.sx,
      }}
    />
  );
};

export const TableHead = styled(MuiTableHead)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
}));

export const TableBody = styled(MuiTableBody)(() => ({
  "& .MuiTableRow-root:last-child .MuiTableCell-root": {
    borderBottom: "none",
  },
}));

export const TableRow = styled(MuiTableRow)(({ theme }) => ({
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: "translateY(-2px)",
  },
}));

export const TableCell = styled(MuiTableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));
