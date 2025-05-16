// src/pages/OrderManagement/components/DeliveryTimeDialog.tsx
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
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { VehicleInfoDto } from "../../../types/orderManagement";
import { getVehicleIcon } from "./helpers/iconHelpers";

interface DeliveryTimeDialogProps {
  open: boolean;
  onClose: () => void;
  vehicleInfo?: VehicleInfoDto;
  deliveryTime: Date | null;
  setDeliveryTime: (date: Date | null) => void;
  onUpdateDeliveryTime: (date: Date) => Promise<void>;
  isUpdating: boolean;
}

const DeliveryTimeDialog: React.FC<DeliveryTimeDialogProps> = ({
  open,
  onClose,
  vehicleInfo,
  deliveryTime,
  setDeliveryTime,
  onUpdateDeliveryTime,
  isUpdating,
}) => {
  const handleUpdate = () => {
    if (deliveryTime) {
      onUpdateDeliveryTime(deliveryTime);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
          Đặt thời gian giao hàng
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
            <DateTimePicker
              label="Thời gian giao hàng"
              value={deliveryTime}
              onChange={(newValue) => setDeliveryTime(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: (theme) =>
                          alpha(theme.palette.primary.main, 0.2),
                      },
                    },
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
            disabled={isUpdating || !deliveryTime}
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
    </LocalizationProvider>
  );
};

export default DeliveryTimeDialog;
