import { LocalShipping, Person, Timeline } from "@mui/icons-material";
import { Box, Tab, Tabs, Typography, alpha, useTheme } from "@mui/material";
import React, { useState } from "react";
import {
  FrontendOrder,
  FrontendStaff,
  OrderStatus,
} from "../../../types/orderManagement";
import {
  CenteredBox,
  StatusChip,
  StyledPaper,
} from "../../../components/StyledComponents";
import OrderInformation from "./OrderInformation";
import OrderStatusHistory from "./OrderStatusHistory";
import OrderDeliveryManagement from "./OrderDeliveryManagement";
import { getStatusIcon } from "../../../utils/statusUtils";

interface OrderDetailsProps {
  selectedOrder: FrontendOrder | null;
  staffList: FrontendStaff[];
  onAssignStaff: (orderId: string, staffId: number) => Promise<boolean>;
  onScheduleDelivery: (
    orderId: string,
    date: string,
    time: string
  ) => Promise<boolean>;
  onUpdateStatus: (
    orderId: string,
    status: OrderStatus,
    note: string
  ) => Promise<boolean>;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  selectedOrder,
  staffList,
  onAssignStaff,
  onScheduleDelivery,
  onUpdateStatus,
}) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!selectedOrder) {
    return (
      <StyledPaper>
        <CenteredBox>
          <LocalShipping
            sx={{
              fontSize: 80,
              color: alpha(theme.palette.text.secondary, 0.2),
              mb: 2,
            }}
          />
          <Typography variant="h6" color="text.secondary">
            Chọn một đơn hàng để xem chi tiết
          </Typography>
        </CenteredBox>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Chi tiết đơn hàng #{selectedOrder.id}
        </Typography>
        <StatusChip
          status={selectedOrder.status}
          label={selectedOrder.status.split("_").join(" ")}
          icon={getStatusIcon(selectedOrder.status)}
        />
      </Box>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Thông tin" icon={<Person />} iconPosition="start" />
        <Tab
          label="Lịch sử trạng thái"
          icon={<Timeline />}
          iconPosition="start"
        />
        <Tab
          label="Quản lý giao hàng"
          icon={<LocalShipping />}
          iconPosition="start"
        />
      </Tabs>

      {/* Tab 1: Order Information */}
      {tabValue === 0 && <OrderInformation order={selectedOrder} />}

      {/* Tab 2: Status History */}
      {tabValue === 1 && <OrderStatusHistory order={selectedOrder} />}

      {/* Tab 3: Delivery Management */}
      {tabValue === 2 && (
        <OrderDeliveryManagement
          order={selectedOrder}
          staffList={staffList}
          onAssignStaff={onAssignStaff}
          onScheduleDelivery={onScheduleDelivery}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </StyledPaper>
  );
};

export default OrderDetails;
