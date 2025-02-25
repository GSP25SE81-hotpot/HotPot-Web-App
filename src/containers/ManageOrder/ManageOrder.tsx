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
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

const availableItems = [
  { name: "Lẩu hải sản" },
  { name: "Lẩu chay" },
  { name: "Thêm tôm" },
  { name: "Thêm đậu hũ" },
  { name: "Thêm thịt bò" },
  { name: "Thêm rau" },
];

const StatusChip = ({ status }: { status: string }) => {
  const theme = useTheme();
  const statusColors: Record<string, string> = {
    "Chờ xác nhận": theme.palette.warning.main,
    "Đã xác nhận": theme.palette.success.main,
    "Đã hủy": theme.palette.error.main,
  };

  return (
    <Chip
      label={status}
      size="small"
      sx={{
        backgroundColor: statusColors[status] || theme.palette.grey[500],
        color: theme.palette.common.white,
      }}
    />
  );
};

const ManageOrder: React.FC = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: "Alice Brown",
      items: [
        { name: "Lẩu hải sản", quantity: 1 },
        { name: "Thêm tôm", quantity: 2 },
      ],
      specialInstructions: "Ít cay",
      status: "Chờ xác nhận",
    },
    {
      id: 2,
      customerName: "Bob Green",
      items: [
        { name: "Lẩu chay", quantity: 1 },
        { name: "Thêm đậu hũ", quantity: 3 },
      ],
      specialInstructions: "Đừng bỏ nấm",
      status: "Chờ xác nhận",
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
    <Box
      sx={{
        p: 3,
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" component="h1" mb={3} color="primary">
        Quản lý đơn hàng lẩu
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.grey[200] }}>
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
                        <Typography sx={{ minWidth: 150 }}>
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
                            "& .MuiInputBase-root": {
                              bgcolor: theme.palette.background.paper,
                            },
                          }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleRemoveItem(order.id, index)}
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
                        color="primary"
                        onClick={() => handleAddItem(order.id)}
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
                      "& .MuiInputBase-root": {
                        bgcolor: theme.palette.background.paper,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <StatusChip status={order.status} />
                </TableCell>
                <TableCell>
                  <Stack spacing={1} direction="row">
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={order.status === "Hủy"}
                      onClick={() => handleUpdateStatus(order.id, "Xác nhận")}
                    >
                      Xác nhận
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled={order.status === "Hủy"}
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
                handleUpdateStatus(cancelOrderId, "Hủy");
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
