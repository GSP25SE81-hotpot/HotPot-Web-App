// src/pages/OrderManagement/components/OrderHeader.tsx
import React from "react";
import Grid from "@mui/material/Grid2";
import EditIcon from "@mui/icons-material/Edit";
import {
  ActionButton,
  ActionButtonsContainer,
  HeaderContainer,
  HeaderPaper,
  InfoLabel,
  InfoValue,
  OrderInfoGrid,
  OrderInfoItem,
  OrderTitle,
  StatusChip,
} from "../../../components/manager/styles/OrderDetailStyles";
import { OrderDetailDTO } from "../../../types/orderManagement";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import { getVietnameseOrderStatusLabel } from "./helpers/iconHelpers";

interface OrderHeaderProps {
  order: OrderDetailDTO;
  onUpdateStatus: () => void;
  onUpdateDeliveryStatus: () => void;
  onUpdateDeliveryTime: () => void;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  order,
  onUpdateStatus,
  onUpdateDeliveryStatus,
  onUpdateDeliveryTime,
}) => {
  return (
    <Grid size={{ xs: 12 }} sx={{ mb: 3 }}>
      <HeaderPaper>
        <HeaderContainer>
          <OrderTitle variant="h5">Đơn hàng #{order.orderCode}</OrderTitle>
          <StatusChip
            label={getVietnameseOrderStatusLabel(order.status)}
            status={order.status}
          />
        </HeaderContainer>
        <OrderInfoGrid>
          <OrderInfoItem>
            <InfoLabel>Ngày đặt hàng</InfoLabel>
            <InfoValue>
              {formatDate(order.createdAt || new Date().toISOString())}
            </InfoValue>
          </OrderInfoItem>
          <OrderInfoItem>
            <InfoLabel>Tổng tiền</InfoLabel>
            <InfoValue>{formatCurrency(order.totalPrice)}</InfoValue>
          </OrderInfoItem>
        </OrderInfoGrid>
        <ActionButtonsContainer>
          <ActionButton
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={onUpdateStatus}
          >
            Cập nhật trạng thái
          </ActionButton>
          {order.shippingInfo && (
            <>
              <ActionButton
                variant="outlined"
                color="primary"
                onClick={onUpdateDeliveryStatus}
              >
                Cập nhật trạng thái giao hàng
              </ActionButton>
              <ActionButton
                variant="outlined"
                color="primary"
                onClick={onUpdateDeliveryTime}
              >
                Đặt thời gian giao hàng
              </ActionButton>
            </>
          )}
        </ActionButtonsContainer>
      </HeaderPaper>
    </Grid>
  );
};

export default OrderHeader;
