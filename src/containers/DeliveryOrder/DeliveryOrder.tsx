import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

// Mock Data
const MOCK_ORDER = {
  id: "ORD-2024-001",
  customerName: "John Smith",
  orderItems: [
    { id: 1, name: "Large Hotpot Set", quantity: 1 },
    { id: 2, name: "Extra Cookware", quantity: 2 },
  ],
  initialAddress: "123 Main St, Apartment 4B, New York, NY 10001",
  status: "PENDING_DELIVERY",
};

const MOCK_SHIPPERS = [
  { id: 1, name: "David Wilson" },
  { id: 2, name: "Sarah Johnson" },
  { id: 3, name: "Michael Brown" },
  { id: 4, name: "Emma Davis" },
];

const DeliveryOrder = () => {
  const [orderDetails] = useState(MOCK_ORDER);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [shippingAddress, setShippingAddress] = useState(
    MOCK_ORDER.initialAddress
  );
  const [activeStep, setActiveStep] = useState(0);
  const [shipper, setShipper] = useState("");
  const [orderStatus, setOrderStatus] = useState(MOCK_ORDER.status);

  const steps = ["Schedule Delivery", "Assign Shipper", "Track Shipment"];

  const handleDeliverySchedule = () => {
    setOrderStatus("SCHEDULED");
    setActiveStep(1);
  };

  const handleShipperAssignment = () => {
    setOrderStatus("ASSIGNED_TO_SHIPPER");
    setActiveStep(2);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Order Details:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Customer: {orderDetails.customerName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Items:
              {orderDetails.orderItems.map((item) => (
                <Box key={item.id} sx={{ pl: 2 }}>
                  • {item.name} x{item.quantity}
                </Box>
              ))}
            </Typography>

            <TextField
              type="date"
              label="Delivery Date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              type="time"
              label="Delivery Time"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Confirm Shipping Address"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleDeliverySchedule}
              disabled={
                !deliveryDate || !deliveryTime || !shippingAddress.trim()
              }
            >
              Schedule Delivery
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Delivery scheduled for: {`${deliveryDate} ${deliveryTime}`}
            </Alert>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Shipper</InputLabel>
              <Select
                value={shipper}
                label="Select Shipper"
                onChange={(e) => setShipper(e.target.value)}
              >
                {MOCK_SHIPPERS.map((s) => (
                  <MenuItem key={s.id} value={s.name}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={handleShipperAssignment}
              disabled={!shipper}
            >
              Assign Shipper
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Status: {orderStatus}
            </Alert>

            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Delivery Details
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Scheduled for: {`${deliveryDate} ${deliveryTime}`}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Address: {shippingAddress}
              </Typography>
              <Typography variant="body2">
                Assigned Shipper: {shipper}
              </Typography>
            </Paper>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOrderStatus("IN TRANSIT")}
              sx={{ mr: 1 }}
            >
              Mark as In Transit
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => setOrderStatus("DELIVERED")}
            >
              Mark as Delivered
            </Button>
          </Box>
        );

      default:
        return "Unknown step";
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Delivery Management - Order #{orderDetails.id}
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {getStepContent(activeStep)}
    </Paper>
  );
};

export default DeliveryOrder;
