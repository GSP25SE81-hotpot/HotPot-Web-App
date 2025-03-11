import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ConditionLog } from "../../../types/equipmentFailure";
import EquipmentActionPanel from "./EquipmentActionPanel";
import EquipmentIssueDetails from "./EquipmentIssueDetails";
import StatusChip from "./StatusChip";

interface EquipmentFailureListProps {
  loading: boolean;
  requests: ConditionLog[];
  expandedRequestId: number | null;
  setExpandedRequestId: React.Dispatch<React.SetStateAction<number | null>>;
  selectedDates: Record<number, Date | null>;
  setSelectedDates: React.Dispatch<
    React.SetStateAction<Record<number, Date | null>>
  >;
  resolutionMessages: Record<number, string>;
  setResolutionMessages: React.Dispatch<
    React.SetStateAction<Record<number, string>>
  >;
  handleScheduleReplacement: (requestId: number) => Promise<void>;
  handleResolveRequest: (requestId: number) => Promise<void>;
}

const EquipmentFailureList: React.FC<EquipmentFailureListProps> = ({
  loading,
  requests,
  expandedRequestId,
  setExpandedRequestId,
  selectedDates,
  setSelectedDates,
  resolutionMessages,
  setResolutionMessages,
  handleScheduleReplacement,
  handleResolveRequest,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (requests.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No equipment failures reported
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          When equipment failures are reported, they will appear here
        </Typography>
      </Paper>
    );
  }

  return (
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
              Thiết bị
            </Typography>
          </Grid>
          <Grid size={{ xs: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Ngày báo cáo
            </Typography>
          </Grid>
          <Grid size={{ xs: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Trạng thái
            </Typography>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Mô tả
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Accordion Items */}
      {requests
        .sort(
          (a, b) =>
            new Date(b.loggedDate).getTime() - new Date(a.loggedDate).getTime()
        )
        .map((request) => (
          <Accordion
            key={request.conditionLogId}
            expanded={expandedRequestId === request.conditionLogId}
            onChange={(_, expanded) =>
              setExpandedRequestId(expanded ? request.conditionLogId : null)
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
                    #{request.conditionLogId}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 2, md: 2 }}>
                  <Typography variant="body2" noWrap title="Equipment Name">
                    {request.name}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 2, md: 2 }}>
                  <Typography variant="body2" noWrap title="Reported Date">
                    {new Date(request.loggedDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 2, md: 2 }}>
                  <StatusChip status={request.status} />
                </Grid>
                <Grid size={{ xs: 4, md: 4 }}>
                  <Typography variant="body2" noWrap title="Description">
                    {request.description}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                {/* Left Column - Issue Details */}
                <EquipmentIssueDetails request={request} />

                {/* Right Column - Actions */}
                <EquipmentActionPanel
                  request={request}
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                  resolutionMessages={resolutionMessages}
                  setResolutionMessages={setResolutionMessages}
                  handleScheduleReplacement={handleScheduleReplacement}
                  handleResolveRequest={handleResolveRequest}
                />
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
    </Box>
  );
};

export default EquipmentFailureList;
