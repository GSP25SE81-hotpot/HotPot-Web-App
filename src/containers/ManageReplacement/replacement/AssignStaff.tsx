// src/components/replacement/StyledAssignStaff.tsx
import { Typography, Stack, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { StaffAvailabilityDto } from "../../../types/staff";
import StaffSelection from "./StaffSelection";
import { AnimatedButton } from "../../../components/StyledComponents";

// Create styled components
const AssignStaffContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
}));

const AssignStaffTitle = styled(Typography)({
  fontWeight: 600,
});

const AssignStaffContent = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const AssignButton = styled(AnimatedButton)(({ theme }) => ({
  marginTop: theme.spacing(1),
  // Add any additional button styling here
}));

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
    <AssignStaffContainer variant="outlined">
      <AssignStaffTitle variant="subtitle1" gutterBottom>
        Phân công nhân viên
      </AssignStaffTitle>
      <AssignStaffContent spacing={2}>
        <StaffSelection
          selectedStaffId={selectedStaffId}
          setSelectedStaffId={setSelectedStaffId}
          staff={staff}
          loading={loading}
        />
        <AssignButton
          variant="contained"
          color="primary"
          onClick={onAssign}
          disabled={selectedStaffId === null}
        >
          Phân công nhân viên
        </AssignButton>
      </AssignStaffContent>
    </AssignStaffContainer>
  );
};

export default AssignStaff;
