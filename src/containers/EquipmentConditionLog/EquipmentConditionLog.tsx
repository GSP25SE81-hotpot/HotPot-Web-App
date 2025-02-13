import { WarningAmberRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";

interface ConditionLog {
  id: string;
  date: Date;
  condition: number; // 0-100 percentage
  notes: string;
  type: "pre-rental" | "post-rental" | "inspection";
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  lastInspection: Date;
  nextInspection: Date;
  condition: number;
  status: "excellent" | "good" | "fair" | "poor";
  history: ConditionLog[];
}

const mockEquipment: Equipment[] = [
  {
    id: "EQ-001",
    name: "Electric Hot Pot Pro",
    type: "Electric",
    lastInspection: new Date("2024-03-01"),
    nextInspection: new Date("2024-04-01"),
    condition: 85,
    status: "good",
    history: [
      {
        id: "CL-001",
        date: new Date("2024-03-15"),
        condition: 90,
        notes: "Pre-rental check - all functions normal",
        type: "pre-rental",
      },
      {
        id: "CL-002",
        date: new Date("2024-03-16"),
        condition: 85,
        notes: "Post-rental - minor exterior scratches",
        type: "post-rental",
      },
    ],
  },
  {
    id: "EQ-002",
    name: "Butane Portable Cooker",
    type: "Gas",
    lastInspection: new Date("2024-02-15"),
    nextInspection: new Date("2024-03-25"),
    condition: 65,
    status: "fair",
    history: [
      {
        id: "CL-003",
        date: new Date("2024-03-10"),
        condition: 70,
        notes: "Reported ignition issues",
        type: "inspection",
      },
    ],
  },
  {
    id: "EQ-003",
    name: "Premium Induction Cooktop",
    type: "Induction",
    lastInspection: new Date("2024-03-10"),
    nextInspection: new Date("2024-04-10"),
    condition: 45,
    status: "poor",
    history: [
      {
        id: "CL-004",
        date: new Date("2024-03-12"),
        condition: 50,
        notes: "Temperature control malfunction",
        type: "pre-rental",
      },
    ],
  },
];

const StatusChip = ({ status }: { status: Equipment["status"] }) => {
  const statusColors = {
    excellent: "#4CAF50",
    good: "#8BC34A",
    fair: "#FFC107",
    poor: "#F44336",
  };

  return (
    <Chip
      label={status}
      sx={{ backgroundColor: statusColors[status], color: "white" }}
    />
  );
};

const ConditionBar = ({ value }: { value: number }) => (
  <Box sx={{ display: "flex", alignItems: "center" }}>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{ width: "100%", mr: 1 }}
    />
    <Typography variant="body2" color="text.secondary">{`${Math.round(
      value
    )}%`}</Typography>
  </Box>
);

