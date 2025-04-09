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
import { styled } from "@mui/material/styles";
import { StyledFormControl } from "../../../components/StyledComponents";
import { StaffAvailabilityDto } from "../../../types/staff";
import {
  getStaffAvailabilityStatus,
  getStaffDisplayName,
} from "../../../utils/replacementUtils";

const StaffAvatar = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== "available",
})<{ available?: boolean }>(({ theme, available }) => ({
  width: 28,
  height: 28,
  backgroundColor: available
    ? theme.palette.success.light
    : theme.palette.error.light,
}));

const StaffMenuItem = styled(MenuItem)({
  width: "100%",
});

// Fix: Use flexDirection instead of direction and apply spacing as a prop
const StaffInfo = styled(Stack)({
  flexDirection: "row", // Changed from direction to flexDirection
  alignItems: "center",
  width: "100%",
});

const StaffName = styled(Typography)({
  flexGrow: 1,
});

const AvailabilityChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "available",
})<{ available?: boolean }>(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const LoadingMenuItem = styled(MenuItem)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const LoadingIndicator = styled(CircularProgress)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

interface StaffSelectionProps {
  selectedStaffId: number | null;
  setSelectedStaffId: (id: number | null) => void;
  staff: StaffAvailabilityDto[];
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
                Chọn nhân viên
              </Typography>
            );
          }
          return getStaffDisplayName(Number(value), staff);
        }}
      >
        <MenuItem value="">
          <em>Không chọn</em>
        </MenuItem>
        {loading ? (
          <LoadingMenuItem disabled>
            <LoadingIndicator size={20} /> Đang tải danh sách nhân viên...
          </LoadingMenuItem>
        ) : (
          staff.map((s) => {
            const availabilityStatus = getStaffAvailabilityStatus(s);
            return (
              <StaffMenuItem
                key={s.id}
                value={s.id}
                disabled={!availabilityStatus.available}
              >
                <StaffInfo spacing={1}>
                  {" "}
                  {/* Apply spacing as a prop */}
                  <StaffAvatar available={availabilityStatus.available}>
                    {s.name.charAt(0)}
                  </StaffAvatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <StaffName>{s.name}</StaffName>
                  </Box>
                  <AvailabilityChip
                    size="small"
                    label={
                      availabilityStatus.available ? "Có sẵn" : "Không có sẵn"
                    }
                    color={availabilityStatus.available ? "success" : "error"}
                    title={availabilityStatus.reason}
                  />
                </StaffInfo>
              </StaffMenuItem>
            );
          })
        )}
      </Select>
      <FormHelperText>
        {selectedStaffId !== null
          ? `Đã chọn: ${getStaffDisplayName(selectedStaffId, staff)}`
          : "Vui lòng chọn một nhân viên để phân công"}
      </FormHelperText>
    </StyledFormControl>
  );
};

export default StaffSelection;
