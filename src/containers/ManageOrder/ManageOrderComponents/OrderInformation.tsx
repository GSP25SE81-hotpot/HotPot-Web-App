// src/components/order-management/components/OrderInformation.tsx

import { CalendarMonth, LocationOn } from "@mui/icons-material";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import { FrontendOrder } from "../../../types/orderManagement";
import { StyledCard } from "../../../components/StyledComponents";
import { formatDate } from "../../../utils/orderUtils";

interface OrderInformationProps {
  order: FrontendOrder;
}

const OrderInformation: React.FC<OrderInformationProps> = ({ order }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledCard variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Thông tin khách hàng
            </Typography>
            <Typography variant="body1">{order.customerName}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <LocationOn
                fontSize="small"
                sx={{ verticalAlign: "middle", mr: 0.5 }}
              />
              {order.address}
            </Typography>
          </StyledCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledCard variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Thông tin đơn hàng
            </Typography>
            <Typography variant="body2">
              Ngày tạo: {formatDate(order.createdAt)}
            </Typography>
            <Typography variant="body2">
              Cập nhật: {formatDate(order.updatedAt)}
            </Typography>
            <Typography variant="body2">
              Tổng tiền: {order.totalPrice.toLocaleString()} VND
            </Typography>
            {order.scheduledDate && order.scheduledTime && (
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "primary.main",
                  fontWeight: "medium",
                }}
              >
                <CalendarMonth
                  fontSize="small"
                  sx={{ verticalAlign: "middle", mr: 0.5 }}
                />
                Lịch giao hàng: {order.scheduledDate} lúc {order.scheduledTime}
              </Typography>
            )}
          </StyledCard>
        </Grid>
      </Grid>
      <StyledCard variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Danh sách sản phẩm
        </Typography>
        <List>
          {order.orderItems.map((item) => (
            <ListItem key={item.id} divider>
              <ListItemText
                primary={item.name}
                secondary={`Số lượng: ${
                  item.quantity
                } | Giá: ${item.price.toLocaleString()} VND`}
              />
            </ListItem>
          ))}
        </List>
      </StyledCard>
      {order.assignedTo && (
        <StyledCard variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Nhân viên giao hàng
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar>{order.assignedTo.name.charAt(0)}</Avatar>
            <Box>
              <Typography variant="body1">{order.assignedTo.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {order.assignedTo.role} • Liên hệ: {order.assignedTo.contact}
              </Typography>
            </Box>
          </Box>
        </StyledCard>
      )}
    </Box>
  );
};

export default OrderInformation;
