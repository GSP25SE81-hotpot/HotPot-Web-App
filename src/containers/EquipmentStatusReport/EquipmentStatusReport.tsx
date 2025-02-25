import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FilterListIcon from "@mui/icons-material/FilterList";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
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
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useCallback, useMemo, useState } from "react";

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
  id: string;
  equipmentId: string;
  message: string;
  date: Date;
  resolved: boolean;
}

// Mock data
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
  {
    id: "EQ-105",
    name: "Commercial Rice Cooker",
    type: "Electric",
    status: "available",
    location: "Warehouse B",
    lastChecked: new Date("2024-03-21"),
    issues: [],
  },
  {
    id: "EQ-106",
    name: "Portable Grill",
    type: "Gas",
    status: "in_use",
    location: "Customer Loan",
    lastChecked: new Date("2024-03-18"),
    issues: [],
  },
];

// Memoized components for better performance
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
      sx={{
        backgroundColor: statusConfig[status].color,
        color: "white",
        fontWeight: 500,
        minWidth: 100,
        justifyContent: "center",
      }}
    />
  );
};

// Alert list item component
const AlertItem = ({
  alert,
  onResolve,
}: {
  alert: StatusAlert;
  onResolve: (id: string) => void;
}) => {
  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {alert.equipmentId}
        </Typography>
        <Chip
          label={alert.resolved ? "Resolved" : "Active"}
          color={alert.resolved ? "success" : "error"}
          size="small"
        />
      </Box>
      <Typography variant="body2" sx={{ mb: 1 }}>
        {alert.message}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {alert.date.toLocaleString()}
        </Typography>
        {!alert.resolved && (
          <Button
            size="small"
            startIcon={<CheckCircleIcon />}
            onClick={() => onResolve(alert.id)}
          >
            Resolve
          </Button>
        )}
      </Box>
    </Paper>
  );
};

