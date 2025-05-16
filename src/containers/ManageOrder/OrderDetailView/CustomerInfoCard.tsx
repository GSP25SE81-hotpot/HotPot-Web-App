// src/pages/OrderManagement/components/CustomerInfoCard.tsx
import React from "react";
import { Divider } from "@mui/material";
import {
  CustomerName,
  DetailCard,
  SectionTitle,
  SectionValue,
  StyledCardContent,
  StyledCardHeader,
} from "../../../components/manager/styles/OrderDetailStyles";
import { OrderDetailDTO } from "../../../types/orderManagement";

interface CustomerInfoCardProps {
  order: OrderDetailDTO;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ order }) => {
  return (
    <DetailCard sx={{ flex: 1, minWidth: 300 }}>
      <StyledCardHeader title="Thông tin khách hàng" />
      <Divider />
      <StyledCardContent>
        <SectionTitle>Tên khách hàng</SectionTitle>
        <CustomerName>
          {order.userName || "Khách hàng không xác định"}
        </CustomerName>
        <SectionTitle>Số Điện thoại</SectionTitle>
        <SectionValue>0{order.userPhone}</SectionValue>
        <SectionTitle>Địa chỉ giao hàng</SectionTitle>
        <SectionValue>{order.address || "Không có địa chỉ"}</SectionValue>
        {order.notes && (
          <>
            <SectionTitle>Ghi chú đơn hàng</SectionTitle>
            <SectionValue>{order.notes}</SectionValue>
          </>
        )}
      </StyledCardContent>
    </DetailCard>
  );
};

export default CustomerInfoCard;
