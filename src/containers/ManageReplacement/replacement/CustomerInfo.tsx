// src/components/replacement/CustomerInfo.tsx
import { Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/material/styles";
import { ReplacementRequestDetailDto } from "../../../types/replacement";

// Create styled components
const CustomerInfoContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
}));

const CustomerInfoTitle = styled(Typography)({
  fontWeight: 600,
});

const CustomerInfoField = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
}));

interface CustomerInfoProps {
  request: ReplacementRequestDetailDto;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ request }) => {
  return (
    <CustomerInfoContainer variant="outlined">
      <CustomerInfoTitle variant="subtitle1" gutterBottom>
        Thông tin khách hàng
      </CustomerInfoTitle>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomerInfoField variant="body2">
            <strong>Tên:</strong> {request.customerName}
          </CustomerInfoField>
          <CustomerInfoField variant="body2">
            <strong>Email:</strong> {request.customerEmail}
          </CustomerInfoField>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CustomerInfoField variant="body2">
            <strong>Điện thoại:</strong> {request.customerPhone}
          </CustomerInfoField>
          <CustomerInfoField variant="body2">
            <strong>ID khách hàng:</strong> {request.customerId}
          </CustomerInfoField>
        </Grid>
      </Grid>
    </CustomerInfoContainer>
  );
};

export default CustomerInfo;
