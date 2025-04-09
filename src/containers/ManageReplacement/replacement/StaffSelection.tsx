// src/components/replacement/StaffSelection.tsx
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import { StaffDto } from "../../../types/staff";
import { StyledFormControl } from "../../../components/StyledComponents";
import {
  getStaffAvailabilityStatus,
  getStaffDisplayName,
  getStaffWorkload,
} from "../../../utils/replacementUtils";

interface StaffSelectionProps {
  selectedStaffId: number | null;
  setSelectedStaffId: (id: number | null) => void;
  staff: StaffDto[];
  loading: boolean;
}

const StaffSelection: React.FC<StaffSelectionProps> = ({
  selectedStaffId,
  setSelectedStaffId,
  staff,
  loading,
}) => {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const value = event.target.value;
    setSelectedStaffId(value === "" ? null : Number(value));
  };

  return (
    <StyledFormControl fullWidth>
      <Select
        value={selectedStaffId === null ? "" : selectedStaffId}
        onChange={handleChange}
        displayEmpty
        renderValue={(value) => {
          if (value === null) {
            return (
              <Typography color="text.secondary" fontStyle="italic">
                Select Staff Member
              </Typography>
            );
          }

          return getStaffDisplayName(Number(value), staff);
        }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={20} sx={{ mr: 1 }} /> Loading staff...
          </MenuItem>
        ) : (
          staff.map((s) => {
            const availabilityStatus = getStaffAvailabilityStatus(s);

            return (
              <MenuItem
                key={s.staffId}
                value={s.staffId}
                disabled={!availabilityStatus.available}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  width="100%"
                >
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: availabilityStatus.available
                        ? "success.light"
                        : "error.light",
                    }}
                  >
                    {s.user.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography>{s.user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getStaffWorkload(s.staffId, staff)}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={
                      availabilityStatus.available ? "Available" : "Unavailable"
                    }
                    color={availabilityStatus.available ? "success" : "error"}
                    sx={{ ml: 1 }}
                    title={availabilityStatus.reason}
                  />
                </Stack>
              </MenuItem>
            );
          })
        )}
      </Select>
      <FormHelperText>
        {selectedStaffId !== null
          ? `Selected: ${getStaffDisplayName(selectedStaffId, staff)}`
          : "Please select a staff member to assign"}
      </FormHelperText>
    </StyledFormControl>
  );
};

export default StaffSelection;
