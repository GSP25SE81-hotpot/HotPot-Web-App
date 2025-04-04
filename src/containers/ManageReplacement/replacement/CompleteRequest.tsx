import { Paper, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AnimatedButton } from "../../../components/StyledComponents";

// Create styled components
const CompleteRequestContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
}));

const CompleteRequestTitle = styled(Typography)({
  fontWeight: 600,
});

const CompleteRequestContent = styled(Stack)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const CompletionNotesField = styled(TextField)({
  width: "100%",
});

interface CompleteRequestProps {
  completionNotes: string;
  setCompletionNotes: (value: string) => void;
  onComplete: () => void;
}

const CompleteRequest: React.FC<CompleteRequestProps> = ({
  completionNotes,
  setCompletionNotes,
  onComplete,
}) => {
  return (
    <CompleteRequestContainer variant="outlined">
      <CompleteRequestTitle variant="subtitle1" gutterBottom>
        Hoàn thành yêu cầu
      </CompleteRequestTitle>
      <CompleteRequestContent spacing={2}>
        <CompletionNotesField
          label="Ghi chú hoàn thành"
          multiline
          rows={3}
          fullWidth
          value={completionNotes}
          onChange={(e) => setCompletionNotes(e.target.value)}
          variant="outlined"
          placeholder="Cung cấp ghi chú về việc hoàn thành..."
        />
        <AnimatedButton
          variant="contained"
          color="success"
          onClick={onComplete}
          disabled={!completionNotes.trim()}
        >
          Đánh dấu là đã hoàn thành
        </AnimatedButton>
      </CompleteRequestContent>
    </CompleteRequestContainer>
  );
};

export default CompleteRequest;
