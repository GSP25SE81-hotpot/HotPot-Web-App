/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/Staff/RecordReturn/RecordReturn.tsx
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Snackbar,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { rentalService } from "../../../api/Services/pickupService";
import {
  AnimatedButton,
  CardTitle,
  SectionHeading,
  StyledCard,
  StyledContainer,
  StyledDivider,
  StyledFormControl,
  StyledPaper,
  StyledSelect,
  StyledTextField,
} from "../../../components/StyledComponents";
import { useApi } from "../../../hooks/useApi";
import { formatDate } from "../../../utils/formatters";

interface LocationState {
  assignmentId?: number;
  rentOrderDetailId?: number;
  customerName: string;
  equipmentName: string;
  expectedReturnDate: string;
}

const RecordReturn: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const [returnDate, setReturnDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [returnCondition, setReturnCondition] = useState<string>("Good");
  const [damageFee, setDamageFee] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<{
    returnDate?: string;
    returnCondition?: string;
    damageFee?: string;
  }>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const { loading, error } = useApi(rentalService.recordReturn);

  if (!state || (!state.assignmentId && !state.rentOrderDetailId)) {
    return (
      <StyledContainer maxWidth="md">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error">
            Yêu cầu không hợp lệ. Thiếu thông tin cần thiết.
          </Alert>
          <AnimatedButton
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Quay lại
          </AnimatedButton>
        </Box>
      </StyledContainer>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  const validateForm = (): boolean => {
    const newErrors: {
      returnDate?: string;
      returnCondition?: string;
      damageFee?: string;
    } = {};

    if (!returnDate) {
      newErrors.returnDate = "Ngày trả là bắt buộc";
    }
    if (!returnCondition) {
      newErrors.returnCondition = "Tình trạng trả là bắt buộc";
    }
    if (damageFee && isNaN(parseFloat(damageFee))) {
      newErrors.damageFee = "Phí hư hỏng phải là một số hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      setSnackbar({
        open: true,
        message: "Đã ghi nhận trả thành công",
        severity: "success",
      });
      // Điều hướng trở lại sau một khoảng thời gian ngắn
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: error || "Không thể ghi nhận trả",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <StyledContainer maxWidth="md">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <SectionHeading variant="h4" component="h1">
            Ghi nhận trả thiết bị
          </SectionHeading>
        </Box>

        <StyledCard elevation={2} sx={{ mb: 4 }}>
          <Box sx={{ p: 3 }}>
            <CardTitle variant="h6" gutterBottom>
              Thông tin thiết bị
            </CardTitle>
            <StyledDivider />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Khách hàng
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {state.customerName}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Thiết bị
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {state.equipmentName}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Ngày trả dự kiến
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatDate(state.expectedReturnDate)}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  fontWeight={500}
                >
                  Mã trả
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {state.assignmentId
                    ? `Nhiệm vụ #${state.assignmentId}`
                    : `Thuê #${state.rentOrderDetailId}`}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </StyledCard>

        <StyledPaper elevation={2}>
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
            <CardTitle variant="h6" gutterBottom>
              Chi tiết trả
            </CardTitle>
            <StyledDivider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <StyledTextField
                  fullWidth
                  label="Ngày trả"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  error={!!errors.returnDate}
                  helperText={errors.returnDate}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <StyledFormControl
                  fullWidth
                  error={!!errors.returnCondition}
                  required
                >
                  <InputLabel id="return-condition-label">
                    Tình trạng trả
                  </InputLabel>
                  <StyledSelect
                    labelId="return-condition-label"
                    value={returnCondition}
                    label="Tình trạng trả"
                    onChange={(e) =>
                      setReturnCondition(e.target.value as string)
                    }
                  >
                    <MenuItem value="Excellent">Xuất sắc</MenuItem>
                    <MenuItem value="Good">Tốt</MenuItem>
                    <MenuItem value="Fair">Khá</MenuItem>
                    <MenuItem value="Poor">Kém</MenuItem>
                    <MenuItem value="Damaged">Hư hỏng</MenuItem>
                  </StyledSelect>
                  {errors.returnCondition && (
                    <FormHelperText>{errors.returnCondition}</FormHelperText>
                  )}
                </StyledFormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <StyledTextField
                  fullWidth
                  label="Phí hư hỏng"
                  type="number"
                  value={damageFee}
                  onChange={(e) => setDamageFee(e.target.value)}
                  error={!!errors.damageFee}
                  helperText={
                    errors.damageFee || "Để trống nếu không có hư hỏng"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">đ</InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <StyledTextField
                  fullWidth
                  label="Ghi chú"
                  multiline
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Nhập bất kỳ ghi chú bổ sung nào về tình trạng hoặc quy trình trả"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button variant="outlined" onClick={handleBack}>
                    Hủy
                  </Button>
                  <AnimatedButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? "Đang xử lý..." : "Ghi nhận trả"}
                  </AnimatedButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default RecordReturn;
