// src/components/order-management/components/OrderDeliveryManagement.tsx

import { CalendarMonth } from "@mui/icons-material";
import { Avatar, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import {
  FrontendOrder,
  FrontendStaff,
  OrderStatus,
} from "../../../types/orderManagement";
import {
  AnimatedButton,
  StatusChip,
  StyledCard,
} from "../../../components/StyledComponents";
import {
  getAvailableNextStatuses,
  getStatusIcon,
} from "../../../utils/statusUtils";
import AssignStaffDialog from "../Dialogs/AssignStaffDialog";
import ScheduleDeliveryDialog from "../Dialogs/ScheduleDeliveryDialog";
import UpdateStatusDialog from "../Dialogs/UpdateStatusDialog";

interface OrderDeliveryManagementProps {
  order: FrontendOrder;
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

const OrderDeliveryManagement: React.FC<OrderDeliveryManagementProps> = ({
  order,
  staffList,
  onAssignStaff,
  onScheduleDelivery,
  onUpdateStatus,
}) => {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = useState(false);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledCard variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Phân công giao hàng
            </Typography>
            {order.assignedTo ? (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <Avatar>{order.assignedTo.name.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="body1">
                      {order.assignedTo.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.assignedTo.role} • Liên hệ:{" "}
                      {order.assignedTo.contact}
                    </Typography>
                  </Box>
                </Box>
                <AnimatedButton
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => setAssignDialogOpen(true)}
                >
                  Thay đổi nhân viên
                </AnimatedButton>
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Đơn hàng chưa được phân công cho nhân viên nào.
                </Typography>
                <AnimatedButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setAssignDialogOpen(true)}
                >
                  Phân công nhân viên
                </AnimatedButton>
              </Box>
            )}
          </StyledCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <StyledCard variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Lịch giao hàng
            </Typography>
            {order.scheduledDate && order.scheduledTime ? (
              <Box>
                <Typography
                  variant="body1"
                  sx={{ mb: 2, fontWeight: "medium" }}
                >
                  <CalendarMonth
                    fontSize="small"
                    sx={{ verticalAlign: "middle", mr: 0.5 }}
                  />
                  {order.scheduledDate} lúc {order.scheduledTime}
                </Typography>
                <AnimatedButton
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => setScheduleDialogOpen(true)}
                >
                  Cập nhật lịch giao hàng
                </AnimatedButton>
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Chưa có lịch giao hàng.
                </Typography>
                <AnimatedButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setScheduleDialogOpen(true)}
                >
                  Đặt lịch giao hàng
                </AnimatedButton>
              </Box>
            )}
          </StyledCard>
        </Grid>
      </Grid>
      <StyledCard variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Cập nhật trạng thái
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Trạng thái hiện tại:{" "}
            <StatusChip
              status={order.status}
              label={order.status.split("_").join(" ")}
              size="small"
              icon={getStatusIcon(order.status)}
            />
          </Typography>
        </Box>
        <AnimatedButton
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => setUpdateStatusDialogOpen(true)}
          disabled={getAvailableNextStatuses(order.status).length === 0}
        >
          Cập nhật trạng thái
        </AnimatedButton>
      </StyledCard>

      {/* Dialogs */}
      <AssignStaffDialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        order={order}
        staffList={staffList}
        onAssignStaff={async (staffId) => {
          const success = await onAssignStaff(order.id, staffId);
          if (success) {
            setAssignDialogOpen(false);
          }
          return success;
        }}
      />

      <ScheduleDeliveryDialog
        open={scheduleDialogOpen}
        onClose={() => setScheduleDialogOpen(false)}
        order={order}
        onScheduleDelivery={async (date, time) => {
          const success = await onScheduleDelivery(order.id, date, time);
          if (success) {
            setScheduleDialogOpen(false);
          }
          return success;
        }}
      />

      <UpdateStatusDialog
        open={updateStatusDialogOpen}
        onClose={() => setUpdateStatusDialogOpen(false)}
        order={order}
        onUpdateStatus={async (status, note) => {
          const success = await onUpdateStatus(order.id, status, note);
          if (success) {
            setUpdateStatusDialogOpen(false);
          }
          return success;
        }}
      />
    </Box>
  );
};

export default OrderDeliveryManagement;