const EquipmentStatusReport = () => {
  const theme = useTheme();
  const [equipmentList, setEquipmentList] =
    useState<Equipment[]>(mockEquipment);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [newEquipmentDialogOpen, setNewEquipmentDialogOpen] = useState(false);
  const [alerts, setAlerts] = useState<StatusAlert[]>([
    {
      id: "alert-1",
      equipmentId: "EQ-103",
      message: "Heating element needs replacement",
      date: new Date(Date.now() - 86400000),
      resolved: false,
    },
    {
      id: "alert-2",
      equipmentId: "EQ-104",
      message: "Equipment damaged beyond repair",
      date: new Date(Date.now() - 172800000),
      resolved: true,
    },
  ]);
  const [newStatus, setNewStatus] = useState<Equipment["status"]>("available");
  const [adminMessage, setAdminMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [statusFilter, setStatusFilter] = useState<Equipment["status"] | "all">(
    "all"
  );
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentTab, setCurrentTab] = useState(0);
  const [alertsAnchorEl, setAlertsAnchorEl] = useState<null | HTMLElement>(
    null
  );

  // New equipment form state
  const [newEquipment, setNewEquipment] = useState<
    Omit<Equipment, "id" | "lastChecked" | "issues">
  >({
    name: "",
    type: "",
    status: "available",
    location: "",
  });

  // Memoized values for performance
  const activeAlerts = useMemo(
    () => alerts.filter((alert) => !alert.resolved),
    [alerts]
  );

  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((equipment) => {
      const matchesSearch =
        searchTerm === "" ||
        equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equipment.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || equipment.status === statusFilter;
      const matchesType = typeFilter === "all" || equipment.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [equipmentList, searchTerm, statusFilter, typeFilter]);

  // Unique equipment types for filter
  const equipmentTypes = useMemo(
    () => Array.from(new Set(equipmentList.map((eq) => eq.type))),
    [equipmentList]
  );

  // DataGrid columns definition - memoized to prevent re-renders
  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 120,
        renderCell: (params) => (
          <Typography fontWeight="medium">{params.value}</Typography>
        ),
      },
      {
        field: "name",
        headerName: "Equipment Name",
        width: 160,
        flex: 1,
      },
      {
        field: "type",
        headerName: "Type",
        width: 120,
      },
      {
        field: "status",
        headerName: "Status",
        width: 170,
        renderCell: (params) => <StatusChip status={params.value} />,
      },
      {
        field: "location",
        headerName: "Location",
        width: 170,
      },
      {
        field: "lastChecked",
        headerName: "Last Checked",
        width: 170,
        valueFormatter: (value) => {
          if (value) {
            return new Date(value).toLocaleDateString();
          }
          return "";
        },
      },
      {
        field: "issues",
        headerName: "Issues",
        width: 200,
        renderCell: (params) => {
          const issues = params.value as string[];
          if (!issues || issues.length === 0) {
            return (
              <Typography variant="body2" color="text.secondary">
                None
              </Typography>
            );
          }
          return (
            <Tooltip title={issues.join(", ")}>
              <Chip
                label={`${issues.length} ${
                  issues.length === 1 ? "issue" : "issues"
                }`}
                color="warning"
                size="small"
              />
            </Tooltip>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 250,
        renderCell: (params) => (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSelectedEquipment(params.row);
                setNewStatus(params.row.status);
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
          </Stack>
        ),
      },
    ],
    []
  );

  // Callbacks
  const handleStatusUpdate = useCallback(() => {
    if (!selectedEquipment) return;

    const updatedEquipment = {
      ...selectedEquipment,
      status: newStatus,
      lastChecked: new Date(),
    };

    // Generate alert if status is maintenance or out_of_service
    if (
      ["maintenance", "out_of_service"].includes(newStatus) &&
      selectedEquipment.status !== newStatus
    ) {
      const newAlert: StatusAlert = {
        id: `alert-${Date.now()}`,
        equipmentId: selectedEquipment.id,
        message: `Status changed to ${newStatus.replace("_", " ")}`,
        date: new Date(),
        resolved: false,
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }

    setEquipmentList((prev) =>
      prev.map((eq) => (eq.id === selectedEquipment.id ? updatedEquipment : eq))
    );
    setStatusDialogOpen(false);
  }, [selectedEquipment, newStatus]);

  const handleSendAlert = useCallback(() => {
    if (!selectedEquipment || !adminMessage.trim()) return;

    const newAlert: StatusAlert = {
      id: `alert-${Date.now()}`,
      equipmentId: selectedEquipment.id,
      message: adminMessage,
      date: new Date(),
      resolved: false,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setAdminMessage("");
    setAlertDialogOpen(false);
  }, [selectedEquipment, adminMessage]);

  const handleResolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    );
  }, []);

  const handleAddNewEquipment = useCallback(() => {
    if (!newEquipment.name || !newEquipment.type || !newEquipment.location)
      return;

    const newItem: Equipment = {
      id: `EQ-${100 + equipmentList.length + 1}`,
      name: newEquipment.name,
      type: newEquipment.type,
      status: newEquipment.status,
      location: newEquipment.location,
      lastChecked: new Date(),
      issues: [],
    };

    setEquipmentList((prev) => [...prev, newItem]);
    setNewEquipment({
      name: "",
      type: "",
      status: "available",
      location: "",
    });
    setNewEquipmentDialogOpen(false);
  }, [newEquipment, equipmentList.length]);

  const handleFilterOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setFilterAnchorEl(event.currentTarget);
    },
    []
  );

  const handleFilterClose = useCallback(() => {
    setFilterAnchorEl(null);
  }, []);

  const handleAlertsMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAlertsAnchorEl(event.currentTarget);
    },
    []
  );

  const handleAlertsMenuClose = useCallback(() => {
    setAlertsAnchorEl(null);
  }, []);

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setCurrentTab(newValue);
    },
    []
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          flexGrow: 1,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar position="static" color="default" elevation={2}>
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, fontWeight: "bold" }}
            >
              Equipment Stock Status
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Tooltip title="Filter equipment">
                <IconButton color="inherit" onClick={handleFilterOpen}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="View alerts">
                <IconButton color="inherit" onClick={handleAlertsMenuOpen}>
                  <Badge badgeContent={activeAlerts.length} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setNewEquipmentDialogOpen(true)}
              >
                Add Equipment
              </Button>
            </Box>
          </Toolbar>

          {/* Filter Menu */}
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box sx={{ p: 2, width: 250 }}>
              <Typography variant="subtitle2" gutterBottom>
                Filter Equipment
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2, mt: 1 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e: SelectChangeEvent<string>) =>
                    setStatusFilter(
                      e.target.value as Equipment["status"] | "all"
                    )
                  }
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="available">Available</MenuItem>
                  <MenuItem value="in_use">In Use</MenuItem>
                  <MenuItem value="maintenance">Maintenance</MenuItem>
                  <MenuItem value="out_of_service">Out of Service</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {equipmentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setSearchTerm("");
                  handleFilterClose();
                }}
              >
                Reset Filters
              </Button>
            </Box>
          </Menu>

          {/* Alerts Menu */}
          <Menu
            anchorEl={alertsAnchorEl}
            open={Boolean(alertsAnchorEl)}
            onClose={handleAlertsMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: { width: 350, maxHeight: 500 },
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Equipment Alerts
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {alerts.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ py: 2, textAlign: "center" }}
                >
                  No alerts to display
                </Typography>
              ) : (
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  sx={{ mb: 2 }}
                >
                  <Tab label={`Active (${activeAlerts.length})`} />
                  <Tab label="All" />
                </Tabs>
              )}

              <Box sx={{ maxHeight: 350, overflow: "auto" }}>
                {currentTab === 0 ? (
                  activeAlerts.length > 0 ? (
                    activeAlerts.map((alert) => (
                      <AlertItem
                        key={alert.id}
                        alert={alert}
                        onResolve={handleResolveAlert}
                      />
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ py: 2, textAlign: "center" }}
                    >
                      No active alerts
                    </Typography>
                  )
                ) : (
                  alerts.map((alert) => (
                    <AlertItem
                      key={alert.id}
                      alert={alert}
                      onResolve={handleResolveAlert}
                    />
                  ))
                )}
              </Box>
            </Box>
          </Menu>
        </AppBar>

        <Container
          maxWidth="xl"
          sx={{
            mt: 4,
            mb: 4,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search Bar */}
          <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              placeholder="Search equipment..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 400 }}
            />
            {(statusFilter !== "all" || typeFilter !== "all" || searchTerm) && (
              <Chip
                label={`Filtered: ${filteredEquipment.length} of ${equipmentList.length}`}
                color="primary"
                variant="outlined"
                onDelete={() => {
                  setStatusFilter("all");
                  setTypeFilter("all");
                  setSearchTerm("");
                }}
              />
            )}
          </Box>

          {/* Equipment Data Grid */}
          <Paper
            elevation={2}
            sx={{
              height: "calc(100% - 180px)",
              width: "100%",
              p: 2,
              borderRadius: 2,
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <DataGrid
              rows={filteredEquipment}
              columns={columns}
              getRowHeight={() => "auto"}
              disableRowSelectionOnClick
              initialState={{
                sorting: {
                  sortModel: [{ field: "lastChecked", sort: "desc" }],
                },
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: false,
                  printOptions: { disableToolbarButton: true },
                },
              }}
              sx={{
                "& .MuiDataGrid-cell": { py: 1 },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 1,
                },
              }}
            />
          </Paper>

          {/* Status Update Dialog */}
          <Dialog
            open={statusDialogOpen}
            onClose={() => setStatusDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Update Equipment Status
              <Typography variant="subtitle2" color="text.secondary">
                {selectedEquipment?.name} ({selectedEquipment?.id})
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 3 }}>
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
                  sx={{ width: "100%", mb: 2 }}
                />

                {(newStatus === "maintenance" ||
                  newStatus === "out_of_service") && (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Notes (optional)"
                    placeholder="Add details about the status change..."
                    sx={{ mt: 2 }}
                  />
                )}
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
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Send Alert to Admin
              <Typography variant="subtitle2" color="text.secondary">
                {selectedEquipment?.name} ({selectedEquipment?.id})
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Alert Message"
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Describe the issue with this equipment..."
                  sx={{ mb: 2 }}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "warning.main",
                  }}
                >
                  <WarningAmberIcon fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Alerts will notify administrators about equipment issues.
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
              <Button
                onClick={handleSendAlert}
                variant="contained"
                color="warning"
                disabled={!adminMessage.trim()}
              >
                Send Alert
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add New Equipment Dialog */}
          <Dialog
            open={newEquipmentDialogOpen}
            onClose={() => setNewEquipmentDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Add New Equipment</DialogTitle>
            <DialogContent dividers>
              <Box
                sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  fullWidth
                  label="Equipment Name"
                  value={newEquipment.name}
                  onChange={(e) =>
                    setNewEquipment({ ...newEquipment, name: e.target.value })
                  }
                  required
                />

                <FormControl fullWidth required>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={newEquipment.type}
                    label="Type"
                    onChange={(e) =>
                      setNewEquipment({ ...newEquipment, type: e.target.value })
                    }
                  >
                    {equipmentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newEquipment.status}
                    label="Status"
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        status: e.target.value as Equipment["status"],
                      })
                    }
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="in_use">In Use</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="out_of_service">Out of Service</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Location"
                  value={newEquipment.location}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      location: e.target.value,
                    })
                  }
                  required
                />

                <DatePicker
                  label="Check Date"
                  value={new Date()}
                  readOnly
                  sx={{ width: "100%" }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setNewEquipmentDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddNewEquipment}
                variant="contained"
                disabled={
                  !newEquipment.name ||
                  !newEquipment.type ||
                  !newEquipment.location
                }
              >
                Add Equipment
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </LocalizationProvider>
  );
};

export default EquipmentStatusReport;