const EquipmentConditionLog = () => {
  const [equipmentList, setEquipmentList] =
    useState<Equipment[]>(mockEquipment);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
  const [newCondition, setNewCondition] = useState({
    date: new Date(),
    condition: 100,
    notes: "",
    type: "pre-rental" as ConditionLog["type"],
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "name", headerName: "Equipment Name", width: 200 },
    { field: "type", headerName: "Type", width: 120 },
    {
      field: "lastInspection",
      headerName: "Last Inspection",
      width: 150,
      valueFormatter: () => new Date().toLocaleDateString(),
    },
    {
      field: "nextInspection",
      headerName: "Next Inspection",
      width: 150,
      valueFormatter: () => new Date().toLocaleDateString(),
    },
    {
      field: "condition",
      headerName: "Condition",
      width: 200,
      renderCell: (params) => <ConditionBar value={params.value} />,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
  ];

  const handleLogCondition = (equipmentId: string) => {
    const equipment = equipmentList.find((eq) => eq.id === equipmentId);
    setSelectedEquipment(equipment || null);
    setLogDialogOpen(true);
  };

  const handleScheduleInspection = (equipmentId: string) => {
    const equipment = equipmentList.find((eq) => eq.id === equipmentId);
    setSelectedEquipment(equipment || null);
    setInspectionDialogOpen(true);
  };

  const handleSubmitCondition = () => {
    if (!selectedEquipment) return;

    const updatedEquipment = {
      ...selectedEquipment,
      condition: newCondition.condition,
      history: [
        ...selectedEquipment.history,
        {
          id: `CL-${Math.random().toString(36).substr(2, 9)}`,
          ...newCondition,
        },
      ],
    };

    setEquipmentList((prev) =>
      prev.map((eq) => (eq.id === selectedEquipment.id ? updatedEquipment : eq))
    );

    setLogDialogOpen(false);
    setNewCondition({
      date: new Date(),
      condition: 100,
      notes: "",
      type: "pre-rental",
    });
  };

  const handleScheduleNextInspection = (date: Date | null) => {
    if (!selectedEquipment || !date) return;

    const updatedEquipment = {
      ...selectedEquipment,
      nextInspection: date,
    };

    setEquipmentList((prev) =>
      prev.map((eq) => (eq.id === selectedEquipment.id ? updatedEquipment : eq))
    );

    setInspectionDialogOpen(false);
  };

  const hasRecurringIssues = (equipment: Equipment) => {
    return equipment.history.filter((log) => log.condition < 50).length >= 2;
  };

  const renderDetailPanel = ({ row }: { row: Equipment }) => (
    <Box sx={{ p: 3, borderTop: "1px solid rgba(224, 224, 224, 1)" }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 8 }}>
          <Typography variant="h6" gutterBottom>
            Maintenance History
          </Typography>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ maxHeight: 350, overflow: "auto" }}>
              {row.history.map((log) => (
                <Box
                  key={log.id}
                  sx={{ mb: 2, p: 1, borderBottom: "1px solid #eee" }}
                >
                  <Typography variant="subtitle2">
                    {new Date(log.date).toLocaleDateString()} - {log.type}
                  </Typography>
                  <ConditionBar value={log.condition} />
                  <Typography variant="body2" color="text.secondary">
                    {log.notes}
                  </Typography>
                </Box>
              ))}
              {row.history.length === 0 && (
                <Typography color="text.secondary">
                  No maintenance history recorded
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleLogCondition(row.id)}
            >
              Log New Condition
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleScheduleInspection(row.id)}
            >
              Schedule Inspection
            </Button>
            {hasRecurringIssues(row) && (
              <Paper sx={{ p: 2, bgcolor: "#fff3e0" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WarningAmberRounded color="warning" />
                  <Typography color="text.secondary">
                    Recurring issues detected - notify management
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Equipment Condition Monitoring
        </Typography>

        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={equipmentList}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            getRowHeight={() => "auto"}
            disableRowSelectionOnClick
            initialState={{
              sorting: {
                sortModel: [{ field: "nextInspection", sort: "asc" }],
              },
            }}
            sx={{
              "& .MuiDataGrid-cell": {
                py: 2,
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-row": {
                maxHeight: "none !important",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
              },
            }}
            getDetailPanelContent={renderDetailPanel}
          />
        </Box>

        {/* Log Condition Dialog */}
        <Dialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)}>
          <DialogTitle>Log Equipment Condition</DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <DatePicker
                label="Check Date"
                value={newCondition.date}
                onChange={(newValue) =>
                  setNewCondition({
                    ...newCondition,
                    date: newValue || new Date(),
                  })
                }
              />
              <FormControl fullWidth>
                <InputLabel>Check Type</InputLabel>
                <Select
                  value={newCondition.type}
                  label="Check Type"
                  onChange={(e: SelectChangeEvent) =>
                    setNewCondition({
                      ...newCondition,
                      type: e.target.value as ConditionLog["type"],
                    })
                  }
                >
                  <MenuItem value="pre-rental">Pre-Rental Check</MenuItem>
                  <MenuItem value="post-rental">Post-Rental Check</MenuItem>
                  <MenuItem value="inspection">Scheduled Inspection</MenuItem>
                </Select>
              </FormControl>
              <Typography gutterBottom>Condition Assessment</Typography>
              <LinearProgress
                variant="determinate"
                value={newCondition.condition}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <TextField
                type="number"
                label="Condition Percentage"
                value={newCondition.condition}
                onChange={(e) =>
                  setNewCondition({
                    ...newCondition,
                    condition: Math.min(
                      100,
                      Math.max(0, parseInt(e.target.value))
                    ),
                  })
                }
              />
              <TextField
                multiline
                rows={3}
                label="Notes"
                value={newCondition.notes}
                onChange={(e) =>
                  setNewCondition({ ...newCondition, notes: e.target.value })
                }
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitCondition} variant="contained">
              Save Condition
            </Button>
          </DialogActions>
        </Dialog>

        {/* Schedule Inspection Dialog */}
        <Dialog
          open={inspectionDialogOpen}
          onClose={() => setInspectionDialogOpen(false)}
        >
          <DialogTitle>Schedule Next Inspection</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="Next Inspection Date"
                value={selectedEquipment?.nextInspection || null}
                onChange={(newValue) => handleScheduleNextInspection(newValue)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setInspectionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => setInspectionDialogOpen(false)}
              variant="contained"
            >
              Schedule
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default EquipmentConditionLog;
