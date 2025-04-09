// src/components/equipment/EquipmentIssueDetails.tsx

import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ConditionLog } from "../../../types/equipmentFailure";

interface EquipmentIssueDetailsProps {
  request: ConditionLog;
}

const EquipmentIssueDetails: React.FC<EquipmentIssueDetailsProps> = ({
  request,
}) => {
  return (
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography variant="h6">Issue Details</Typography>
      <Paper sx={{ p: 2, mt: 1 }}>
        <Typography>{request.description}</Typography>
      </Paper>

      {request.estimatedResolutionTime && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Scheduled Resolution
          </Typography>
          <Paper sx={{ p: 2, mt: 1 }}>
            <Typography>
              {new Date(request.estimatedResolutionTime).toLocaleString()}
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

      {request.resolutionDate && (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Resolution Date
          </Typography>
          <Paper sx={{ p: 2, mt: 1 }}>
            <Typography>
              {new Date(request.resolutionDate).toLocaleString()}
            </Typography>
          </Paper>
        </>
      )}
    </Grid>
  );
};

export default EquipmentIssueDetails;
