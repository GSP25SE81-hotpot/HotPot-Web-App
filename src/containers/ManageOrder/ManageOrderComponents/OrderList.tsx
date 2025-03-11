import { FilterList, Search } from "@mui/icons-material";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { FrontendOrder, OrderStatus } from "../../../types/orderManagement";
import { getStatusIcon } from "../../../utils/statusUtils";
import { formatDate } from "../../../utils/orderUtils";
import {
  StatusChip,
  StyledPaper,
  StyledSelect,
  StyledTextField,
} from "../../../components/StyledComponents";

interface OrderListProps {
  orders: FrontendOrder[];
  selectedOrder: FrontendOrder | null;
  onOrderSelect: (order: FrontendOrder) => void;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  selectedOrder,
  onOrderSelect,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <StyledPaper>
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <StyledTextField
          placeholder="Tìm kiếm đơn hàng..."
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            },
          }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <StyledSelect
            value={statusFilter}
            label="Trạng thái"
            onChange={(event) =>
              setStatusFilter(event.target.value as OrderStatus | "ALL")
            }
          >
            <MenuItem value="ALL">Tất cả</MenuItem>
            <MenuItem value="PENDING_ASSIGNMENT">Chờ phân công</MenuItem>
            <MenuItem value="ASSIGNED">Đã phân công</MenuItem>
            <MenuItem value="SCHEDULED">Đã lên lịch</MenuItem>
            <MenuItem value="IN_PREPARATION">Đang chuẩn bị</MenuItem>
            <MenuItem value="READY_FOR_PICKUP">Sẵn sàng lấy hàng</MenuItem>
            <MenuItem value="IN_TRANSIT">Đang giao</MenuItem>
            <MenuItem value="DELIVERED">Đã giao</MenuItem>
            <MenuItem value="CANCELLED">Đã hủy</MenuItem>
          </StyledSelect>
        </FormControl>
        <IconButton>
          <FilterList />
        </IconButton>
      </Box>
      <List sx={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <ListItemButton
              key={order.id}
              selected={selectedOrder?.id === order.id}
              onClick={() => onOrderSelect(order)}
              sx={{
                mb: 1,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                transition: "all 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.1
                  )}`,
                },
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  },
                },
              }}
            >
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {order.id}
                    </Typography>
                    <StatusChip
                      status={order.status}
                      label={order.status.split("_").join(" ")}
                      size="small"
                      icon={getStatusIcon(order.status)}
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" component="span">
                      {order.customerName}
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      {order.orderItems.length} sản phẩm • Cập nhật:{" "}
                      {formatDate(order.updatedAt)}
                    </Typography>
                  </>
                }
              />
            </ListItemButton>
          ))
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Không tìm thấy đơn hàng nào
            </Typography>
          </Box>
        )}
      </List>
    </StyledPaper>
  );
};

export default OrderList;
