// src/components/replacement/CompleteReplacementForm.tsx
import React, { useState } from "react";
import staffReplacementService from "../../../api/Services/staffReplacementService";
import ErrorAlert from "../../../components/errorAlert/ErrorAlert";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import {
  ButtonContainer,
  CancelButton,
  FormContainer,
  FormField,
  FormTitle,
  SubmitButton,
} from "../../../components/staff/styles/completeReplacementStyles";
import { ReplacementRequestDetailDto } from "../../../types/pickupReplacement";

interface CompleteReplacementFormProps {
  replacementId: number;
  onSuccess: (updatedReplacement: ReplacementRequestDetailDto) => void;
  onCancel: () => void;
}

const CompleteReplacementForm: React.FC<CompleteReplacementFormProps> = ({
  replacementId,
  onSuccess,
  onCancel,
}) => {
  const [completionNotes, setCompletionNotes] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompletionNotes(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!completionNotes.trim()) {
      setError("Completion notes are required");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      console.log(
        `Attempting to complete replacement ${replacementId} with notes:`,
        completionNotes
      );
      const response = await staffReplacementService.completeReplacement(
        replacementId,
        {
          completionNotes: completionNotes.trim(),
        }
      );
      console.log("API response for complete replacement:", response);
      if (response.success && response.data) {
        console.log(
          "Successfully completed replacement. Updated data:",
          response.data
        );
        console.log("New status:", response.data.status);
        onSuccess(response.data);
      } else {
        console.error("API returned success=false:", response.message);
        setError(response.message || "Failed to complete replacement");
      }
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <FormContainer>
      <form onSubmit={handleSubmit} noValidate>
        <FormTitle variant="h6">Mark Replacement as Completed</FormTitle>
        {error && <ErrorAlert message={error} />}

        <FormField
          required
          fullWidth
          id="completionNotes"
          label="Completion Notes"
          name="completionNotes"
          multiline
          rows={4}
          value={completionNotes}
          onChange={handleNotesChange}
          placeholder="Describe how the replacement was completed and any relevant details"
          error={error !== null && !completionNotes.trim()}
          helperText={
            error !== null && !completionNotes.trim()
              ? "Completion notes are required"
              : ""
          }
        />

        <ButtonContainer direction="row" spacing={2}>
          <CancelButton variant="outlined" onClick={onCancel}>
            Cancel
          </CancelButton>
          <SubmitButton
            type="submit"
            variant="contained"
            disabled={!completionNotes.trim()}
          >
            Complete Replacement
          </SubmitButton>
        </ButtonContainer>
      </form>
    </FormContainer>
  );
};

export default CompleteReplacementForm;
