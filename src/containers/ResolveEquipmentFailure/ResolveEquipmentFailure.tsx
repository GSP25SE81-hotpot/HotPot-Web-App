import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  TextField,
  Typography,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface RepairRequest {
  id: string;
  customerName: string;
  equipmentType: string;
  reportedDate: Date;
  status: "Pending" | "Scheduled" | "Resolved";
  description: string;
  replacementDate?: Date;
  resolutionNotes?: string;
  resolutionDate?: Date;
}

const StatusChip = ({ status }: { status: RepairRequest["status"] }) => {
  const theme = useTheme();
  const statusColors = {
    Pending: theme.palette.warning.main,
    Scheduled: theme.palette.info.main,
    Resolved: theme.palette.success.main,
  };

  return (
    <Chip
      label={status}
      sx={{ backgroundColor: statusColors[status], color: "white" }}
    />
  );
};

const ResolveEquipmentFailure: React.FC = () => {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
    null
  );
  const [selectedDates, setSelectedDates] = useState<
    Record<string, Date | null>
  >({});
  const [resolutionMessages, setResolutionMessages] = useState<
    Record<string, string>
  >({});
  const [newReport, setNewReport] = useState({
    customerName: "",
    equipmentType: "",
    description: "",
  });
  const [notification, setNotification] = useState<{
    message: string;
    severity: "success" | "error";
  } | null>(null);

  // Feature 1: Log failure reports
  const handleLogFailure = () => {
    if (
      !newReport.customerName ||
      !newReport.equipmentType ||
      !newReport.description
    ) {
      setNotification({
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    const newRequest: RepairRequest = {
      id: `REQ-${requests.length + 1}`,
      customerName: newReport.customerName,
      equipmentType: newReport.equipmentType,
      reportedDate: new Date(),
      status: "Pending",
      description: newReport.description,
    };

    setRequests([...requests, newRequest]);
    setNewReport({ customerName: "", equipmentType: "", description: "" });
    setNotification({
      message: "New failure report logged successfully",
      severity: "success",
    });
  };

  // Feature 2: Schedule replacements
  const handleScheduleReplacement = (requestId: string) => {
    const selectedDate = selectedDates[requestId];
    if (!selectedDate) {
      setNotification({
        message: "Please select a replacement date",
        severity: "error",
      });
      return;
    }

    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "Scheduled",
              replacementDate: selectedDate,
            }
          : req
      )
    );
    setSelectedDates((prev) => ({ ...prev, [requestId]: null }));
    setNotification({
      message: "Replacement scheduled successfully",
      severity: "success",
    });
  };

  // Feature 3: Communicate resolution timelines
  const handleResolveRequest = (requestId: string) => {
    const resolutionMessage = resolutionMessages[requestId];
    if (!resolutionMessage) {
      setNotification({
        message: "Please enter resolution notes",
        severity: "error",
      });
      return;
    }

    setRequests(
      requests.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: "Resolved",
              resolutionNotes: resolutionMessage,
              resolutionDate: new Date(),
            }
          : req
      )
    );
    setResolutionMessages((prev) => ({ ...prev, [requestId]: "" }));
    setNotification({
      message: "Request resolved and customer notified",
      severity: "success",
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Equipment Failure Reports
        </Typography>

        {/* Report Logging Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Log New Equipment Failure
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Customer Name"
                value={newReport.customerName}
                onChange={(e) =>
                  setNewReport({ ...newReport, customerName: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Equipment Type"
                value={newReport.equipmentType}
                onChange={(e) =>
                  setNewReport({ ...newReport, equipmentType: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Issue Description"
                value={newReport.description}
                onChange={(e) =>
                  setNewReport({ ...newReport, description: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button variant="contained" onClick={handleLogFailure}>
                Submit Failure Report
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Requests List */}
        <Box sx={{ width: "100%", mb: 2 }}>
          {/* Header Row */}
          <Paper
            sx={{
              p: 2,
              mb: 1,
              backgroundColor: "background.paper",
              borderBottom: 1,
              borderColor: "divider",
              display: { xs: "none", sm: "block" }, // Hide on mobile
            }}
          >
            <Grid container spacing={2} sx={{ width: "100%" }}>
              <Grid size={{ xs: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  ID
                </Typography>
              </Grid>
              <Grid size={{ xs: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Khách hàng
                </Typography>
              </Grid>
              <Grid size={{ xs: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Mặt hàng
                </Typography>
              </Grid>
              <Grid size={{ xs: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Ngày
                </Typography>
              </Grid>
              <Grid size={{ xs: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Trạng thái
                </Typography>
              </Grid>
              <Grid size={{ xs: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Mô tả
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Accordion Items */}
          {requests
            .sort((a, b) => b.reportedDate.getTime() - a.reportedDate.getTime())
            .map((request) => (
              <Accordion
                key={request.id}
                expanded={expandedRequestId === request.id}
                onChange={(_, expanded) =>
                  setExpandedRequestId(expanded ? request.id : null)
                }
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    sx={{ width: "100%", px: 1 }}
                  >
                    {/* Summary Grid - Fix column sizing */}
                    <Grid size={{ xs: 2, md: 2 }}>
                      <Typography variant="body2" noWrap title="Case ID">
                        {request.id}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 2, md: 2 }}>
                      <Typography variant="body2" noWrap title="Customer Name">
                        {request.customerName}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 2, md: 2 }}>
                      <Typography variant="body2" noWrap title="Equipment Type">
                        {request.equipmentType}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 2, md: 2 }}>
                      <Typography variant="body2" noWrap title="Reported Date">
                        {request.reportedDate.toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 2, md: 2 }}>
                      <StatusChip status={request.status} />
                    </Grid>
                    <Grid size={{ xs: 2, md: 2 }}>
                      <Typography variant="body2" noWrap title="Description">
                        {request.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>

                <AccordionDetails>
                  <Grid container spacing={3}>
                    {/* Left Column - Issue Details */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography variant="h6">Issue Details</Typography>
                      <Paper sx={{ p: 2, mt: 1 }}>
                        <Typography>{request.description}</Typography>
                      </Paper>

                      {request.replacementDate && (
                        <>
                          <Typography variant="h6" sx={{ mt: 2 }}>
                            Scheduled Replacement
                          </Typography>
                          <Paper sx={{ p: 2, mt: 1 }}>
                            <Typography>
                              {request.replacementDate.toLocaleDateString()}
                            </Typography>
                          </Paper>
                        </>
                      )}

                      {request.resolutionNotes && (
                        <>
                          <Typography variant="h6" sx={{ mt: 2 }}>
                            Resolution Notes
                          </Typography>
                          <Paper sx={{ p: 2, mt: 1 }}>
                            <Typography>{request.resolutionNotes}</Typography>
                          </Paper>
                        </>
                      )}
                    </Grid>

                    {/* Right Column - Actions */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      {request.status === "Pending" && (
                        <>
                          <Typography variant="h6">
                            Schedule Replacement
                          </Typography>
                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              gap: 2,
                              flexDirection: { xs: "column", sm: "row" },
                              alignItems: { xs: "stretch", sm: "center" },
                            }}
                          >
                            <DateTimePicker
                              label="Replacement Date"
                              value={selectedDates[request.id] || null}
                              onChange={(newValue) =>
                                setSelectedDates((prev) => ({
                                  ...prev,
                                  [request.id]: newValue,
                                }))
                              }
                              sx={{ flexGrow: 1 }}
                            />
                            <Button
                              variant="contained"
                              disabled={!selectedDates[request.id]}
                              onClick={() =>
                                handleScheduleReplacement(request.id)
                              }
                              sx={{ minWidth: 120 }}
                            >
                              Schedule
                            </Button>
                          </Box>
                        </>
                      )}

                      {request.status === "Scheduled" && (
                        <>
                          <Typography variant="h6">
                            Resolution Details
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <TextField
                              fullWidth
                              multiline
                              minRows={4}
                              label="Resolution Timeline & Notes"
                              placeholder="Enter detailed resolution timeline and customer communication..."
                              value={resolutionMessages[request.id] || ""}
                              onChange={(e) =>
                                setResolutionMessages((prev) => ({
                                  ...prev,
                                  [request.id]: e.target.value,
                                }))
                              }
                              sx={{ mb: 2 }}
                            />
                            <Button
                              variant="contained"
                              color="success"
                              disabled={!resolutionMessages[request.id]}
                              onClick={() => handleResolveRequest(request.id)}
                            >
                              Mark Resolved & Notify
                            </Button>
                          </Box>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>

        {/* Add the Snackbar notification */}
        <Snackbar
          open={!!notification}
          autoHideDuration={6000}
          onClose={() => setNotification(null)}
        >
          <Alert severity={notification?.severity} sx={{ width: "100%" }}>
            {notification?.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default ResolveEquipmentFailure;
