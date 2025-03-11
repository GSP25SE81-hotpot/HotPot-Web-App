// src/components/equipment/EquipmentStatistics.tsx

import { Box, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  ConditionLog,
  MaintenanceStatus,
} from "../../../types/equipmentFailure";

interface EquipmentStatisticsProps {
  requests: ConditionLog[];
}

const EquipmentStatistics: React.FC<EquipmentStatisticsProps> = ({
  requests,
}) => {
  const pendingCount = requests.filter(
    (r) => r.status === MaintenanceStatus.Pending
  ).length;
  const inProgressCount = requests.filter(
    (r) =>
      r.status === MaintenanceStatus.InProgress ||
      r.status === MaintenanceStatus.Scheduled
  ).length;
  const resolvedCount = requests.filter(
    (r) => r.status === MaintenanceStatus.Resolved
  ).length;

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Box sx={{ textAlign: "center", p: 1 }}>
            <Typography variant="h4" color="primary">
              {requests.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Reports
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Box sx={{ textAlign: "center", p: 1 }}>
            <Typography variant="h4" color="warning.main">
              {pendingCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Box sx={{ textAlign: "center", p: 1 }}>
            <Typography variant="h4" color="info.main">
              {inProgressCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              In Progress
            </Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Box sx={{ textAlign: "center", p: 1 }}>
            <Typography variant="h4" color="success.main">
              {resolvedCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Resolved
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EquipmentStatistics;
