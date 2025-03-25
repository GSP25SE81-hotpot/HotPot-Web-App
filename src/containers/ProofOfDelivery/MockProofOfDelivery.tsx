// src/containers/ProofOfDelivery/MockProofOfDelivery.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Container,
  Link,
  Typography,
  Paper,
  CircularProgress,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import MockProofOfDeliveryForm from "./Form/MockProofOfDeliveryForm";
import { ShippingListDto } from "../../types/proofOfDelivery";

// Mock shipping order data
const mockShippingDetail: ShippingListDto = {
  shippingOrderId: 123,
  orderID: 456,
  deliveryTime: "2025-03-12T10:30:00.000Z",
  deliveryNotes: "Please leave at the front door if no one answers",
  isDelivered: false,
  deliveryAddress: "123 Main Street, Apt 4B, New York, NY 10001",
  customerName: "John Smith",
  customerPhone: "(555) 123-4567",
  orderStatus: "Processing",
  totalPrice: 89.99,
  items: [
    {
      orderDetailId: 1001,
      itemName: "Hotpot Base - Spicy",
      itemType: "Hotpot",
      quantity: 1,
    },
    {
      orderDetailId: 1002,
      itemName: "Beef Slices",
      itemType: "Ingredient",
      quantity: 2,
    },
    {
      orderDetailId: 1003,
      itemName: "Tofu",
      itemType: "Ingredient",
      quantity: 1,
    },
    {
      orderDetailId: 1004,
      itemName: "Chopsticks",
      itemType: "Utensil",
      quantity: 4,
    },
  ],
};

const MockProofOfDelivery: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [shippingDetail, setShippingDetail] = useState<ShippingListDto | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [simulateError, setSimulateError] = useState<boolean>(false);
  const [simulateLoading, setSimulateLoading] = useState<boolean>(false);

  // Mock shipping order ID
  const shippingOrderId = "123";

  useEffect(() => {
    const fetchShippingDetail = async () => {
      try {
        setLoading(true);

        // Simulate API delay
        if (simulateLoading) {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        if (simulateError) {
          throw new Error("Simulated error");
        }

        // Use mock data
        setShippingDetail(mockShippingDetail);
        setError(null);
      } catch (error) {
        console.error("Error fetching shipping detail:", error);
        setError("Failed to load shipping order details");
      } finally {
        setLoading(false);
      }
    };

    fetchShippingDetail();
  }, [simulateError, simulateLoading]);

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
            <Link component="button" onClick={() => setSimulateError(false)}>
              Try Again
            </Link>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        {/* Mock Controls - Only for demo purposes */}
        <Paper sx={{ mb: 3, p: 2, bgcolor: "#f5f5f5" }}>
          <Typography variant="subtitle2" gutterBottom>
            Mock Controls (Demo Only)
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={simulateError}
                  onChange={(e) => setSimulateError(e.target.checked)}
                />
              }
              label="Simulate error"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={simulateLoading}
                  onChange={(e) => setSimulateLoading(e.target.checked)}
                />
              }
              label="Simulate slow loading"
            />
          </Box>
        </Paper>

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

            {/* Order Items */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Order Items
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {shippingDetail.items.map((item) => (
                  <Box
                    key={item.orderDetailId}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 1,
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <Box>
                      <Typography variant="body2">{item.itemName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.itemType}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        )}

        {/* Proof of Delivery Form */}
        {shippingOrderId && (
          <MockProofOfDeliveryForm shippingOrderId={shippingOrderId} />
        )}
      </Box>
    </Container>
  );
};

export default MockProofOfDelivery;
