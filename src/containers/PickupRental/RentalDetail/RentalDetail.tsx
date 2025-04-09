// src/pages/Staff/RentalDetail/RentalDetail.tsx
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { rentalService } from "../../../api/Services/pickupService";
import ErrorAlert from "../../../components/errorAlert/ErrorAlert";
import LoadingSpinner from "../../../components/loadingSpinner/LoadingSpinner";
import {
  AnimatedButton,
  CardTitle,
  SectionHeading,
  StyledCard,
  StyledContainer,
  StyledDivider,
} from "../../../components/StyledComponents";
import { useApi } from "../../../hooks/useApi";
import { formatCurrency, formatDate } from "../../../utils/formatters";

const RentalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Updated to use getRentOrder instead of getRentalDetail
  const { data, loading, error, execute } = useApi(rentalService.getRentOrder);

  useEffect(() => {
    if (id) {
      execute(parseInt(id));
    }
  }, [execute, id]);

  const handleRecordReturn = () => {
    if (data) {
      navigate("/rentals/record-return", {
        state: {
          rentOrderId: data.orderId,
          customerName: data.customerName,
          equipmentName: data.utensilName || data.hotpotName,
          expectedReturnDate: data.expectedReturnDate,
        },
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <StyledContainer maxWidth="lg">
      <Box sx={{ mt: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <SectionHeading variant="h4" component="h1">
            Chi tiết thuê #{id}
          </SectionHeading>
        </Box>

        {data && (
          <>
            <Box mb={3} display="flex" justifyContent="flex-end">
              {!data.actualReturnDate && (
                <AnimatedButton
                  variant="contained"
                  color="primary"
                  onClick={handleRecordReturn}
                >
                  Ghi nhận trả
                </AnimatedButton>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <StyledCard elevation={2} sx={{ height: "100%" }}>
                  <Box sx={{ p: 3 }}>
                    <CardTitle variant="h6" gutterBottom>
                      Thông tin khách hàng
                    </CardTitle>
                    <StyledDivider sx={{ my: 1.5 }} />
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Tên"
                          secondary={data.customerName}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                          secondaryTypographyProps={{ fontSize: "1rem" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Địa chỉ"
                          secondary={data.customerAddress}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Điện thoại"
                          secondary={data.customerPhone}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                        />
                      </ListItem>
                    </List>
                  </Box>
                </StyledCard>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <StyledCard elevation={2} sx={{ height: "100%" }}>
                  <Box sx={{ p: 3 }}>
                    <CardTitle variant="h6" gutterBottom>
                      Thông tin thiết bị
                    </CardTitle>
                    <StyledDivider sx={{ my: 1.5 }} />
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Loại"
                          secondary={data.utensilId ? "Dụng cụ" : "Nồi lẩu"}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                          secondaryTypographyProps={{ fontSize: "1rem" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Tên"
                          secondary={data.utensilName || data.hotpotName}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                          secondaryTypographyProps={{ fontSize: "1rem" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Số lượng"
                          secondary={data.quantity}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                          secondaryTypographyProps={{ fontSize: "1rem" }}
                        />
                      </ListItem>
                    </List>
                  </Box>
                </StyledCard>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <StyledCard elevation={2}>
                  <Box sx={{ p: 3 }}>
                    <CardTitle variant="h6" gutterBottom>
                      Chi tiết thuê
                    </CardTitle>
                    <StyledDivider sx={{ my: 1.5 }} />
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Mã đơn hàng
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {data.orderId}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Giá thuê
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {formatCurrency(data.rentalPrice)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Ngày bắt đầu thuê
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {formatDate(data.rentalStartDate)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Ngày trả dự kiến
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {formatDate(data.expectedReturnDate)}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <StyledDivider sx={{ my: 2 }} />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Ngày trả thực tế
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {data.actualReturnDate
                            ? formatDate(data.actualReturnDate)
                            : "Chưa trả"}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Phí trễ hạn
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {data.lateFee
                            ? formatCurrency(data.lateFee)
                            : "Không có"}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Phí hư hỏng
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {data.damageFee
                            ? formatCurrency(data.damageFee)
                            : "Không có"}
                        </Typography>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <StyledDivider sx={{ my: 2 }} />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Ghi chú thuê
                        </Typography>
                        <Typography variant="body1">
                          {data.rentalNotes || "Không có ghi chú"}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Tình trạng trả
                        </Typography>
                        <Typography variant="body1">
                          {data.returnCondition || "Chưa ghi nhận"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </StyledCard>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </StyledContainer>
  );
};

export default RentalDetail;
