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
      setError("Vui lòng nhập mã thuê");
      return;
    }
    if (!newReturnDate) {
      setError("Vui lòng chọn ngày trả mới");
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
        err instanceof Error ? err.message : "Không thể điều chỉnh ngày trả"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="md">
      <Box sx={{ p: 3 }}>
        <AdjustmentTitle variant="h4">
          Điều chỉnh ngày trả (Chỉ trường hợp đặc biệt)
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
              Đã điều chỉnh ngày trả thành công!
            </Alert>
          )}
          <WarningText variant="body2">
            Biểu mẫu này chỉ nên được sử dụng cho các trường hợp đặc biệt. Việc
            gia hạn thông thường nên được xử lý thông qua tài khoản của khách
            hàng.
          </WarningText>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <StyledTextField
                label="Mã thuê"
                variant="outlined"
                fullWidth
                value={rentalId}
                onChange={(e) => setRentalId(e.target.value)}
                disabled={loading}
                placeholder="Nhập mã thuê"
                slotProps={{
                  input: { sx: { borderRadius: 3 } },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Ngày trả mới"
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
                label="Lý do ngoại lệ"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading}
                placeholder="Giải thích lý do tại sao việc điều chỉnh ngày trả này được thực hiện như một trường hợp đặc biệt"
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
                {loading ? "Đang xử lý..." : "Điều chỉnh ngày trả"}
              </SubmitButton>
            </Grid>
          </Grid>
        </FormContainer>
      </Box>
    </StyledContainer>
  );
};

export default ReturnDateAdjustment;
