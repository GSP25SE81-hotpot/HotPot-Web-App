// src/pages/equipment/ResolveEquipmentFailure.tsx

import { Container, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEquipmentFailures } from "../../hooks/useEquipmentFailures";
import EquipmentFailureForm from "./Equipment/EquipmentFailureForm";
import EquipmentFailureList from "./Equipment/EquipmentFailureList";
import NotificationSnackbar from "./Equipment/NotificationSnackbar";
import EquipmentStatistics from "./Equipment/EquipmentStatistics";
import StatusFilter from "./Equipment/StatusFilter";

const ResolveEquipmentFailure: React.FC = () => {
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
  } = useEquipmentFailures();

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
