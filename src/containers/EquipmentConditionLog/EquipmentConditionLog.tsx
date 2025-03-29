/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Add this import
import {
  Alert,
  Box,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import equipmentConditionService, {
  CreateEquipmentConditionRequest,
  EquipmentConditionFilterDto,
  MaintenanceScheduleType,
  MaintenanceStatus,
  NotifyAdminRequest,
} from "../../api/Services/equipmentConditionService";
import {
  StatusChip,
  StyledBox,
  StyledButton,
  StyledDialog,
  StyledPaper,
  StyledTable,
  StyledTextField,
  getStatusText,
} from "../../components/manager/styles/EquipmentConditionLogStyles";

// Define column configuration for sorting
interface ColumnConfig {
  field: string;
  label: string;
  sortable: boolean;
}

const EquipmentConditionLog: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // Add this hook
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Add success message state
  const [conditionLogs, setConditionLogs] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [sortBy, setSortBy] = useState<string>("damageDeviceId");
  const [sortDescending, setSortDescending] = useState<boolean>(false);
  const [filterParams, setFilterParams] = useState<EquipmentConditionFilterDto>(
    {
      pageNumber: 1,
      pageSize: 10,
      sortBy: "damageDeviceId",
      sortDescending: false,
    }
  );
  const [newCondition, setNewCondition] =
    useState<CreateEquipmentConditionRequest>({
      name: "",
      description: "",
      status: MaintenanceStatus.Pending,
    });
  const [formErrors, setFormErrors] = useState({
    name: false,
    equipmentId: false,
  });

  // Define sortable columns
  const columns: ColumnConfig[] = [
    { field: "damageDeviceId", label: "ID", sortable: true },
    { field: "name", label: "Name", sortable: false },
    { field: "equipmentType", label: "Equipment Type", sortable: false },
    { field: "equipmentName", label: "Equipment Name", sortable: false },
    { field: "loggedDate", label: "Logged Date", sortable: true },
    { field: "status", label: "Status", sortable: true },
    { field: "actions", label: "Actions", sortable: false },
  ];

  // Fetch condition logs
  const fetchConditionLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await equipmentConditionService.getFilteredConditionLogs(
        filterParams
      );
      if (response.success) {
        setConditionLogs(response.data.items);
        setTotalCount(response.data.totalCount);
        setPageNumber(response.data.pageNumber);
        setPageSize(response.data.pageSize);
      } else {
        setError(
          response.message || "Failed to fetch equipment condition logs"
        );
      }
    } catch (err) {
      setError("An error occurred while fetching equipment condition logs");
      console.error("Error fetching condition logs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchConditionLogs();
  }, [filterParams]);

  // Handle filter changes
  const handleFilterChange = (name: string, value: any) => {
    setFilterParams((prev) => ({
      ...prev,
      [name]: value,
      pageNumber: 1, // Reset to first page on filter change
    }));
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    // If clicking the same field, toggle direction
    // If clicking a new field, sort ascending by that field
    const newSortDescending = field === sortBy ? !sortDescending : false;
    setSortBy(field);
    setSortDescending(newSortDescending);
    setFilterParams((prev) => ({
      ...prev,
      sortBy: field,
      sortDescending: newSortDescending,
    }));
  };

  // Handle form input changes
  const handleInputChange = (name: string, value: any) => {
    setNewCondition((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error when field is filled
    if (formErrors[name as keyof typeof formErrors] && value) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {
      name: !newCondition.name,
      equipmentId: !newCondition.hotPotInventoryId && !newCondition.utensilId,
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      const response = await equipmentConditionService.createConditionLog(
        newCondition
      );
      if (response.success) {
        setOpenDialog(false);
        // Reset form
        setNewCondition({
          name: "",
          description: "",
          status: MaintenanceStatus.Pending,
        });
        // Show success message
        setSuccessMessage("Condition log created successfully");
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
        // Refresh data
        fetchConditionLogs();
      } else {
        setError(response.message || "Failed to create condition log");
      }
    } catch (err) {
      setError("An error occurred while creating the condition log");
      console.error("Error creating condition log:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (
    id: number,
    newStatus: MaintenanceStatus
  ) => {
    try {
      setLoading(true);
      const response = await equipmentConditionService.updateConditionStatus(
        id,
        newStatus
      );
      if (response.success) {
        // Update the local state to reflect the change
        setConditionLogs((prev) =>
          prev.map((log) =>
            log.damageDeviceId === id ? { ...log, status: newStatus } : log
          )
        );
        // Show success message
        setSuccessMessage(
          `Status successfully updated to ${getStatusText(newStatus)}`
        );
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        setError(response.message || "Failed to update status");
      }
    } catch (err) {
      setError("An error occurred while updating the status");
      console.error("Error updating status:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle notify admin
  const handleNotifyAdmin = async (conditionLog: any) => {
    try {
      setLoading(true);
      const notifyRequest: NotifyAdminRequest = {
        conditionLogId: conditionLog.damageDeviceId,
        equipmentType: conditionLog.equipmentType,
        equipmentName: conditionLog.equipmentName,
        issueName: conditionLog.name,
        description: conditionLog.description,
        scheduleType: MaintenanceScheduleType.Regular,
      };
      const response = await equipmentConditionService.notifyAdministrators(
        notifyRequest
      );
      if (response.success) {
        // Show success message
        setSuccessMessage("Administrators have been notified");
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } else {
        setError(response.message || "Failed to notify administrators");
      }
    } catch (err) {
      setError("An error occurred while notifying administrators");
      console.error("Error notifying administrators:", err);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to details page
  const navigateToDetails = (id: number) => {
    navigate(`/equipment-condition-log/${id}`);
  };

  // Render sort icon for column headers
  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortDescending ? (
      <ArrowDownwardIcon
        fontSize="small"
        sx={{ ml: 0.5, verticalAlign: "middle" }}
      />
    ) : (
      <ArrowUpwardIcon
        fontSize="small"
        sx={{ ml: 0.5, verticalAlign: "middle" }}
      />
    );
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
        {/* Filter Controls */}
        <StyledPaper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StyledTextField
                fullWidth
                label="Equipment Type"
                value={filterParams.equipmentType || ""}
                onChange={(e) =>
                  handleFilterChange("equipmentType", e.target.value)
                }
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterParams.status || ""}
                  label="Status"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value={MaintenanceStatus.Pending}>Pending</MenuItem>
                  <MenuItem value={MaintenanceStatus.InProgress}>
                    In Progress
                  </MenuItem>
                  <MenuItem value={MaintenanceStatus.Completed}>
                    Completed
                  </MenuItem>
                  <MenuItem value={MaintenanceStatus.Cancelled}>
                    Cancelled
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label="Start Date"
                value={
                  filterParams.startDate
                    ? new Date(filterParams.startDate)
                    : null
                }
                onChange={(date) =>
                  handleFilterChange(
                    "startDate",
                    date ? date.toISOString().split("T")[0] : null
                  )
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DatePicker
                label="End Date"
                value={
                  filterParams.endDate ? new Date(filterParams.endDate) : null
                }
                onChange={(date) =>
                  handleFilterChange(
                    "endDate",
                    date ? date.toISOString().split("T")[0] : null
                  )
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid
              size={{ xs: 12, md: 6 }}
              container
              justifyContent="flex-end"
              alignItems="baseline"
            >
              <StyledButton
                variant="outlined"
                onClick={() =>
                  setFilterParams({
                    pageNumber: 1,
                    pageSize: 10,
                    sortBy: "damageDeviceId",
                    sortDescending: false,
                  })
                }
                sx={{ mr: 2 }}
              >
                Reset
              </StyledButton>
              <StyledButton
                variant="contained"
                onClick={() => fetchConditionLogs()}
              >
                Apply Filters
              </StyledButton>
            </Grid>
          </Grid>
        </StyledPaper>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <StyledButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add New Condition Log
          </StyledButton>
          <Typography variant="body2">
            Showing {conditionLogs.length} of {totalCount} entries
          </Typography>
        </Box>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 3,
              "& .MuiAlert-icon": {
                alignItems: "center",
              },
            }}
          >
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 3,
              "& .MuiAlert-icon": {
                alignItems: "center",
              },
            }}
          >
            {successMessage}
          </Alert>
        )}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Equipment Condition Logs
        </Typography>
        <StyledPaper sx={{ mb: 4 }}>
          {loading && conditionLogs.length === 0 ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.field}
                        onClick={() =>
                          column.sortable && handleSortChange(column.field)
                        }
                        sx={
                          column.sortable
                            ? {
                                cursor: "pointer",
                                "&:hover": {
                                  backgroundColor: theme.palette.action.hover,
                                },
                                ...(sortBy === column.field && {
                                  color: theme.palette.primary.main,
                                  fontWeight: "bold",
                                }),
                              }
                            : {}
                        }
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          {column.label}
                          {renderSortIcon(column.field)}
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {conditionLogs.length > 0 ? (
                    conditionLogs.map((log) => (
                      <TableRow key={log.damageDeviceId}>
                        <TableCell>{log.damageDeviceId}</TableCell>
                        <TableCell>{log.name}</TableCell>
                        <TableCell>{log.equipmentType}</TableCell>
                        <TableCell>{log.equipmentName}</TableCell>
                        <TableCell>
                          {new Date(log.loggedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <StatusChip status={log.status}>
                            {getStatusText(log.status)}
                          </StatusChip>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            {/* Add View Details button */}
                            <StyledButton
                              size="small"
                              variant="outlined"
                              color="primary"
                              startIcon={<VisibilityIcon />}
                              onClick={() =>
                                navigateToDetails(log.damageDeviceId)
                              }
                            >
                              View Details
                            </StyledButton>
                            <StyledButton
                              size="small"
                              variant="outlined"
                              onClick={() => handleNotifyAdmin(log)}
                            >
                              Notify Admin
                            </StyledButton>
                            {log.status !== MaintenanceStatus.Completed && (
                              <StyledButton
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() =>
                                  handleStatusUpdate(
                                    log.damageDeviceId,
                                    MaintenanceStatus.Completed
                                  )
                                }
                              >
                                Mark Complete
                              </StyledButton>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No condition logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </StyledTable>
            </TableContainer>
          )}
          {/* Pagination Controls */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body2">Rows per page:</Typography>
              <Select
                value={pageSize}
                size="small"
                onChange={(e) => {
                  const newPageSize = Number(e.target.value);
                  setPageSize(newPageSize);
                  setFilterParams((prev) => ({
                    ...prev,
                    pageSize: newPageSize,
                    pageNumber: 1,
                  }));
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
              <Box sx={{ display: "flex", gap: 1 }}>
                <StyledButton
                  size="small"
                  variant="outlined"
                  disabled={pageNumber <= 1}
                  onClick={() => {
                    const newPageNumber = pageNumber - 1;
                    setFilterParams((prev) => ({
                      ...prev,
                      pageNumber: newPageNumber,
                    }));
                  }}
                >
                  Previous
                </StyledButton>
                <Typography variant="body2" sx={{ alignSelf: "center" }}>
                  Page {pageNumber} of {Math.ceil(totalCount / pageSize)}
                </Typography>
                <StyledButton
                  size="small"
                  variant="outlined"
                  disabled={pageNumber >= Math.ceil(totalCount / pageSize)}
                  onClick={() => {
                    const newPageNumber = pageNumber + 1;
                    setFilterParams((prev) => ({
                      ...prev,
                      pageNumber: newPageNumber,
                    }));
                  }}
                >
                  Next
                </StyledButton>
              </Box>
            </Box>
          </Box>
        </StyledPaper>
        {/* Add Condition Log Dialog */}
        <StyledDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ fontWeight: 600 }}>
            New Equipment Condition Log
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <StyledTextField
                  fullWidth
                  label="Issue Name"
                  required
                  value={newCondition.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={formErrors.name}
                  helperText={formErrors.name ? "Issue name is required" : ""}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <StyledTextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={newCondition.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth error={formErrors.equipmentId}>
                  <InputLabel>Equipment Type</InputLabel>
                  <Select
                    value={
                      newCondition.hotPotInventoryId !== undefined
                        ? "hotpot"
                        : newCondition.utensilId !== undefined
                        ? "utensil"
                        : ""
                    }
                    label="Equipment Type"
                    onChange={(e) => {
                      const equipmentType = e.target.value;
                      // Reset both equipment IDs and set the selected type
                      if (equipmentType === "hotpot") {
                        setNewCondition((prev) => ({
                          ...prev,
                          hotPotInventoryId: 0, // Initialize with 0
                          utensilId: undefined, // Clear the other type
                        }));
                      } else if (equipmentType === "utensil") {
                        setNewCondition((prev) => ({
                          ...prev,
                          utensilId: 0, // Initialize with 0
                          hotPotInventoryId: undefined, // Clear the other type
                        }));
                      } else {
                        // If no type is selected, clear both
                        setNewCondition((prev) => ({
                          ...prev,
                          hotPotInventoryId: undefined,
                          utensilId: undefined,
                        }));
                      }
                    }}
                  >
                    <MenuItem value="">Select Type</MenuItem>
                    <MenuItem value="hotpot">Hot Pot</MenuItem>
                    <MenuItem value="utensil">Utensil</MenuItem>
                  </Select>
                  {formErrors.equipmentId && (
                    <FormHelperText>
                      Equipment selection is required
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                {/* Only show ID field if an equipment type is selected */}
                {(newCondition.hotPotInventoryId !== undefined ||
                  newCondition.utensilId !== undefined) && (
                  <StyledTextField
                    fullWidth
                    type="number"
                    label={
                      newCondition.hotPotInventoryId !== undefined
                        ? "Hot Pot ID"
                        : "Utensil ID"
                    }
                    required
                    value={
                      newCondition.hotPotInventoryId !== undefined
                        ? newCondition.hotPotInventoryId === 0
                          ? ""
                          : newCondition.hotPotInventoryId
                        : newCondition.utensilId === 0
                        ? ""
                        : newCondition.utensilId
                    }
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? 0 : parseInt(e.target.value);
                      if (newCondition.hotPotInventoryId !== undefined) {
                        handleInputChange("hotPotInventoryId", value);
                      } else if (newCondition.utensilId !== undefined) {
                        handleInputChange("utensilId", value);
                      }
                    }}
                    error={formErrors.equipmentId}
                    helperText={
                      formErrors.equipmentId ? "Equipment ID is required" : ""
                    }
                  />
                )}
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newCondition.status}
                    label="Status"
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                  >
                    <MenuItem value={MaintenanceStatus.Pending}>
                      Pending
                    </MenuItem>
                    <MenuItem value={MaintenanceStatus.InProgress}>
                      In Progress
                    </MenuItem>
                    <MenuItem value={MaintenanceStatus.Completed}>
                      Completed
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <StyledButton onClick={() => setOpenDialog(false)}>
              Cancel
            </StyledButton>
            <StyledButton
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Add Condition Log"}
            </StyledButton>
          </DialogActions>
        </StyledDialog>
      </StyledBox>
    </LocalizationProvider>
  );
};

export default EquipmentConditionLog;
