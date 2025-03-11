import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useState } from "react";
import { FrontendOrder } from "../../../types/orderManagement";
import { StyledTextField } from "../../../components/StyledComponents";

interface ScheduleDeliveryDialogProps {
  open: boolean;
  onClose: () => void;
  order: FrontendOrder;
  onScheduleDelivery: (date: string, time: string) => Promise<boolean>;
}

const ScheduleDeliveryDialog: React.FC<ScheduleDeliveryDialogProps> = ({
  open,
  onClose,
  order,
  onScheduleDelivery,
}) => {
  const [deliveryDate, setDeliveryDate] = useState(order.scheduledDate || "");
  const [deliveryTime, setDeliveryTime] = useState(order.scheduledTime || "");
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    if (deliveryDate && deliveryTime) {
      setLoading(true);
      try {
        await onScheduleDelivery(deliveryDate, deliveryTime);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setDeliveryDate(order.scheduledDate || "");
    setDeliveryTime(order.scheduledTime || "");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {order.scheduledDate && order.scheduledTime
          ? "Cập nhật lịch giao hàng"
          : "Đặt lịch giao hàng"}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {order.scheduledDate && order.scheduledTime
            ? "Cập nhật ngày và giờ giao hàng."
            : "Chọn ngày và giờ giao hàng."}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledTextField
              label="Ngày giao hàng"
              type="date"
              fullWidth
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
              }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StyledTextField
              label="Giờ giao hàng"
              type="time"
              fullWidth
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              slotProps={{
                inputLabel: { shrink: true },
              }}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleSchedule}
          variant="contained"
          disabled={!deliveryDate || !deliveryTime || loading}
        >
          {loading
            ? "Đang xử lý..."
            : order.scheduledDate && order.scheduledTime
            ? "Cập nhật"
            : "Đặt lịch"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleDeliveryDialog;
