// src/components/replacement/AssignStaff.tsx
import { Paper, Typography, Stack } from "@mui/material";
import { StaffAvailabilityDto } from "../../../types/staff";
import StaffSelection from "./StaffSelection";
import { AnimatedButton } from "../../../components/StyledComponents";

interface AssignStaffProps {
  selectedStaffId: number | null;
  setSelectedStaffId: (id: number | null) => void;
  staff: StaffAvailabilityDto[];
  loading: boolean;
  onAssign: () => void;
}

const AssignStaff: React.FC<AssignStaffProps> = ({
  selectedStaffId,
  setSelectedStaffId,
  staff,
  loading,
  onAssign,
}) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Assign Staff
      </Typography>
      <Stack spacing={2}>
        <StaffSelection
          selectedStaffId={selectedStaffId}
          setSelectedStaffId={setSelectedStaffId}
          staff={staff}
          loading={loading}
        />

        <AnimatedButton
          variant="contained"
          color="primary"
          onClick={onAssign}
          disabled={selectedStaffId === null}
        >
          Assign Staff
        </AnimatedButton>
      </Stack>
    </Paper>
  );
};

export default AssignStaff;
