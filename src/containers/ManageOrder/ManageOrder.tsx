import React, { useState } from "react";
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

const ManageOrder: React.FC = () => {
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
      <Box sx={{ p: 3, bgcolor: customColors.ivory }}>
        <Typography variant="h4" component="h1" mb={3} color="primary">
          Manage Hotpot Orders
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: customColors.palegoldenrod }}>
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
                          <Typography sx={{ color: customColors.black, minWidth: 150 }}>
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
                                bgcolor: customColors.ivory,
                                "& fieldset": {
                                  borderColor: customColors.maroon,
                                },
                                "&:hover fieldset": {
                                  borderColor: customColors.palegoldenrod,
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
                          bgcolor: customColors.maroon,
                          color: customColors.ivory,
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
                          color: customColors.black,
                          "&:hover": {
                            bgcolor: customColors.black,
                            color: customColors.ivory,
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
  );
};

export default ManageOrder;
