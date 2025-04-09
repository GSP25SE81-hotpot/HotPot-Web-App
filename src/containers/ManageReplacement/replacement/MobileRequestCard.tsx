import { Paper, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ReplacementRequestSummaryDto,
  ReplacementRequestStatus,
} from "../../../types/replacement";
import { StyledChip } from "../../../components/StyledComponents";
import { formatDate } from "../../../utils/replacementUtils";

const RequestCard = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "status",
})<{ status: ReplacementRequestStatus }>(({ theme, status }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 3,
  borderLeft: `4px solid ${
    status === ReplacementRequestStatus.Pending
      ? theme.palette.warning.main
      : status === ReplacementRequestStatus.InProgress
      ? theme.palette.primary.main
      : status === ReplacementRequestStatus.Completed
      ? theme.palette.success.main
      : status === ReplacementRequestStatus.Approved
      ? theme.palette.info.main
      : theme.palette.error.main
  }`,
  cursor: "pointer",
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const CardHeader = styled(Stack)({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

const CustomerName = styled(Typography)({
  fontWeight: 600,
});

const CardContent = styled(Stack)(({ theme }) => ({
  spacing: theme.spacing(1.5),
}));

const InfoText = styled(Typography)({
  variant: "body2",
});

const StaffAssignment = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "assigned",
})<{ assigned?: boolean }>(({ theme, assigned }) => ({
  color: assigned ? theme.palette.text.primary : theme.palette.text.secondary,
  fontStyle: assigned ? "normal" : "italic",
}));

interface MobileRequestCardProps {
  request: ReplacementRequestSummaryDto;
  onViewDetails: (request: ReplacementRequestSummaryDto) => void;
}

const MobileRequestCard: React.FC<MobileRequestCardProps> = ({
  request,
  onViewDetails,
}) => {
  return (
    <RequestCard status={request?.status} onClick={() => onViewDetails(request)}>
      <CardContent>
        <CardHeader>
          <CustomerName variant="subtitle1">
            {request.customerName}
          </CustomerName>
          <StyledChip
            label={request.status.toString()}
            status={request.status}
          />
        </CardHeader>
        <InfoText variant="body2">Thiết bị: {request.equipmentName}</InfoText>
        <InfoText variant="body2">
          Yêu cầu: {formatDate(request.requestDate)}
        </InfoText>
        <InfoText variant="body2">Vấn đề: {request.requestReason}</InfoText>
        {request.assignedStaffName ? (
          <StaffAssignment variant="body2" assigned>
            Phân công cho: {request.assignedStaffName}
          </StaffAssignment>
        ) : (
          <StaffAssignment variant="body2">
            Chưa phân công nhân viên
          </StaffAssignment>
        )}
      </CardContent>
    </RequestCard>
  );
};

export default MobileRequestCard;
