import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReplacementRequestDetailDto } from "../../../types/replacement";

const NotesContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
}));

const NotesTitle = styled(Typography)({
  fontWeight: 600,
});

const NotesContent = styled(Typography)({
  whiteSpace: "pre-line",
});

const ReviewNotesTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginTop: theme.spacing(2),
}));

interface NotesInfoProps {
  request: ReplacementRequestDetailDto;
}

const NotesInfo: React.FC<NotesInfoProps> = ({ request }) => {
  return (
    <NotesContainer variant="outlined">
      <NotesTitle variant="subtitle1" gutterBottom>
        Ghi chú
      </NotesTitle>
      <NotesContent variant="body2">
        {request.additionalNotes || "Không có ghi chú bổ sung nào."}
      </NotesContent>
      {request.reviewNotes && (
        <>
          <ReviewNotesTitle variant="subtitle2">
            Ghi chú xem xét:
          </ReviewNotesTitle>
          <NotesContent variant="body2">{request.reviewNotes}</NotesContent>
        </>
      )}
    </NotesContainer>
  );
};

export default NotesInfo;
