import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ReplacementRequestDetailDto } from "../../../types/replacement";
import { formatDate } from "../../../utils/replacementUtils";

interface EquipmentInfoProps {
  request: ReplacementRequestDetailDto;
}

const EquipmentInfo: React.FC<EquipmentInfoProps> = ({ request }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Equipment Information
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2">
            <strong>Type:</strong> {request.equipmentType}
          </Typography>
          {request.equipmentType === "HotPot" ? (
            <>
              <Typography variant="body2">
                <strong>HotPot Name:</strong> {request.hotPotName || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Series Number:</strong>{" "}
                {request.hotPotSeriesNumber || "N/A"}
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="body2">
                <strong>Utensil Name:</strong> {request.utensilName || "N/A"}
              </Typography>
              <Typography variant="body2">
                <strong>Utensil Type:</strong> {request.utensilType || "N/A"}
              </Typography>
            </>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2">
            <strong>Request Reason:</strong> {request.requestReason}
          </Typography>
          <Typography variant="body2">
            <strong>Request Date:</strong> {formatDate(request.requestDate)}
          </Typography>
          {request.reviewDate && (
            <Typography variant="body2">
              <strong>Review Date:</strong> {formatDate(request.reviewDate)}
            </Typography>
          )}
          {request.completionDate && (
            <Typography variant="body2">
              <strong>Completion Date:</strong>{" "}
              {formatDate(request.completionDate)}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EquipmentInfo;
