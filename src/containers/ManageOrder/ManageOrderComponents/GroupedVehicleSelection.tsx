// src/pages/OrderManagement/components/GroupedVehicleSelection.tsx
import React from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  OrderSize,
  OrderSizeDTO,
  VehicleType,
} from "../../../types/orderManagement";
import { VehicleDTO } from "../../../types/vehicle";
import { getVietnameseOrderSizeLabel } from "./utils/orderHelpers";

interface GroupedVehicleSelectionProps {
  vehicles: VehicleDTO[];
  selectedVehicleId: number | null;
  onVehicleChange: (event: SelectChangeEvent<number>) => void;
  orderSize: OrderSizeDTO | null;
  disabled?: boolean;
}

const GroupedVehicleSelection: React.FC<GroupedVehicleSelectionProps> = ({
  vehicles,
  selectedVehicleId,
  onVehicleChange,
  orderSize,
  disabled = false,
}) => {
  // Group vehicles by type
  const scooters = vehicles.filter((v) => v.type === VehicleType.Scooter);
  const cars = vehicles.filter((v) => v.type === VehicleType.Car);

  // Determine which vehicle type to show first based on order size
  const showScootersFirst = !orderSize || orderSize.size === OrderSize.Small;

  // Get appropriate helper text based on order size
  const getHelperText = () => {
    if (!orderSize) return "Chọn phương tiện giao hàng";

    if (orderSize.size === OrderSize.Small) {
      return "Đơn hàng nhỏ, có thể sử dụng xe máy hoặc ô tô";
    } else {
      return "Đơn hàng lớn, nên sử dụng ô tô để giao hàng";
    }
  };

  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel id="vehicle-select-label">Phương tiện giao hàng</InputLabel>
      <Select
        labelId="vehicle-select-label"
        id="vehicle-select"
        value={selectedVehicleId || ""}
        label="Phương tiện giao hàng"
        onChange={onVehicleChange}
        sx={{
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300,
            },
          },
        }}
      >
        <MenuItem value="" disabled>
          <em>Chọn phương tiện giao hàng</em>
        </MenuItem>

        {/* Order the vehicle groups based on the order size */}
        {showScootersFirst ? (
          <>
            {/* Scooters Group */}
            {scooters.length > 0 && (
              <>
                <MenuItem disabled>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TwoWheelerIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={600}>
                      Xe máy
                    </Typography>
                    {orderSize?.suggestedVehicleType ===
                      VehicleType.Scooter && (
                      <Chip
                        label="Đề xuất"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    )}
                  </Box>
                </MenuItem>
                {scooters.map((vehicle) => (
                  <MenuItem
                    key={vehicle.vehicleId}
                    value={vehicle.vehicleId}
                    sx={{ pl: 4 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TwoWheelerIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {vehicle.name} - {vehicle.licensePlate}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
                <Divider />
              </>
            )}

            {/* Cars Group */}
            {cars.length > 0 && (
              <>
                <MenuItem disabled>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DirectionsCarIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={600}>
                      Ô tô
                    </Typography>
                    {orderSize?.suggestedVehicleType === VehicleType.Car && (
                      <Chip
                        label="Đề xuất"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    )}
                  </Box>
                </MenuItem>
                {cars.map((vehicle) => (
                  <MenuItem
                    key={vehicle.vehicleId}
                    value={vehicle.vehicleId}
                    sx={{ pl: 4 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DirectionsCarIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {vehicle.name} - {vehicle.licensePlate}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {/* Cars Group (shown first for large orders) */}
            {cars.length > 0 && (
              <>
                <MenuItem disabled>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <DirectionsCarIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={600}>
                      Ô tô
                    </Typography>
                    {orderSize?.suggestedVehicleType === VehicleType.Car && (
                      <Chip
                        label="Đề xuất"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    )}
                  </Box>
                </MenuItem>
                {cars.map((vehicle) => (
                  <MenuItem
                    key={vehicle.vehicleId}
                    value={vehicle.vehicleId}
                    sx={{ pl: 4 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <DirectionsCarIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {vehicle.name} - {vehicle.licensePlate}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
                <Divider />
              </>
            )}

            {/* Scooters Group */}
            {scooters.length > 0 && (
              <>
                <MenuItem disabled>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TwoWheelerIcon fontSize="small" />
                    <Typography variant="body2" fontWeight={600}>
                      Xe máy
                    </Typography>
                    {orderSize?.suggestedVehicleType ===
                      VehicleType.Scooter && (
                      <Chip
                        label="Đề xuất"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                    )}
                  </Box>
                </MenuItem>
                {scooters.map((vehicle) => (
                  <MenuItem
                    key={vehicle.vehicleId}
                    value={vehicle.vehicleId}
                    sx={{ pl: 4 }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TwoWheelerIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {vehicle.name} - {vehicle.licensePlate}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </>
            )}
          </>
        )}

        {vehicles.length === 0 && (
          <MenuItem disabled>
            <Typography
              variant="body2"
              color="text.secondary"
              fontStyle="italic"
            >
              Không có phương tiện khả dụng
            </Typography>
          </MenuItem>
        )}
      </Select>

      {orderSize && (
        <FormHelperText>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption">
              Kích thước đơn hàng:{" "}
              <strong>{getVietnameseOrderSizeLabel(orderSize.size)}</strong>
            </Typography>
            {orderSize.suggestedVehicleType && (
              <Chip
                icon={
                  orderSize.suggestedVehicleType === VehicleType.Car ? (
                    <DirectionsCarIcon fontSize="small" />
                  ) : (
                    <TwoWheelerIcon fontSize="small" />
                  )
                }
                label={`Đề xuất: ${
                  orderSize.suggestedVehicleType === VehicleType.Car
                    ? "Ô tô"
                    : "Xe máy"
                }`}
                size="small"
                color="success"
                variant="outlined"
                sx={{ height: 20, fontSize: "0.7rem" }}
              />
            )}
          </Box>
        </FormHelperText>
      )}

      {!orderSize && <FormHelperText>{getHelperText()}</FormHelperText>}
    </FormControl>
  );
};

export default GroupedVehicleSelection;
