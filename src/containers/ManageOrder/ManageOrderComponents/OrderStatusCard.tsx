import React from "react";
import { OrderStatus } from "../../../api/Services/orderManagementService";
import {
  getOrderStatusLabel,
  getOrderStatusColor,
} from "../../../utils/formatters";
import {
  StatusCardContainer,
  StatusLabel,
  CountContainer,
  CountValue,
  StatusDot,
  OrderCountLabel,
} from "../../../components/manager/styles/OrderStatusCardStyles";

interface OrderStatusCardProps {
  status: OrderStatus;
  count: number;
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ status, count }) => {
  const statusColor = getOrderStatusColor(status);
  const statusLabel = getOrderStatusLabel(status);

  return (
    <StatusCardContainer statuscolor={statusColor} elevation={0}>
      <StatusLabel variant="h6">{statusLabel}</StatusLabel>
      <CountContainer>
        <CountValue variant="h3" statuscolor={statusColor}>
          {count}
        </CountValue>
        <StatusDot statuscolor={statusColor} />
      </CountContainer>
      <OrderCountLabel variant="body2"></OrderCountLabel>
    </StatusCardContainer>
  );
};

export default OrderStatusCard;
