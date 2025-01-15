import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Stack,
} from "@mui/material";

// Define customColors palette
const customColors = {
  ivory: "#FFFFF0",
  maroon: "#800000",
  palegoldenrod: "#EEE8AA",
  powderblue: "#B0E0E6",
  black: "#000000",
};

// Create theme using customColors
const theme = createTheme({
  palette: {
    background: {
      default: customColors.ivory,
      paper: customColors.ivory,
    },
    primary: {
      main: customColors.maroon,
    },
    secondary: {
      main: customColors.palegoldenrod,
    },
    text: {
      primary: customColors.black,
      secondary: customColors.powderblue,
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h4: { fontWeight: 600, letterSpacing: "-0.02em" },
    h6: { fontWeight: 600, letterSpacing: "-0.01em" },
    body1: { letterSpacing: "-0.01em", lineHeight: 1.5 },
    body2: { letterSpacing: "0", lineHeight: 1.6 },
  },
});

const ManageHotpotOrders: React.FC = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: "Alice Brown",
      items: [
        { name: "Seafood Hotpot", quantity: 1 },
        { name: "Extra Shrimp", quantity: 2 },
      ],
      status: "Pending Confirmation",
    },
    {
      id: 2,
      customerName: "Bob Green",
      items: [
        { name: "Vegetarian Hotpot", quantity: 1 },
        { name: "Extra Tofu", quantity: 3 },
      ],
      status: "Pending Confirmation",
    },
  ]);

  const handleUpdateQuantity = (orderId: number, itemIndex: number, quantity: number) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.map((item, index) =>
                index === itemIndex ? { ...item, quantity } : item
              ),
            }
          : order
      )
    );
  };

  const handleUpdateStatus = (orderId: number, newStatus: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 3, bgcolor: "background.default" }}>
        <Typography variant="h4" component="h1" mb={3} color="primary">
          Manage Hotpot Orders
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "secondary.main" }}>
                <TableCell sx={{ fontWeight: 600 }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hotpot & Add-Ons</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Order Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <Stack spacing={2}>
                      {order.items.map((item, index) => (
                        <Stack direction="row" spacing={2} key={index} alignItems="center">
                          <Typography sx={{ color: "text.primary", minWidth: 150 }}>
                            {item.name}:
                          </Typography>
                          <TextField
                            size="small"
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                order.id,
                                index,
                                parseInt(e.target.value) || 0
                              )
                            }
                            sx={{
                              width: "80px",
                              "& .MuiOutlinedInput-root": {
                                bgcolor: "background.paper",
                                "& fieldset": {
                                  borderColor: "primary.main",
                                },
                                "&:hover fieldset": {
                                  borderColor: "secondary.main",
                                },
                              },
                            }}
                          />
                        </Stack>
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color:
                          order.status === "Confirmed"
                            ? customColors.powderblue
                            : customColors.maroon,
                        fontWeight: 500,
                      }}
                    >
                      {order.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={1} direction="row">
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "primary.main",
                          color: "background.default",
                          "&:hover": {
                            bgcolor: customColors.powderblue,
                          },
                        }}
                        onClick={() => handleUpdateStatus(order.id, "Confirmed")}
                      >
                        Confirm Order
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: customColors.palegoldenrod,
                          color: "text.primary",
                          "&:hover": {
                            bgcolor: customColors.black,
                            color: "background.default",
                          },
                        }}
                        onClick={() => handleUpdateStatus(order.id, "Cancelled")}
                      >
                        Cancel Order
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </ThemeProvider>
  );
};

export default ManageHotpotOrders;
