// src/components/manager/LateFeeCalculator.tsx
import { Alert, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useState } from "react";
import { calculateLateFee } from "../../../api/Services/rentalService";
import { alpha } from "@mui/material/styles";
// Import styled components
import {
  StyledContainer,
  StyledPaper,
} from "../../../components/StyledComponents";
// Import calculator-specific styled components
import {
  CalculateButton,
  CalculatorTitle,
  FeeAmount,
  ResultBox,
  ResultContainer,
  ResultDivider,
  ResultItem,
  ResultTitle,
  StyledTextField,
} from "../../../components/manager/styles/CalculatorStyles";

const LateFeeCalculator: React.FC = () => {
  const [rentalId, setRentalId] = useState("");
  const [returnDate, setReturnDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lateFee, setLateFee] = useState<number | null>(null);

  const handleCalculate = async () => {
    if (!rentalId) {
      setError("Vui lòng nhập mã thuê");
      return;
    }
    if (!returnDate) {
      setError("Vui lòng chọn ngày trả");
      return;
    }

    setLoading(true);
    setError(null);
    setLateFee(null);

    try {
      const fee = await calculateLateFee(
        parseInt(rentalId, 10),
        returnDate.toISOString()
      );
      setLateFee(fee);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể tính phí trễ hạn"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="md">
      <StyledPaper elevation={0} sx={{ p: 4 }}>
        <CalculatorTitle variant="h4">Máy tính phí trễ hạn</CalculatorTitle>
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
                label="Ngày trả thực tế"
                value={returnDate}
                onChange={(newValue) => setReturnDate(newValue)}
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
            <CalculateButton
              variant="contained"
              color="primary"
              onClick={handleCalculate}
              disabled={loading || !rentalId || !returnDate}
              fullWidth
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Đang tính..." : "Tính phí trễ hạn"}
            </CalculateButton>
          </Grid>
        </Grid>
        {lateFee !== null && (
          <ResultContainer>
            <ResultDivider />
            <ResultTitle variant="h6">Kết quả tính toán</ResultTitle>
            <ResultBox>
              <ResultItem variant="body1">
                <strong>Mã thuê:</strong> {rentalId}
              </ResultItem>
              <ResultItem variant="body1">
                <strong>Ngày trả:</strong> {returnDate?.toLocaleDateString()}
              </ResultItem>
              <FeeAmount>Phí trễ hạn: {lateFee.toFixed(2)}đ</FeeAmount>
            </ResultBox>
          </ResultContainer>
        )}
      </StyledPaper>
    </StyledContainer>
  );
};

export default LateFeeCalculator;
