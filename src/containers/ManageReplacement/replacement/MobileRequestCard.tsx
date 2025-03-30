import { Paper, Stack, Typography, useTheme } from "@mui/material";
import { ReplacementRequestSummaryDto } from "../../../types/replacement";
import { StyledChip } from "../../../components/StyledComponents";
import { formatDate } from "../../../utils/replacementUtils";

interface MobileRequestCardProps {
  request: ReplacementRequestSummaryDto;
  onViewDetails: (request: ReplacementRequestSummaryDto) => void;
}

const MobileRequestCard: React.FC<MobileRequestCardProps> = ({
  request,
  onViewDetails,
}) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        borderLeft: `4px solid ${
          request.status === "Pending"
            ? theme.palette.warning.main
            : request.status === "InProgress"
            ? theme.palette.primary.main
            : request.status === "Completed"
            ? theme.palette.success.main
            : request.status === "Approved"
            ? theme.palette.info.main
            : theme.palette.error.main
        }`,
      }}
      onClick={() => onViewDetails(request)}
    >
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {request.customerName}
          </Typography>
          <StyledChip label={request.status} status={request.status} />
        </Stack>
        <Typography variant="body2">
          Equipment: {request.equipmentName}
        </Typography>
        <Typography variant="body2">
          Requested: {formatDate(request.requestDate)}
        </Typography>
        <Typography variant="body2">Issue: {request.requestReason}</Typography>
        {request.assignedStaffName ? (
          <Typography variant="body2">
            Assigned to: {request.assignedStaffName}
          </Typography>
        ) : (
          <Typography color="text.secondary" fontStyle="italic">
            No staff assigned
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default MobileRequestCard;
