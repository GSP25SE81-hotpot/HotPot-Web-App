// src/pages/OrderManagement/components/DeliveryStatusDialog.tsx
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
  TextField,
  Typography,
} from "@mui/material";
import {
  ShippingDetailDTO,
  VehicleInfoDto,
} from "../../../types/orderManagement";
import { getVehicleIcon } from "./helpers/iconHelpers";

interface DeliveryStatusDialogProps {
  open: boolean;
  onClose: () => void;
  shippingInfo?: ShippingDetailDTO;
  vehicleInfo?: VehicleInfoDto;
  isDelivered: boolean;
  setIsDelivered: (value: boolean) => void;
  deliveryNotes: string;
  setDeliveryNotes: (value: string) => void;
  onUpdateDeliveryStatus: (
    isDelivered: boolean,
    notes: string
  ) => Promise<void>;
  isUpdating: boolean;
}

const DeliveryStatusDialog: React.FC<DeliveryStatusDialogProps> = ({
  open,
  onClose,
  shippingInfo,
  vehicleInfo,
  isDelivered,
  setIsDelivered,
  deliveryNotes,
  setDeliveryNotes,
  onUpdateDeliveryStatus,
  isUpdating,
}) => {
  // Reset form when dialog opens
  React.useEffect(() => {
    if (open && shippingInfo) {
      setIsDelivered(shippingInfo.isDelivered);
      setDeliveryNotes(shippingInfo.deliveryNotes || "");
    }
  }, [open, shippingInfo, setIsDelivered, setDeliveryNotes]);

  const handleUpdate = () => {
    onUpdateDeliveryStatus(isDelivered, deliveryNotes);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
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
        Cập nhật trạng thái giao hàng
      </DialogTitle>
      <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
        <Box sx={{ mt: 1, minWidth: 300 }}>
          {/* Display vehicle information if available */}
          {vehicleInfo && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Thông tin phương tiện
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {getVehicleIcon(vehicleInfo.vehicleType)}
                <Typography variant="body2">
                  {vehicleInfo.vehicleName} - {vehicleInfo.licensePlate}
                </Typography>
              </Box>
            </Box>
          )}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="delivery-status-label">
              Trạng thái giao hàng
            </InputLabel>
            <Select
              labelId="delivery-status-label"
              value={isDelivered ? 1 : 0}
              label="Trạng thái giao hàng"
              onChange={(e) => setIsDelivered(e.target.value === 1)}
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <MenuItem value={0}>Đang chờ</MenuItem>
              <MenuItem value={1}>Đã giao</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Ghi chú giao hàng"
            fullWidth
            multiline
            rows={4}
            value={deliveryNotes}
            onChange={(e) => setDeliveryNotes(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: (theme) =>
                    alpha(theme.palette.primary.main, 0.2),
                },
              },
            }}
          />
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
          Hủy bỏ
        </Button>
        <Button
          onClick={handleUpdate}
          variant="contained"
          disabled={
            isUpdating ||
            (shippingInfo?.isDelivered === isDelivered &&
              shippingInfo?.deliveryNotes === deliveryNotes)
          }
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

export default DeliveryStatusDialog;
