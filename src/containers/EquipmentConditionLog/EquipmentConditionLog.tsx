import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { styled, alpha } from "@mui/material/styles";

const StyledBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  borderRadius: 24,
  padding: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
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

const StyledTable = styled(Table)(({ theme }) => ({
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

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: "10px 24px",
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: 16,
    background: `linear-gradient(135deg, ${alpha(
      theme.palette.background.paper,
      0.95
    )}, ${alpha(theme.palette.background.default, 0.95)})`,
    backdropFilter: "blur(10px)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
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

const StatusChip = styled(Box)<{ status: EquipmentLog["status"] }>(
  ({ theme, status }) => ({
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: 12,
    fontSize: "0.875rem",
    fontWeight: 500,
    backgroundColor: alpha(
      status === "Available"
        ? theme.palette.success.main
        : status === "Needs Repair"
        ? theme.palette.error.main
        : theme.palette.warning.main,
      0.1
    ),
    color:
      status === "Available"
        ? theme.palette.success.main
        : status === "Needs Repair"
        ? theme.palette.error.main
        : theme.palette.warning.main,
    border: `1px solid ${alpha(
      status === "Available"
        ? theme.palette.success.main
        : status === "Needs Repair"
        ? theme.palette.error.main
        : theme.palette.warning.main,
      0.2
    )}`,
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-1px)",
      backgroundColor: alpha(
        status === "Available"
          ? theme.palette.success.main
          : status === "Needs Repair"
          ? theme.palette.error.main
          : theme.palette.warning.main,
        0.2
      ),
    },
  })
);

interface EquipmentLog {
  id: string;
  equipmentId: string;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  conditionBefore: string;
  conditionAfter: string;
  issues: string;
  status: "Available" | "In Maintenance" | "Needs Repair";
}

interface MaintenanceSchedule {
  id: string;
  equipmentId: string;
  scheduledDate: Date;
  completed: boolean;
}

const mockEquipmentLogs: EquipmentLog[] = [
  {
    id: "1",
    equipmentId: "HP-001",
    checkInDate: new Date("2024-03-01"),
    checkOutDate: new Date("2024-03-05"),
    conditionBefore: "Good condition, no visible damage",
    conditionAfter: "Minor scratches on exterior",
    issues: "None",
    status: "Available",
  },
  // Add more mock data as needed
];

const mockMaintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: "M1",
    equipmentId: "HP-001",
    scheduledDate: new Date("2024-04-01"),
    completed: false,
  },
];

