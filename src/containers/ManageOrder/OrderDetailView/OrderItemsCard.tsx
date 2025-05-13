/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/OrderManagement/components/OrderItemsCard.tsx
import React from "react";
import {
  alpha,
  Box,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  DetailCard,
  OrderItemsContainer,
  OrderTotal,
  OrderTotalContainer,
  StyledCardContent,
  StyledCardHeader,
} from "../../../components/manager/styles/OrderDetailStyles";
import { OrderDetailDTO } from "../../../types/orderManagement";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { getItemTypeDisplay } from "./helpers/iconHelpers";

interface OrderItemsCardProps {
  order: OrderDetailDTO;
}

const OrderItemsCard: React.FC<OrderItemsCardProps> = ({ order }) => {
  return (
    <DetailCard>
      <StyledCardHeader title="Chi tiết đơn hàng" />
      <Divider />
      <StyledCardContent>
        <OrderItemsContainer>
          {/* Display order items */}
          {order.orderItems.length > 0 ? (
            <Box sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Sản phẩm</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Loại</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Số lượng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems.map((item) => (
                    <TableRow key={item.orderDetailId}>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Chip
                            label={getItemTypeDisplay(item.itemType).label}
                            color={
                              getItemTypeDisplay(item.itemType).color as any
                            }
                            size="small"
                          />
                        </Box>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Typography
              variant="body1"
              sx={{ fontStyle: "italic", color: "text.secondary" }}
            >
              Không có mặt hàng nào trong đơn hàng này.
            </Typography>
          )}

          {/* Display rental information if available */}
          {order.hasRentItems && order.rentalInfo && (
            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: (theme) => alpha(theme.palette.secondary.light, 0.1),
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Thông tin thuê
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày bắt đầu thuê
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatDate(order.rentalInfo.rentalStartDate)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Ngày dự kiến trả
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {formatDate(order.rentalInfo.expectedReturnDate)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Order Summary */}
          <OrderTotalContainer>
            <OrderTotal>
              Tổng cộng: {formatCurrency(order.totalPrice)}
            </OrderTotal>
          </OrderTotalContainer>
        </OrderItemsContainer>
      </StyledCardContent>
    </DetailCard>
  );
};

export default OrderItemsCard;
