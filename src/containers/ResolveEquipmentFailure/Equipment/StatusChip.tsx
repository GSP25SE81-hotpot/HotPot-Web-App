import { Chip, useTheme } from "@mui/material";
import { MaintenanceStatus } from "../../../types/equipmentFailure";

interface StatusChipProps {
  status: MaintenanceStatus;
}

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const theme = useTheme();
  const statusColors = {
    [MaintenanceStatus.Pending]: theme.palette.warning.main,
    [MaintenanceStatus.InProgress]: theme.palette.info.main,
    [MaintenanceStatus.Scheduled]: theme.palette.primary.main,
    [MaintenanceStatus.Resolved]: theme.palette.success.main,
  };

  return (
    <Chip
      label={status}
      sx={{ backgroundColor: statusColors[status], color: "white" }}
    />
  );
};

export default StatusChip;
