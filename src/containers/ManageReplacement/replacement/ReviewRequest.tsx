import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { AnimatedButton } from "../../../components/StyledComponents";

interface ReviewRequestProps {
  isApproved: boolean;
  setIsApproved: (value: boolean) => void;
  reviewNotes: string;
  setReviewNotes: (value: string) => void;
  onReview: () => void;
}

const ReviewRequest: React.FC<ReviewRequestProps> = ({
  isApproved,
  setIsApproved,
  reviewNotes,
  setReviewNotes,
  onReview,
}) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Review Request
      </Typography>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Button
            variant={isApproved ? "contained" : "outlined"}
            color="primary"
            onClick={() => setIsApproved(true)}
            sx={{ flex: 1, borderRadius: 2 }}
          >
            Approve
          </Button>
          <Button
            variant={!isApproved ? "contained" : "outlined"}
            color="error"
            onClick={() => setIsApproved(false)}
            sx={{ flex: 1, borderRadius: 2 }}
          >
            Reject
          </Button>
        </Stack>

        <TextField
          label="Review Notes"
          multiline
          rows={3}
          fullWidth
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          variant="outlined"
          placeholder="Provide notes about your decision..."
        />

        <AnimatedButton
          variant="contained"
          color={isApproved ? "primary" : "error"}
          onClick={onReview}
          disabled={!reviewNotes.trim()}
        >
          {isApproved ? "Approve Request" : "Reject Request"}
        </AnimatedButton>
      </Stack>
    </Paper>
  );
};

export default ReviewRequest;
