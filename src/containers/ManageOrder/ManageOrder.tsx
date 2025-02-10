import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const customColors = {
  ivory: "#FFFFF0",
  maroon: "#800000",
  palegoldenrod: "#EEE8AA",
  powderblue: "#B0E0E6",
  black: "#000000",
  darkgreen: "#006400",
};

const availableItems = [
  { name: "Seafood Hotpot" },
  { name: "Vegetarian Hotpot" },
  { name: "Extra Shrimp" },
  { name: "Extra Tofu" },
  { name: "Beef Slice" },
  { name: "Vegetable Platter" },
];

const ManageOrder: React.FC = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: "Alice Brown",
      items: [
        { name: "Seafood Hotpot", quantity: 1 },
        { name: "Extra Shrimp", quantity: 2 },
      ],
      specialInstructions: "Less spicy please",
      status: "Pending Confirmation",
    },
    {
      id: 2,
      customerName: "Bob Green",
      items: [
        { name: "Vegetarian Hotpot", quantity: 1 },
        { name: "Extra Tofu", quantity: 3 },
      ],
      specialInstructions: "No mushrooms",
      status: "Pending Confirmation",
    },
  ]);

  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);
  const [selectedNewItems, setSelectedNewItems] = useState<{
    [key: number]: string;
  }>({});

  const handleUpdateQuantity = (
    orderId: number,
    itemIndex: number,
    quantity: number
  ) => {
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

  const handleAddItem = (orderId: number) => {
    const newItem = selectedNewItems[orderId];
    if (!newItem) return;

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: [...order.items, { name: newItem, quantity: 1 }],
            }
          : order
      )
    );
    setSelectedNewItems((prev) => ({ ...prev, [orderId]: "" }));
  };

  const handleRemoveItem = (orderId: number, itemIndex: number) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              items: order.items.filter((_, index) => index !== itemIndex),
            }
          : order
      )
    );
  };

  const handleSpecialInstructionsChange = (
    orderId: number,
    instructions: string
  ) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, specialInstructions: instructions }
          : order
      )
    );
  };

  return (
    <Box sx={{ p: 3, bgcolor: customColors.ivory }}>
      <Typography variant="h4" component="h1" mb={3} color="primary">
        Quản lý đơn hàng lẩu
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: customColors.palegoldenrod }}>
              <TableCell sx={{ fontWeight: 600 }}>Tên khách hàng</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Lẩu & Thêm vào</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Ghi chú đặc biệt</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>
                  <Stack spacing={2}>
                    {order.items.map((item, index) => (
                      <Stack
                        direction="row"
                        spacing={2}
                        key={index}
                        alignItems="center"
                      >
                        <Typography
                          sx={{ color: customColors.black, minWidth: 150 }}
                        >
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
                        <Button
                          variant="outlined"
                          onClick={() => handleRemoveItem(order.id, index)}
                          sx={{
                            color: customColors.maroon,
                            borderColor: customColors.maroon,
                            "&:hover": {
                              bgcolor: customColors.maroon,
                              color: customColors.ivory,
                            },
                          }}
                        >
                          Xóa
                        </Button>
                      </Stack>
                    ))}
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Select
                        value={selectedNewItems[order.id] || ""}
                        onChange={(e) =>
                          setSelectedNewItems({
                            ...selectedNewItems,
                            [order.id]: e.target.value,
                          })
                        }
                        displayEmpty
                        sx={{ minWidth: 150 }}
                      >
                        <MenuItem value="" disabled>
                          Chọn món thêm
                        </MenuItem>
                        {availableItems.map((item, index) => (
                          <MenuItem key={index} value={item.name}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <Button
                        variant="contained"
                        onClick={() => handleAddItem(order.id)}
                        sx={{
                          bgcolor: customColors.maroon,
                          color: customColors.ivory,
                          "&:hover": {
                            bgcolor: customColors.powderblue,
                          },
                        }}
                      >
                        Thêm món
                      </Button>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>
                  <TextField
                    multiline
                    rows={4}
                    value={order.specialInstructions}
                    onChange={(e) =>
                      handleSpecialInstructionsChange(order.id, e.target.value)
                    }
                    sx={{
                      width: "300px",
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
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    sx={{
                      backgroundColor:
                        order.status === "Confirmed"
                          ? customColors.powderblue
                          : order.status === "Cancelled"
                          ? customColors.maroon
                          : customColors.palegoldenrod,
                      color: customColors.black,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Stack spacing={1} direction="row">
                    <Button
                      variant="contained"
                      disabled={order.status === "Cancelled"}
                      sx={{
                        bgcolor: customColors.maroon,
                        color: customColors.ivory,
                        "&:hover": {
                          bgcolor: customColors.powderblue,
                        },
                      }}
                      onClick={() => handleUpdateStatus(order.id, "Confirmed")}
                    >
                      Xác nhận
                    </Button>
                    <Button
                      variant="contained"
                      disabled={order.status === "Cancelled"}
                      sx={{
                        bgcolor: customColors.palegoldenrod,
                        color: customColors.black,
                        "&:hover": {
                          bgcolor: customColors.black,
                          color: customColors.ivory,
                        },
                      }}
                      onClick={() => setCancelOrderId(order.id)}
                    >
                      Hủy đơn
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={cancelOrderId !== null}
        onClose={() => setCancelOrderId(null)}
      >
        <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn hủy đơn hàng này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOrderId(null)}>Hủy bỏ</Button>
          <Button
            onClick={() => {
              if (cancelOrderId !== null) {
                handleUpdateStatus(cancelOrderId, "Cancelled");
                setCancelOrderId(null);
              }
            }}
            color="error"
          >
            Xác nhận hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageOrder;
