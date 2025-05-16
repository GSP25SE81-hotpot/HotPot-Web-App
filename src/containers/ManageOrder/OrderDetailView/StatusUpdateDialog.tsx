// src/pages/OrderManagement/components/StatusUpdateDialog.tsx
import React from "react";
import {
  alpha,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { OrderStatus } from "../../../types/orderManagement";
import { getVietnameseOrderStatusLabel } from "./helpers/iconHelpers";

interface StatusUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  currentStatus: OrderStatus;
  onUpdateStatus: (newStatus: OrderStatus) => Promise<void>;
  isUpdating: boolean;
}

const StatusUpdateDialog: React.FC<StatusUpdateDialogProps> = ({
  open,
  onClose,
  currentStatus,
  onUpdateStatus,
  isUpdating,
}) => {
  const [newStatus, setNewStatus] = React.useState<OrderStatus>(currentStatus);

  React.useEffect(() => {
    if (open) {
      setNewStatus(currentStatus);
    }
  }, [open, currentStatus]);

  const handleStatusChange = (event: SelectChangeEvent<number>) => {
    setNewStatus(Number(event.target.value) as OrderStatus);
  };

  const handleUpdate = () => {
    onUpdateStatus(newStatus);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1.25rem",
          fontWeight: 600,
          pb: 1,
        }}
      >
        Cập nhật trạng thái đơn hàng
      </DialogTitle>
      <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
        <Box sx={{ mt: 1, minWidth: 300 }}>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Trạng thái mới</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              label="Trạng thái mới"
              onChange={handleStatusChange}
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              {Object.values(OrderStatus)
                .filter(
                  (status) =>
                    typeof status === "number" &&
                    status !== OrderStatus.Cart &&
                    status !== OrderStatus.Processed
                )
                .map((status) => (
                  <MenuItem key={status} value={status as number}>
                    {getVietnameseOrderStatusLabel(status as number)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 2,
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          color="primary"
          disabled={isUpdating || newStatus === currentStatus}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          {isUpdating ? <CircularProgress size={24} /> : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusUpdateDialog;
