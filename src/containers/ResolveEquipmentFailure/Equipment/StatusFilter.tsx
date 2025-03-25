// src/components/equipment/StatusFilter.tsx

import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { MaintenanceStatus } from "../../../types/equipmentFailure";

interface StatusFilterProps {
  statusFilter: MaintenanceStatus | "All";
  setStatusFilter: React.Dispatch<
    React.SetStateAction<MaintenanceStatus | "All">
  >;
  filteredCount: number;
  totalCount: number;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  statusFilter,
  setStatusFilter,
  filteredCount,
  totalCount,
}) => {
  return (
    <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
      <Typography variant="subtitle1">Filter by Status:</Typography>
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <Select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as MaintenanceStatus | "All")
          }
        >
          <MenuItem value="All">All Statuses</MenuItem>
          <MenuItem value={MaintenanceStatus.Pending}>Pending</MenuItem>
          <MenuItem value={MaintenanceStatus.InProgress}>In Progress</MenuItem>
          <MenuItem value={MaintenanceStatus.Scheduled}>Scheduled</MenuItem>
          <MenuItem value={MaintenanceStatus.Resolved}>Resolved</MenuItem>
        </Select>
      </FormControl>
      <Typography variant="body2" color="text.secondary">
        Showing {filteredCount} of {totalCount} reports
      </Typography>
    </Box>
  );
};

export default StatusFilter;
