// src/components/equipment/EquipmentActionPanel.tsx

import { Box, Button, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { DateTimePicker } from "@mui/x-date-pickers";
import {
  ConditionLog,
  MaintenanceStatus,
} from "../../../types/equipmentFailure";

interface EquipmentActionPanelProps {
  request: ConditionLog;
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

const EquipmentActionPanel: React.FC<EquipmentActionPanelProps> = ({
  request,
  selectedDates,
  setSelectedDates,
  resolutionMessages,
  setResolutionMessages,
  handleScheduleReplacement,
  handleResolveRequest,
}) => {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      {request.status === MaintenanceStatus.Pending && (
        <>
          <Typography variant="h6">Schedule Replacement</Typography>
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
              value={selectedDates[request.conditionLogId] || null}
              onChange={(newValue) =>
                setSelectedDates((prev) => ({
                  ...prev,
                  [request.conditionLogId]: newValue,
                }))
              }
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="contained"
              disabled={!selectedDates[request.conditionLogId]}
              onClick={() => handleScheduleReplacement(request.conditionLogId)}
              sx={{ minWidth: 120 }}
            >
              Schedule
            </Button>
          </Box>
        </>
      )}

      {(request.status === MaintenanceStatus.Scheduled ||
        request.status === MaintenanceStatus.InProgress) && (
        <>
          <Typography variant="h6">
            {request.status === MaintenanceStatus.Scheduled
              ? "Resolution Details"
              : "Update Resolution Progress"}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Resolution Timeline & Notes"
              placeholder="Enter detailed resolution timeline and customer communication..."
              value={resolutionMessages[request.conditionLogId] || ""}
              onChange={(e) =>
                setResolutionMessages((prev) => ({
                  ...prev,
                  [request.conditionLogId]: e.target.value,
                }))
              }
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="success"
              disabled={!resolutionMessages[request.conditionLogId]}
              onClick={() => handleResolveRequest(request.conditionLogId)}
            >
              Mark Resolved & Notify
            </Button>
          </Box>
        </>
      )}

      {request.status === MaintenanceStatus.Resolved && (
        <Box sx={{ mt: 2, p: 2, bgcolor: "success.light", borderRadius: 1 }}>
          <Typography variant="h6" color="success.contrastText">
            This issue has been resolved
          </Typography>
          <Typography
            variant="body2"
            color="success.contrastText"
            sx={{ mt: 1 }}
          >
            Resolution date:{" "}
            {new Date(request.resolutionDate || "").toLocaleString()}
          </Typography>
        </Box>
      )}
    </Grid>
  );
};

export default EquipmentActionPanel;
