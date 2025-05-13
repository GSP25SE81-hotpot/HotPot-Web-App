// src/pages/OrderManagement/components/ShippingInfoCard.tsx
import React from "react";
import { Box, Chip, Divider, Typography } from "@mui/material";
import {
  ActionButton,
  ActionButtonsContainer,
  DetailCard,
  EmptyStateContainer,
  EmptyStateText,
  SectionTitle,
  SectionValue,
  StyledCardContent,
  StyledCardHeader,
  DeliveryChip,
} from "../../../components/manager/styles/OrderDetailStyles";
import { OrderDetailDTO, VehicleType } from "../../../types/orderManagement";
import { formatDetailDate } from "../../../utils/formatters";
import { getVehicleIcon, getVehicleTypeName } from "./helpers/iconHelpers";
import StaffAssignmentInfo from "./StaffAssignmentInfo";

interface ShippingInfoCardProps {
  order: OrderDetailDTO;
  onUpdateDeliveryStatus: () => void;
  onUpdateDeliveryTime: () => void;
}

const ShippingInfoCard: React.FC<ShippingInfoCardProps> = ({
  order,
  onUpdateDeliveryStatus,
  onUpdateDeliveryTime,
}) => {
  return (
    <DetailCard sx={{ flex: 1, minWidth: 300 }}>
      <StyledCardHeader title="Thông tin giao hàng" />
      <Divider />
      <StyledCardContent>
        {/* Staff Assignment Information - New Section */}
        <StaffAssignmentInfo
          preparationAssignment={order.preparationAssignment}
          shippingAssignment={order.shippingAssignment}
        />

        {order.shippingInfo ? (
          <>
            <Divider sx={{ my: 2 }} />

            <SectionTitle>Thông tin giao hàng</SectionTitle>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {order.shippingInfo.staffName || "Nhân viên không xác định"}
            </Typography>

            {/* Vehicle Information */}
            {order.vehicleInfo && (
              <>
                <SectionTitle>Phương tiện giao hàng</SectionTitle>
                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}
                >
                  {getVehicleIcon(order.vehicleInfo.vehicleType)}
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {order.vehicleInfo.vehicleName} -{" "}
                    {order.vehicleInfo.licensePlate}
                  </Typography>
                  <Chip
                    label={getVehicleTypeName(order.vehicleInfo.vehicleType)}
                    size="small"
                    color={
                      order.vehicleInfo.vehicleType === VehicleType.Car
                        ? "primary"
                        : "secondary"
                    }
                    sx={{ ml: 1, fontWeight: 500 }}
                  />
                </Box>
              </>
            )}

            <SectionTitle>Trạng thái giao hàng</SectionTitle>
            <DeliveryChip
              label={
                order.shippingInfo.isDelivered ? "Đã giao" : "Đang chờ giao"
              }
              delivered={order.shippingInfo.isDelivered}
            />

            <SectionTitle>Thời gian giao hàng dự kiến</SectionTitle>
            <SectionValue>
              {order.shippingInfo.deliveryTime
                ? formatDetailDate(order.shippingInfo.deliveryTime)
                : "Chưa lên lịch"}
            </SectionValue>

            {order.shippingInfo.deliveryNotes && (
              <>
                <SectionTitle>Ghi chú giao hàng</SectionTitle>
                <SectionValue>{order.shippingInfo.deliveryNotes}</SectionValue>
              </>
            )}

            <ActionButtonsContainer>
              <ActionButton
                variant="outlined"
                size="small"
                onClick={onUpdateDeliveryStatus}
              >
                Cập nhật trạng thái
              </ActionButton>
              <ActionButton
                variant="outlined"
                size="small"
                onClick={onUpdateDeliveryTime}
              >
                Đặt thời gian
              </ActionButton>
            </ActionButtonsContainer>
          </>
        ) : (
          <EmptyStateContainer>
            <EmptyStateText>
              Đơn hàng này chưa được phân công cho nhân viên giao hàng.
            </EmptyStateText>
          </EmptyStateContainer>
        )}
      </StyledCardContent>
    </DetailCard>
  );
};

export default ShippingInfoCard;
