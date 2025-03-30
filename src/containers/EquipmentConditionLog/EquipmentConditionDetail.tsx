/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BuildIcon from "@mui/icons-material/Build";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryIcon from "@mui/icons-material/History";
import InfoIcon from "@mui/icons-material/Info";
import PendingIcon from "@mui/icons-material/Pending";
import TimelineIcon from "@mui/icons-material/Timeline";
import {
  Alert,
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Link,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import equipmentConditionService, {
  EquipmentConditionDetailDto,
  MaintenanceStatus,
  PaginationParams,
} from "../../api/Services/equipmentConditionService";
import {
  StatusChip,
  StyledBox,
  StyledButton,
  StyledPaper,
  StyledTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  getStatusText,
} from "../../components/manager/styles/EquipmentConditionLogStyles";

// Interface for tab panel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab Panel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`equipment-condition-tabpanel-${index}`}
      aria-labelledby={`equipment-condition-tab-${index}`}
      {...other}
      style={{ paddingTop: 20 }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const EquipmentConditionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conditionDetail, setConditionDetail] =
    useState<EquipmentConditionDetailDto | null>(null);
  const [relatedLogs, setRelatedLogs] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Fetch condition log details
  const fetchConditionDetail = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await equipmentConditionService.getConditionLogById(
        parseInt(id)
      );

      if (response.success) {
        setConditionDetail(response.data);
        // After getting details, fetch related logs for the same equipment
        if (response.data.equipmentType && response.data.equipmentId) {
          fetchRelatedLogs(
            response.data.equipmentType,
            response.data.equipmentId
          );
        }
      } else {
        setError(response.message || "Failed to fetch condition log details");
      }
    } catch (err) {
      setError("An error occurred while fetching condition log details");
      console.error("Error fetching condition log details:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch related logs for the same equipment
  const fetchRelatedLogs = async (type: string, equipmentId: number) => {
    try {
      const paginationParams: PaginationParams = {
        pageNumber: 1,
        pageSize: 5, // Limit to 5 most recent logs
      };

      const response =
        await equipmentConditionService.getConditionLogsByEquipment(
          type,
          equipmentId,
          paginationParams
        );

      if (response.success) {
        // Filter out the current log from related logs
        const filteredLogs = response.data.items.filter(
          (log) => log.damageDeviceId !== parseInt(id || "0")
        );
        setRelatedLogs(filteredLogs);
      }
    } catch (err) {
      console.error("Error fetching related logs:", err);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus: MaintenanceStatus) => {
    if (!id) return;

    try {
      setStatusUpdateLoading(true);

      const response = await equipmentConditionService.updateConditionStatus(
        parseInt(id),
        newStatus
      );

      if (response.success) {
        // Update the local state to reflect the change
        setConditionDetail((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      } else {
        setError(response.message || "Failed to update status");
      }
    } catch (err) {
      setError("An error occurred while updating the status");
      console.error("Error updating status:", err);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Initial data load
  useEffect(() => {
    fetchConditionDetail();
  }, [id]);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Get status icon based on maintenance status
  const getStatusIcon = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.Pending:
        return <PendingIcon />;
      case MaintenanceStatus.InProgress:
        return <BuildIcon />;
      case MaintenanceStatus.Completed:
        return <CheckCircleIcon />;
      case MaintenanceStatus.Cancelled:
        return <CancelIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <StyledBox>
      {/* Breadcrumb navigation */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          to="/equipment-condition-log"
          color="inherit"
        >
          Equipment Condition
        </Link>
        <Typography color="text.primary">Details</Typography>
      </Breadcrumbs>

      {/* Back button */}
      <Box sx={{ mb: 3 }}>
        <StyledButton
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate("/equipment-condition-log")}
        >
          Back to List
        </StyledButton>
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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : conditionDetail ? (
        <>
          {/* Header with basic info */}
          <StyledPaper sx={{ mb: 4, p: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="h4" gutterBottom>
                  {conditionDetail.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {conditionDetail.description || "No description provided"}
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
                  <Chip
                    icon={<InfoIcon />}
                    label={`ID: ${conditionDetail.damageDeviceId}`}
                    variant="outlined"
                  />
                  <Chip
                    icon={getStatusIcon(conditionDetail.status)}
                    label={getStatusText(conditionDetail.status)}
                    color={
                      conditionDetail.status === MaintenanceStatus.Completed
                        ? "success"
                        : conditionDetail.status ===
                          MaintenanceStatus.InProgress
                        ? "info"
                        : conditionDetail.status === MaintenanceStatus.Pending
                        ? "warning"
                        : "error"
                    }
                  />
                  <Chip
                    icon={<TimelineIcon />}
                    label={`Logged: ${formatDate(conditionDetail.loggedDate)}`}
                    variant="outlined"
                  />
                  {conditionDetail.updatedAt && (
                    <Chip
                      icon={<HistoryIcon />}
                      label={`Updated: ${formatDate(
                        conditionDetail.updatedAt
                      )}`}
                      variant="outlined"
                    />
                  )}
                </Box>
              </Grid>
              <Grid
                size={{ xs: 12, md: 4 }}
                container
                justifyContent="flex-end"
                alignItems="flex-start"
              >
                {conditionDetail.status !== MaintenanceStatus.Completed && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: "column",
                      alignItems: "stretch",
                    }}
                  >
                    {conditionDetail.status === MaintenanceStatus.Pending && (
                      <StyledButton
                        variant="contained"
                        color="info"
                        startIcon={<BuildIcon />}
                        onClick={() =>
                          handleStatusUpdate(MaintenanceStatus.InProgress)
                        }
                        disabled={statusUpdateLoading}
                      >
                        {statusUpdateLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Start Maintenance"
                        )}
                      </StyledButton>
                    )}
                    {conditionDetail.status !== MaintenanceStatus.Cancelled && (
                      <StyledButton
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() =>
                          handleStatusUpdate(MaintenanceStatus.Completed)
                        }
                        disabled={statusUpdateLoading}
                      >
                        {statusUpdateLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Mark as Completed"
                        )}
                      </StyledButton>
                    )}
                    {conditionDetail.status !== MaintenanceStatus.Cancelled && (
                      <StyledButton
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() =>
                          handleStatusUpdate(MaintenanceStatus.Cancelled)
                        }
                        disabled={statusUpdateLoading}
                      >
                        {statusUpdateLoading ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Cancel Maintenance"
                        )}
                      </StyledButton>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          </StyledPaper>

          {/* Tabs for different sections */}
          <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  py: 2,
                },
              }}
            >
              <Tab icon={<InfoIcon />} label="Equipment Details" />
              <Tab icon={<HistoryIcon />} label="Maintenance History" />
              <Tab icon={<BuildIcon />} label="Related Issues" />
            </Tabs>

            {/* Equipment Details Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={4}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                      variant="outlined"
                      sx={{ borderRadius: 3, height: "100%" }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Equipment Information
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Equipment Type
                            </Typography>
                            <Typography variant="body1">
                              {conditionDetail.equipmentTypeName ||
                                conditionDetail.equipmentType}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Equipment Name
                            </Typography>
                            <Typography variant="body1">
                              {conditionDetail.equipmentName}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Equipment ID
                            </Typography>
                            <Typography variant="body1">
                              {conditionDetail.equipmentId}
                            </Typography>
                          </Box>
                          {conditionDetail.equipmentSerialNumber && (
                            <Box>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Serial Number
                              </Typography>
                              <Typography variant="body1">
                                {conditionDetail.equipmentSerialNumber}
                              </Typography>
                            </Box>
                          )}
                          {conditionDetail.equipmentMaterial && (
                            <Box>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Material
                              </Typography>
                              <Typography variant="body1">
                                {conditionDetail.equipmentMaterial}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Card
                      variant="outlined"
                      sx={{ borderRadius: 3, height: "100%" }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Maintenance Notes
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1">
                          {conditionDetail.maintenanceNotes ||
                            "No maintenance notes available."}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* Maintenance History Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Maintenance Timeline
                </Typography>
                <Box sx={{ position: "relative", my: 4, mx: 2 }}>
                  {/* Timeline visualization */}
                  <Box
                    sx={{
                      position: "absolute",
                      left: 16,
                      top: 0,
                      bottom: 0,
                      width: 2,
                      bgcolor: "divider",
                    }}
                  />

                  {/* Timeline events - would be populated from actual maintenance history */}
                  <Box sx={{ position: "relative", mb: 4, pl: 5 }}>
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        bgcolor: theme.palette.primary.main,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        zIndex: 1,
                      }}
                    >
                      <InfoIcon />
                    </Box>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Issue Reported
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(conditionDetail.loggedDate)}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                          {conditionDetail.name} was reported for{" "}
                          {conditionDetail.equipmentName}.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>

                  {conditionDetail.status !== MaintenanceStatus.Pending && (
                    <Box sx={{ position: "relative", mb: 4, pl: 5 }}>
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          bgcolor: theme.palette.info.main,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          zIndex: 1,
                        }}
                      >
                        <BuildIcon />
                      </Box>
                      <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Maintenance Started
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {conditionDetail.updatedAt
                              ? formatDate(conditionDetail.updatedAt)
                              : "Date not recorded"}
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            Maintenance work began on the equipment.
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  )}

                  {(conditionDetail.status === MaintenanceStatus.Completed ||
                    conditionDetail.status === MaintenanceStatus.Cancelled) && (
                    <Box sx={{ position: "relative", mb: 4, pl: 5 }}>
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          bgcolor:
                            conditionDetail.status ===
                            MaintenanceStatus.Completed
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          zIndex: 1,
                        }}
                      >
                        {conditionDetail.status ===
                        MaintenanceStatus.Completed ? (
                          <CheckCircleIcon />
                        ) : (
                          <CancelIcon />
                        )}
                      </Box>
                      <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {conditionDetail.status ===
                            MaintenanceStatus.Completed
                              ? "Maintenance Completed"
                              : "Maintenance Cancelled"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {conditionDetail.updatedAt
                              ? formatDate(conditionDetail.updatedAt)
                              : "Date not recorded"}
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            {conditionDetail.status ===
                            MaintenanceStatus.Completed
                              ? "The equipment has been repaired and is now available for use."
                              : "The maintenance was cancelled."}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Box>
                  )}
                </Box>

                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Maintenance Actions
                </Typography>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="body1">
                      {conditionDetail.maintenanceNotes ||
                        "No maintenance actions have been recorded."}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </TabPanel>

            {/* Related Issues Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Other Issues for this Equipment
                </Typography>

                {relatedLogs.length > 0 ? (
                  <TableContainer
                    component={Paper}
                    sx={{ borderRadius: 2, overflow: "hidden" }}
                  >
                    <StyledTable>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>Issue</TableCell>
                          <TableCell>Logged Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {relatedLogs.map((log) => (
                          <TableRow key={log.damageDeviceId}>
                            <TableCell>{log.damageDeviceId}</TableCell>
                            <TableCell>{log.name}</TableCell>
                            <TableCell>{formatDate(log.loggedDate)}</TableCell>
                            <TableCell>
                              <StatusChip status={log.status}>
                                {getStatusText(log.status)}
                              </StatusChip>
                            </TableCell>
                            <TableCell>
                              <StyledButton
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  navigate(
                                    `/equipment-condition/${log.damageDeviceId}`
                                  )
                                }
                              >
                                View Details
                              </StyledButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </StyledTable>
                  </TableContainer>
                ) : (
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    No other issues have been reported for this equipment.
                  </Alert>
                )}

                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Equipment Usage Statistics
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary" gutterBottom>
                          {relatedLogs.length + 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Issues Reported
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          color="success.main"
                          gutterBottom
                        >
                          {relatedLogs.filter(
                            (log) => log.status === MaintenanceStatus.Completed
                          ).length +
                            (conditionDetail.status ===
                            MaintenanceStatus.Completed
                              ? 1
                              : 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Resolved Issues
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          color="warning.main"
                          gutterBottom
                        >
                          {relatedLogs.filter(
                            (log) => log.status === MaintenanceStatus.Pending
                          ).length +
                            (conditionDetail.status ===
                            MaintenanceStatus.Pending
                              ? 1
                              : 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pending Issues
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="info.main" gutterBottom>
                          {relatedLogs.filter(
                            (log) => log.status === MaintenanceStatus.InProgress
                          ).length +
                            (conditionDetail.status ===
                            MaintenanceStatus.InProgress
                              ? 1
                              : 0)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          In Progress
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </>
      ) : (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          No condition log found with ID: {id}
        </Alert>
      )}
    </StyledBox>
  );
};

export default EquipmentConditionDetails;
