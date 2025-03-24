import { Paper, Typography } from "@mui/material";
import { ReplacementRequestDetailDto } from "../../../types/replacement";

interface NotesInfoProps {
  request: ReplacementRequestDetailDto;
}

const NotesInfo: React.FC<NotesInfoProps> = ({ request }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Notes
      </Typography>
      <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
        {request.additionalNotes || "No additional notes provided."}
      </Typography>

      {request.reviewNotes && (
        <>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 2 }}>
            Review Notes:
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            {request.reviewNotes}
          </Typography>
        </>
      )}
    </Paper>
  );
};

export default NotesInfo;
