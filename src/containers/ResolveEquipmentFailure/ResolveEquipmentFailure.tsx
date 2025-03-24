// src/pages/equipment/ResolveEquipmentFailure.tsx
import { Alert, Box, Button, Container, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEquipmentFailures } from "../../hooks/useEquipmentFailures";
import EquipmentFailureForm from "./Equipment/EquipmentFailureForm";
import EquipmentFailureList from "./Equipment/EquipmentFailureList";
import EquipmentStatistics from "./Equipment/EquipmentStatistics";
import NotificationSnackbar from "./Equipment/NotificationSnackbar";
import StatusFilter from "./Equipment/StatusFilter";

const ResolveEquipmentFailure: React.FC = () => {
  // Always call hooks at the top level
  const {
    requests,
    expandedRequestId,
    setExpandedRequestId,
    selectedDates,
    setSelectedDates,
    resolutionMessages,
    setResolutionMessages,
    loading,
    newReport,
    setNewReport,
    notification,
    setNotification,
    handleLogFailure,
    handleScheduleReplacement,
    handleResolveRequest,
    statusFilter,
    setStatusFilter,
    filteredRequests,
    error, // This comes from the hook
  } = useEquipmentFailures();

  // Handle errors from the hook
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6">Error loading equipment failures</Typography>
          <Typography variant="body2">{error.message}</Typography>
        </Alert>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          Equipment Failure Reports
        </Typography>

        {/* Statistics Section */}
        <EquipmentStatistics requests={requests} />

        {/* Report Logging Section */}
        <EquipmentFailureForm
          newReport={newReport}
          setNewReport={setNewReport}
          handleLogFailure={handleLogFailure}
        />

        {/* Status Filter */}
        {!loading && requests.length > 0 && (
          <StatusFilter
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredCount={filteredRequests.length}
            totalCount={requests.length}
          />
        )}

        {/* Requests List */}
        <EquipmentFailureList
          loading={loading}
          requests={filteredRequests}
          expandedRequestId={expandedRequestId}
          setExpandedRequestId={setExpandedRequestId}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
          resolutionMessages={resolutionMessages}
          setResolutionMessages={setResolutionMessages}
          handleScheduleReplacement={handleScheduleReplacement}
          handleResolveRequest={handleResolveRequest}
        />

        {/* Notification Snackbar */}
        <NotificationSnackbar
          notification={notification}
          setNotification={setNotification}
        />
      </Container>
    </LocalizationProvider>
  );
};

export default ResolveEquipmentFailure;
