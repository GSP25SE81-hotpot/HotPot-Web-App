import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState } from "react";
import {
  LocalShipping,
  Schedule,
  AssignmentInd,
  DoneAll,
} from "@mui/icons-material";

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
  {
    id: 1,
    name: "David Wilson",
    vehicle: "Truck-202",
    contact: "555-0101",
    availability: "Available",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    vehicle: "Van-305",
    contact: "555-0102",
    availability: "On Delivery",
  },
  {
    id: 3,
    name: "Michael Brown",
    vehicle: "Truck-205",
    contact: "555-0103",
    availability: "Available",
  },
];

const statusSteps = [
  "PENDING_DELIVERY",
  "SCHEDULED",
  "ASSIGNED_TO_SHIPPER",
  "IN_TRANSIT",
  "DELIVERED",
];

const DeliveryOrder = () => {
  const [orderDetails] = useState(MOCK_ORDER);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [shippingAddress, setShippingAddress] = useState(
    MOCK_ORDER.initialAddress
  );
  const [shipper, setShipper] = useState("");
  const [orderStatus, setOrderStatus] = useState(MOCK_ORDER.status);
  const [statusHistory, setStatusHistory] = useState([
    {
      status: "PENDING_DELIVERY",
      timestamp: new Date().toISOString(),
      actor: "System",
    },
  ]);

  const activeStep = statusSteps.indexOf(orderStatus);

  const handleDeliverySchedule = () => {
    updateStatus("SCHEDULED", "Scheduler");
  };

  const handleShipperAssignment = () => {
    updateStatus("ASSIGNED_TO_SHIPPER", "Manager");
  };

  const updateStatus = (newStatus: string, actor: string) => {
    setOrderStatus(newStatus);
    setStatusHistory((prev) => [
      ...prev,
      {
        status: newStatus,
        timestamp: new Date().toISOString(),
        actor,
      },
    ]);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                <Schedule sx={{ verticalAlign: "middle", mr: 1 }} />
                Lên lịch giao hàng
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="date"
                    label="Ngày giao hàng"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="time"
                    label="Giờ giao hàng"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Địa chỉ giao hàng"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                sx={{ mt: 2 }}
              />
            </Card>

            <Button
              variant="contained"
              color="primary"
              onClick={handleDeliverySchedule}
              disabled={
                !deliveryDate || !deliveryTime || !shippingAddress.trim()
              }
              startIcon={<Schedule />}
            >
              Xác nhận lịch giao
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                <AssignmentInd sx={{ verticalAlign: "middle", mr: 1 }} />
                Chỉ định nhân viên giao hàng
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Chọn shipper</InputLabel>
                <Select
                  value={shipper}
                  label="Chọn shipper"
                  onChange={(e) => setShipper(e.target.value)}
                >
                  {MOCK_SHIPPERS.map((s) => (
                    <MenuItem
                      key={s.id}
                      value={s.name}
                      disabled={s.availability !== "Available"}
                    >
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>{s.name[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={s.name}
                          secondary={`${s.vehicle} • ${s.availability}`}
                        />
                      </ListItem>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                onClick={handleShipperAssignment}
                disabled={!shipper}
                startIcon={<LocalShipping />}
              >
                Chỉ định shipper
              </Button>
            </Card>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                <LocalShipping sx={{ verticalAlign: "middle", mr: 1 }} />
                Theo dõi tiến độ giao hàng
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <List>
                    {statusHistory.map((history, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={history.status}
                          secondary={`${new Date(
                            history.timestamp
                          ).toLocaleString()} • ${history.actor}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ textAlign: "center", p: 2 }}>
                    <Chip
                      label={orderStatus}
                      color={
                        orderStatus === "DELIVERED"
                          ? "success"
                          : orderStatus === "IN_TRANSIT"
                          ? "warning"
                          : "info"
                      }
                      sx={{ mb: 2, fontSize: "1.1rem" }}
                    />

                    <Typography variant="body1" gutterBottom>
                      <strong>Shipper:</strong> {shipper}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Thời gian dự kiến:</strong> {deliveryDate}{" "}
                      {deliveryTime}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => updateStatus("IN_TRANSIT", shipper)}
                  startIcon={<LocalShipping />}
                >
                  Bắt đầu vận chuyển
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => updateStatus("DELIVERED", shipper)}
                  startIcon={<DoneAll />}
                >
                  Xác nhận đã giao
                </Button>
              </Box>
            </Card>
          </Box>
        );

      default:
        return (
          <Alert severity="success" sx={{ mt: 2 }}>
            Đơn hàng đã được giao thành công!
          </Alert>
        );
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        <LocalShipping sx={{ verticalAlign: "middle", mr: 1 }} />
        Quản lý Giao hàng - #{orderDetails.id}
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {statusSteps.map((label) => (
          <Step key={label}>
            <StepLabel>{label.split("_").join(" ")}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {getStepContent(activeStep)}
    </Paper>
  );
};

export default DeliveryOrder;
