import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { PieChart } from "@mui/x-charts/PieChart";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: "available" | "in_use" | "maintenance" | "out_of_service";
  location: string;
  lastChecked: Date;
  issues: string[];
}

interface StatusAlert {
  equipmentId: string;
  message: string;
  date: Date;
  resolved: boolean;
}

const mockEquipment: Equipment[] = [
  {
    id: "EQ-101",
    name: "Electric Hot Pot Deluxe",
    type: "Electric",
    status: "available",
    location: "Warehouse A",
    lastChecked: new Date("2024-03-20"),
    issues: [],
  },
  {
    id: "EQ-102",
    name: "Portable Butane Stove",
    type: "Gas",
    status: "in_use",
    location: "Customer Loan",
    lastChecked: new Date("2024-03-19"),
    issues: ["Minor scratches"],
  },
  {
    id: "EQ-103",
    name: "Induction Cooktop Pro",
    type: "Induction",
    status: "maintenance",
    location: "Repair Center",
    lastChecked: new Date("2024-03-18"),
    issues: ["Heating element failure"],
  },
  {
    id: "EQ-104",
    name: "Traditional Clay Pot",
    type: "Ceramic",
    status: "out_of_service",
    location: "Storage",
    lastChecked: new Date("2024-03-17"),
    issues: ["Cracked lid", "Broken handle"],
  },
];

const StatusChip = ({ status }: { status: Equipment["status"] }) => {
  const statusConfig = {
    available: { color: "#4CAF50", label: "Available" },
    in_use: { color: "#2196F3", label: "In Use" },
    maintenance: { color: "#FF9800", label: "Maintenance" },
    out_of_service: { color: "#F44336", label: "Out of Service" },
  };

  return (
    <Chip
      label={statusConfig[status].label}
      sx={{ backgroundColor: statusConfig[status].color, color: "white" }}
    />
  );
};

const EquipmentStatusReport = () => {
  const [equipmentList, setEquipmentList] =
    useState<Equipment[]>(mockEquipment);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alerts, setAlerts] = useState<StatusAlert[]>([]);
  const [newStatus, setNewStatus] = useState<Equipment["status"]>("available");
  const [adminMessage, setAdminMessage] = useState("");

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "name", headerName: "Equipment Name", width: 200 },
    { field: "type", headerName: "Type", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => <StatusChip status={params.value} />,
    },
    { field: "location", headerName: "Location", width: 150 },
    {
      field: "lastChecked",
      headerName: "Last Checked",
      width: 150,
      valueFormatter: () => new Date().toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setSelectedEquipment(params.row);
              setStatusDialogOpen(true);
            }}
          >
            Update Status
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => {
              setSelectedEquipment(params.row);
              setAlertDialogOpen(true);
            }}
          >
            Alert Admin
          </Button>
        </Box>
      ),
    },
  ];

  const handleStatusUpdate = () => {
    if (!selectedEquipment) return;

    const updatedEquipment = {
      ...selectedEquipment,
      status: newStatus,
      lastChecked: new Date(),
    };

    // Generate alert if status is maintenance or out_of_service
    if (["maintenance", "out_of_service"].includes(newStatus)) {
      setAlerts((prev) => [
        ...prev,
        {
          equipmentId: selectedEquipment.id,
          message: `Status changed to ${newStatus.replace("_", " ")}`,
          date: new Date(),
          resolved: false,
        },
      ]);
    }

    setEquipmentList((prev) =>
      prev.map((eq) => (eq.id === selectedEquipment.id ? updatedEquipment : eq))
    );
    setStatusDialogOpen(false);
  };

  const handleSendAlert = () => {
    if (!selectedEquipment) return;

    setAlerts((prev) => [
      ...prev,
      {
        equipmentId: selectedEquipment.id,
        message: adminMessage,
        date: new Date(),
        resolved: false,
      },
    ]);
    setAdminMessage("");
    setAlertDialogOpen(false);
  };

  const statusDistribution = () => {
    const counts = equipmentList.reduce((acc, eq) => {
      acc[eq.status] = (acc[eq.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([status, count]) => ({
      id: status,
      value: count,
      label: status.replace("_", " ").toUpperCase(),
    }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Equipment Stock Status
            </Typography>
            <IconButton color="inherit">
              <Badge
                badgeContent={alerts.filter((a) => !a.resolved).length}
                color="error"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={{ p: 3, mb: 3, height: 320 }}>
                <Typography variant="h6" gutterBottom>
                  Status Distribution
                </Typography>
                <PieChart
                  series={[
                    {
                      data: statusDistribution(),
                      highlightScope: { faded: "global", highlighted: "item" },
                      faded: { innerRadius: 30, additionalRadius: -30 },
                    },
                  ]}
                  width={500}
                  height={250}
                  margin={{ top: 10, right: 220, bottom: 20, left: 20 }}
                  slotProps={{
                    legend: {
                      position: { vertical: "middle", horizontal: "right" },
                      padding: 50,
                    },
                  }}
                />
              </Paper>
            </Grid>

            <Grid size={{ xs: 16, md: 8 }}>
              <Box sx={{ height: 650, width: "100%", p: 2 }}>
                <DataGrid
                  rows={equipmentList}
                  columns={columns}
                  getRowHeight={() => "auto"}
                  disableRowSelectionOnClick
                  initialState={{
                    sorting: {
                      sortModel: [{ field: "lastChecked", sort: "desc" }],
                    },
                  }}
                  sx={{
                    "& .MuiDataGrid-cell": { py: 1 },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Status Update Dialog */}
          <Dialog
            open={statusDialogOpen}
            onClose={() => setStatusDialogOpen(false)}
          >
            <DialogTitle>Update Equipment Status</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2, minWidth: 300 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>New Status</InputLabel>
                  <Select
                    value={newStatus}
                    label="New Status"
                    onChange={(e: SelectChangeEvent) =>
                      setNewStatus(e.target.value as Equipment["status"])
                    }
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="in_use">In Use</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="out_of_service">Out of Service</MenuItem>
                  </Select>
                </FormControl>
                <DatePicker
                  label="Check Date"
                  value={new Date()}
                  readOnly
                  sx={{ width: "100%" }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleStatusUpdate} variant="contained">
                Update
              </Button>
            </DialogActions>
          </Dialog>

          {/* Admin Alert Dialog */}
          <Dialog
            open={alertDialogOpen}
            onClose={() => setAlertDialogOpen(false)}
          >
            <DialogTitle>Send Alert to Admin</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2, minWidth: 400 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Alert Message"
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Equipment: {selectedEquipment?.name} ({selectedEquipment?.id})
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSendAlert}
                variant="contained"
                color="warning"
                disabled={!adminMessage}
              >
                Send Alert
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default EquipmentStatusReport;
