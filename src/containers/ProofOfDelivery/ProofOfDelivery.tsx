import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ProofOfDeliveryForm from "./Form/ProofOfDeliveryForm";
import { getShippingDetail } from "../../api/Services/proofOfDeliveryService";
import { ShippingListDto } from "../../types/proofOfDelivery";

const ProofOfDelivery: React.FC = () => {
  const { shippingOrderId } = useParams<{ shippingOrderId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [shippingDetail, setShippingDetail] = useState<ShippingListDto | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShippingDetail = async () => {
      if (!shippingOrderId) return;

      try {
        setLoading(true);
        const response = await getShippingDetail(parseInt(shippingOrderId));
        setShippingDetail(response);
        setError(null);
      } catch (error) {
        console.error("Error fetching shipping detail:", error);
        setError("Failed to load shipping order details");
      } finally {
        setLoading(false);
      }
    };

    fetchShippingDetail();
  }, [shippingOrderId]);

  if (loading) {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Paper sx={{ p: 3, mt: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Link component="button" onClick={() => navigate("/shipping")}>
              Return to Shipping List
            </Link>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 3 }}
        >
          <Link color="inherit" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Link>
          <Link color="inherit" onClick={() => navigate("/shipping")}>
            Shipping Orders
          </Link>
          <Typography color="text.primary">Proof of Delivery</Typography>
        </Breadcrumbs>

        {/* Customer Info Card */}
        {shippingDetail && (
          <Paper sx={{ p: 2, mb: 3, backgroundColor: "#f8f9fa" }}>
            <Typography variant="h6" gutterBottom>
              Order #{shippingDetail.orderID}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Customer
                </Typography>
                <Typography variant="body1">
                  {shippingDetail.customerName}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1">
                  {shippingDetail.customerPhone}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Delivery Address
                </Typography>
                <Typography variant="body1">
                  {shippingDetail.deliveryAddress}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body1">
                  {shippingDetail.isDelivered ? "Delivered" : "Pending"}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Proof of Delivery Form */}
        {shippingOrderId && (
          <ProofOfDeliveryForm shippingOrderId={shippingOrderId} />
        )}
      </Box>
    </Container>
  );
};

export default ProofOfDelivery;