const EquipmentConditionLog: React.FC = () => {
  const theme = useTheme();
  const [logs, setLogs] = useState<EquipmentLog[]>(mockEquipmentLogs);
  const [maintenanceSchedules] = useState<MaintenanceSchedule[]>(
    mockMaintenanceSchedules
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [newLog, setNewLog] = useState<
    Omit<EquipmentLog, "id" | "equipmentId" | "status">
  >({
    checkInDate: null,
    checkOutDate: null,
    conditionBefore: "",
    conditionAfter: "",
    issues: "",
  });

  const handleAddLog = () => {
    if (!newLog.checkInDate || !newLog.checkOutDate) {
      alert("Please select both check-in and check-out dates");
      return;
    }

    setLogs((prev) => [
      ...prev,
      {
        id: (prev.length + 1).toString(),
        equipmentId: `HP-${(prev.length + 1).toString().padStart(3, "0")}`,
        checkInDate: newLog.checkInDate!,
        checkOutDate: newLog.checkOutDate!,
        conditionBefore: newLog.conditionBefore || "",
        conditionAfter: newLog.conditionAfter || "",
        issues: newLog.issues || "",
        status: "Available",
      } as EquipmentLog,
    ]);

    setOpenDialog(false);
    setNewLog({
      checkInDate: null,
      checkOutDate: null,
      conditionBefore: "",
      conditionAfter: "",
      issues: "",
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StyledBox>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 4,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Equipment Condition Management
        </Typography>

        <Box sx={{ mb: 4 }}>
          <StyledButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add New Log Entry
          </StyledButton>
        </Box>

        <Alert
          severity="warning"
          sx={{
            mb: 3,
            borderRadius: 3,
            "& .MuiAlert-icon": {
              alignItems: "center",
            },
          }}
        >
          Recurring issue detected with HP-001: Consistent exterior scratches
          reported
        </Alert>

        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Equipment Logs
        </Typography>

        <StyledPaper sx={{ mb: 4 }}>
          <TableContainer>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Equipment ID</TableCell>
                  <TableCell>Check-out Date</TableCell>
                  <TableCell>Check-in Date</TableCell>
                  <TableCell>Condition Before</TableCell>
                  <TableCell>Condition After</TableCell>
                  <TableCell>Issues</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.equipmentId}</TableCell>
                    <TableCell>
                      {log.checkOutDate?.toLocaleDateString() ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      {log.checkInDate?.toLocaleDateString() ?? "N/A"}
                    </TableCell>
                    <TableCell>{log.conditionBefore}</TableCell>
                    <TableCell>{log.conditionAfter}</TableCell>
                    <TableCell>{log.issues || "None"}</TableCell>
                    <TableCell>
                      <StatusChip status={log.status}>{log.status}</StatusChip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
          </TableContainer>
        </StyledPaper>

        {/* Maintenance Schedule */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Maintenance Schedule
        </Typography>

        <StyledPaper>
          <TableContainer>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>Equipment ID</TableCell>
                  <TableCell>Scheduled Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {maintenanceSchedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{schedule.equipmentId}</TableCell>
                    <TableCell>
                      {schedule.scheduledDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <StatusChip
                        status={
                          schedule.completed ? "Available" : "In Maintenance"
                        }
                      >
                        {schedule.completed ? "Completed" : "Pending"}
                      </StatusChip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </StyledTable>
          </TableContainer>
        </StyledPaper>

        {/* Add Log Dialog */}
        <StyledDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            New Equipment Log Entry
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="Check-out Date"
                  value={newLog.checkOutDate}
                  onChange={(date) =>
                    setNewLog((prev) => ({
                      ...prev,
                      checkOutDate: date ? new Date(date) : null,
                    }))
                  }
                  slotProps={{
                    textField: {
                      required: true,
                      error: !newLog.checkOutDate,
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                  label="Check-in Date"
                  value={newLog.checkInDate}
                  onChange={(date) =>
                    setNewLog((prev) => ({
                      ...prev,
                      checkInDate: date ? new Date(date) : null,
                    }))
                  }
                  slotProps={{
                    textField: {
                      required: true,
                      error: !newLog.checkInDate,
                      fullWidth: true,
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <StyledTextField
                  fullWidth
                  label="Condition Before Rental"
                  multiline
                  rows={3}
                  value={newLog.conditionBefore}
                  onChange={(e) =>
                    setNewLog((prev) => ({
                      ...prev,
                      conditionBefore: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <StyledTextField
                  fullWidth
                  label="Condition After Rental"
                  multiline
                  rows={3}
                  value={newLog.conditionAfter}
                  onChange={(e) =>
                    setNewLog((prev) => ({
                      ...prev,
                      conditionAfter: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <StyledTextField
                  fullWidth
                  label="Issues Found"
                  multiline
                  rows={2}
                  value={newLog.issues}
                  onChange={(e) =>
                    setNewLog((prev) => ({ ...prev, issues: e.target.value }))
                  }
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <StyledButton onClick={() => setOpenDialog(false)}>
              Cancel
            </StyledButton>
            <StyledButton
              variant="contained"
              onClick={handleAddLog}
              disabled={!newLog.checkInDate || !newLog.checkOutDate}
            >
              Add Entry
            </StyledButton>
          </DialogActions>
        </StyledDialog>
      </StyledBox>
    </LocalizationProvider>
  );
};

export default EquipmentConditionLog;
