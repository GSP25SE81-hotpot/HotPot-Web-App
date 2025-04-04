import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import { ReplacementRequestDetailDto } from "../../../types/replacement";
import { formatDate } from "../../../utils/replacementUtils";

// Create styled components
const EquipmentInfoContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
}));

const EquipmentInfoTitle = styled(Typography)({
  fontWeight: 600,
});

const EquipmentInfoField = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

interface EquipmentInfoProps {
  request: ReplacementRequestDetailDto;
}

const EquipmentInfo: React.FC<EquipmentInfoProps> = ({ request }) => {
  return (
    <EquipmentInfoContainer variant="outlined">
      <EquipmentInfoTitle variant="subtitle1" gutterBottom>
        Thông tin thiết bị
      </EquipmentInfoTitle>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <EquipmentInfoField variant="body2">
            <strong>Loại:</strong> {request.equipmentType}
          </EquipmentInfoField>
          {request.equipmentType === "HotPot" ? (
            <>
              <EquipmentInfoField variant="body2">
                <strong>Tên nồi lẩu:</strong> {request.hotPotName || "N/A"}
              </EquipmentInfoField>
              <EquipmentInfoField variant="body2">
                <strong>Số sê-ri:</strong> {request.hotPotSeriesNumber || "N/A"}
              </EquipmentInfoField>
            </>
          ) : (
            <>
              <EquipmentInfoField variant="body2">
                <strong>Tên dụng cụ:</strong> {request.utensilName || "N/A"}
              </EquipmentInfoField>
              <EquipmentInfoField variant="body2">
                <strong>Loại dụng cụ:</strong> {request.utensilType || "N/A"}
              </EquipmentInfoField>
            </>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EquipmentInfoField variant="body2">
            <strong>Lý do yêu cầu:</strong> {request.requestReason}
          </EquipmentInfoField>
          <EquipmentInfoField variant="body2">
            <strong>Ngày yêu cầu:</strong> {formatDate(request.requestDate)}
          </EquipmentInfoField>
          {request.reviewDate && (
            <EquipmentInfoField variant="body2">
              <strong>Ngày xem xét:</strong> {formatDate(request.reviewDate)}
            </EquipmentInfoField>
          )}
          {request.completionDate && (
            <EquipmentInfoField variant="body2">
              <strong>Ngày hoàn thành:</strong>{" "}
              {formatDate(request.completionDate)}
            </EquipmentInfoField>
          )}
        </Grid>
      </Grid>
    </EquipmentInfoContainer>
  );
};

export default EquipmentInfo;
