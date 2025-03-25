// src/components/replacement/CustomerInfo.tsx
import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ReplacementRequestDetailDto } from "../../../types/replacement";

interface CustomerInfoProps {
  request: ReplacementRequestDetailDto;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ request }) => {
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Customer Information
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2">
            <strong>Name:</strong> {request.customerName}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {request.customerEmail}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2">
            <strong>Phone:</strong> {request.customerPhone}
          </Typography>
          <Typography variant="body2">
            <strong>Customer ID:</strong> {request.customerId}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CustomerInfo;
