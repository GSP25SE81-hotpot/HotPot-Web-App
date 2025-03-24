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
import { rentalService } from "../../../api/services/pickupService";
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
  const { data, loading, error, execute } = useApi(
    rentalService.getRentalDetail
  );

  useEffect(() => {
    if (id) {
      execute(parseInt(id));
    }
  }, [execute, id]);

  const handleRecordReturn = () => {
    if (data) {
      navigate("/record-return", {
        state: {
          rentOrderDetailId: data.rentOrderDetailId,
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
            Rental Detail #{id}
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
                  Record Return
                </AnimatedButton>
              )}
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <StyledCard elevation={2} sx={{ height: "100%" }}>
                  <Box sx={{ p: 3 }}>
                    <CardTitle variant="h6" gutterBottom>
                      Customer Information
                    </CardTitle>
                    <StyledDivider sx={{ my: 1.5 }} />
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Name"
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
                          primary="Address"
                          secondary={data.customerAddress}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Phone"
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
                      Equipment Information
                    </CardTitle>
                    <StyledDivider sx={{ my: 1.5 }} />
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Type"
                          secondary={data.utensilId ? "Utensil" : "Hotpot"}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                          secondaryTypographyProps={{ fontSize: "1rem" }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Name"
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
                          primary="Quantity"
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
                      Rental Details
                    </CardTitle>
                    <StyledDivider sx={{ my: 1.5 }} />

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Order ID
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
                          Rental Price
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
                          Rental Start Date
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
                          Expected Return Date
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
                          Actual Return Date
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {data.actualReturnDate
                            ? formatDate(data.actualReturnDate)
                            : "Not returned yet"}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Late Fee
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {data.lateFee ? formatCurrency(data.lateFee) : "N/A"}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Damage Fee
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {data.damageFee
                            ? formatCurrency(data.damageFee)
                            : "N/A"}
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
                          Rental Notes
                        </Typography>
                        <Typography variant="body1">
                          {data.rentalNotes || "No notes"}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Return Condition
                        </Typography>
                        <Typography variant="body1">
                          {data.returnCondition || "Not recorded yet"}
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
