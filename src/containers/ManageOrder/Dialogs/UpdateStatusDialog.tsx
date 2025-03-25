import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FrontendOrder, OrderStatus } from "../../../types/orderManagement";
import {
  StatusChip,
  StyledSelect,
  StyledTextField,
} from "../../../components/StyledComponents";
import {
  getAvailableNextStatuses,
  getStatusIcon,
} from "../../../utils/statusUtils";

interface UpdateStatusDialogProps {
  open: boolean;
  onClose: () => void;
  order: FrontendOrder;
  onUpdateStatus: (status: OrderStatus, note: string) => Promise<boolean>;
}

const UpdateStatusDialog: React.FC<UpdateStatusDialogProps> = ({
  open,
  onClose,
  order,
  onUpdateStatus,
}) => {
  const [newStatus, setNewStatus] = useState<OrderStatus | "">("");
  const [statusNote, setStatusNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (newStatus) {
      setLoading(true);
      try {
        await onUpdateStatus(newStatus as OrderStatus, statusNote);
        setNewStatus("");
        setStatusNote("");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setNewStatus("");
    setStatusNote("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Trạng thái hiện tại:{" "}
          <StatusChip
            status={order.status}
            label={order.status.split("_").join(" ")}
            size="small"
            icon={getStatusIcon(order.status)}
          />
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Trạng thái mới</InputLabel>
          <StyledSelect
            value={newStatus}
            label="Trạng thái mới"
            onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
          >
            {getAvailableNextStatuses(order.status).map((status) => (
              <MenuItem key={status} value={status}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getStatusIcon(status)}
                  <Typography>{status.split("_").join(" ")}</Typography>
                </Box>
              </MenuItem>
            ))}
          </StyledSelect>
        </FormControl>
        <StyledTextField
          label="Ghi chú (tùy chọn)"
          fullWidth
          multiline
          rows={3}
          value={statusNote}
          onChange={(e) => setStatusNote(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Hủy</Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          disabled={newStatus === "" || loading}
        >
          {loading ? "Đang xử lý..." : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStatusDialog;
