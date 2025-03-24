import { Paper, Stack, TextField, Typography } from "@mui/material";
import { AnimatedButton } from "../../../components/StyledComponents";

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
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Complete Request
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Completion Notes"
          multiline
          rows={3}
          fullWidth
          value={completionNotes}
          onChange={(e) => setCompletionNotes(e.target.value)}
          variant="outlined"
          placeholder="Provide notes about the completion..."
        />

        <AnimatedButton
          variant="contained"
          color="success"
          onClick={onComplete}
          disabled={!completionNotes.trim()}
        >
          Mark as Completed
        </AnimatedButton>
      </Stack>
    </Paper>
  );
};

export default CompleteRequest;
