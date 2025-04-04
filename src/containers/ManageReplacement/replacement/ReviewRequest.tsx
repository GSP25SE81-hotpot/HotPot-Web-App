import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AnimatedButton } from "../../../components/StyledComponents";

const ReviewContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
}));

const ReviewTitle = styled(Typography)({
  fontWeight: 600,
});

const ButtonsContainer = styled(Stack)({
  flexDirection: "row",
  spacing: 2,
});

const ActionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive?: boolean }>(({ theme }) => ({
  flex: 1,
  borderRadius: theme.shape.borderRadius * 2,
}));

const NotesField = styled(TextField)({
  width: "100%",
});

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
    <ReviewContainer variant="outlined">
      <ReviewTitle variant="subtitle1" gutterBottom>
        Xem xét yêu cầu
      </ReviewTitle>
      <Stack spacing={2}>
        <ButtonsContainer spacing={2}>
          <ActionButton
            variant={isApproved ? "contained" : "outlined"}
            color="primary"
            onClick={() => setIsApproved(true)}
          >
            Phê duyệt
          </ActionButton>
          <ActionButton
            variant={!isApproved ? "contained" : "outlined"}
            color="error"
            onClick={() => setIsApproved(false)}
          >
            Từ chối
          </ActionButton>
        </ButtonsContainer>
        <NotesField
          label="Ghi chú xem xét"
          multiline
          rows={3}
          fullWidth
          value={reviewNotes}
          onChange={(e) => setReviewNotes(e.target.value)}
          variant="outlined"
          placeholder="Cung cấp ghi chú về quyết định của bạn..."
        />
        <AnimatedButton
          variant="contained"
          color={isApproved ? "primary" : "error"}
          onClick={onReview}
          disabled={!reviewNotes.trim()}
        >
          {isApproved ? "Phê duyệt yêu cầu" : "Từ chối yêu cầu"}
        </AnimatedButton>
      </Stack>
    </ReviewContainer>
  );
};

export default ReviewRequest;
