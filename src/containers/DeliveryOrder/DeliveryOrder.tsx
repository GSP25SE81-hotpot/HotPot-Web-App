import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

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
              Chi tiết đơn hàng:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Khách hàng: {orderDetails.customerName}
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Vật phẩm:
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
              Lịch trình giao hàng
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Ngày dự kiến giao hàng: {`${deliveryDate} ${deliveryTime}`}
            </Alert>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Chọn Shipper</InputLabel>
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
              Chỉ định Shipper
            </Button>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Trạng thái: {orderStatus}
            </Alert>

            <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Chi tiết giao hàng
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Đã lên lịch cho: {`${deliveryDate} ${deliveryTime}`}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Địa chỉ: {shippingAddress}
              </Typography>
              <Typography variant="body2">
                Shipper được chỉ định: {shipper}
              </Typography>
            </Paper>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOrderStatus("IN TRANSIT")}
              sx={{ mr: 1 }}
            >
              Đánh dấu là Đang vận chuyển
            </Button>
            <Button
              variant="outlined"
              color="success"
              onClick={() => setOrderStatus("DELIVERED")}
            >
              Đánh dấu là Đã giao hàng
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
        Quản lý giao hàng - Đơn hàng #{orderDetails.id}
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
