// src/components/manager/ReturnDateAdjustment.tsx
import { Alert, Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState } from "react";
import { adjustReturnDateForException } from "../../../api/Services/rentalService";
import { UpdateRentOrderDetailRequest } from "../../../types/rentalTypes";

// Import styled components
import { StyledContainer } from "../../../components/StyledComponents";

// Import return date adjustment specific styled components
import { alpha } from "@mui/material/styles";
import {
  AdjustmentTitle,
  FormContainer,
  NotesTextField,
  StyledTextField,
  SubmitButton,
  WarningText,
} from "../../../components/manager/styles/ReturnDateAdjustmentStyles";

const ReturnDateAdjustment: React.FC = () => {
  const [rentalId, setRentalId] = useState("");
  const [newReturnDate, setNewReturnDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!rentalId) {
      setError("Please enter a rental ID");
      return;
    }
    if (!newReturnDate) {
      setError("Please select a new return date");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const request: UpdateRentOrderDetailRequest = {
        expectedReturnDate: newReturnDate.toISOString(),
        notes: notes || undefined,
      };
      await adjustReturnDateForException(parseInt(rentalId, 10), request);
      setSuccess(true);
      // Optionally clear form
      // setRentalId('');
      // setNewReturnDate(null);
      // setNotes('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to adjust return date"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="md">
      <Box sx={{ p: 3 }}>
        <AdjustmentTitle variant="h4">
          Adjust Return Date (Exception Only)
        </AdjustmentTitle>

        <FormContainer elevation={0}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  alignItems: "center",
                },
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  alignItems: "center",
                },
              }}
            >
              Return date adjusted successfully!
            </Alert>
          )}

          <WarningText variant="body2">
            This form should only be used for exceptional circumstances. Regular
            extensions should be handled through the customer's account.
          </WarningText>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                label="Rental ID"
                variant="outlined"
                fullWidth
                value={rentalId}
                onChange={(e) => setRentalId(e.target.value)}
                disabled={loading}
                placeholder="Enter the rental ID"
                slotProps={{
                  input: { sx: { borderRadius: 3 } },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="New Return Date"
                  value={newReturnDate}
                  onChange={(newValue) => setNewReturnDate(newValue)}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 3,
                          backgroundColor: (theme) =>
                            alpha(theme.palette.background.paper, 0.8),
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <NotesTextField
                label="Reason for Exception"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading}
                placeholder="Explain why this return date adjustment is being made as an exception"
                InputProps={{
                  sx: { borderRadius: 3 },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <SubmitButton
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={loading || !rentalId || !newReturnDate}
                fullWidth
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {loading ? "Processing..." : "Adjust Return Date"}
              </SubmitButton>
            </Grid>
          </Grid>
        </FormContainer>
      </Box>
    </StyledContainer>
  );
};

export default ReturnDateAdjustment;
