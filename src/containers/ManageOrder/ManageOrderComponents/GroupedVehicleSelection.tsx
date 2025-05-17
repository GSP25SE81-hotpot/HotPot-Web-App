import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { OrderSizeDTO, VehicleType } from "../../../types/orderManagement";
import { VehicleDTO } from "../../../types/vehicle";
import { getVietnameseOrderSizeLabel } from "./utils/orderHelpers";

interface GroupedVehicleSelectionProps {
  vehicles: VehicleDTO[];
  selectedVehicleId: number | null;
  onVehicleChange: (event: SelectChangeEvent<string | number>) => void;
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
  // Local state to track selection
  const [localSelectedId, setLocalSelectedId] = useState<string | number>(
    selectedVehicleId === null ? "" : selectedVehicleId
  );

  // Update local state when prop changes
  useEffect(() => {
    setLocalSelectedId(selectedVehicleId === null ? "" : selectedVehicleId);
  }, [selectedVehicleId]);

  // Group vehicles by type
  const scooters = vehicles.filter((v) => v.type === VehicleType.Scooter);
  const cars = vehicles.filter((v) => v.type === VehicleType.Car);

  // Find the selected vehicle for debugging
  // const selectedVehicle = vehicles.find(
  //   (v) => v.vehicleId === Number(localSelectedId)
  // );

  // Handle direct selection
  const handleDirectSelection = (vehicleId: number) => {
    console.log("Direct selection of vehicle ID:", vehicleId);

    // Create a synthetic event
    const syntheticEvent = {
      target: {
        value: String(vehicleId),
        name: "vehicle-select",
      },
    } as SelectChangeEvent<string>;

    // Update local state
    setLocalSelectedId(vehicleId);

    // Propagate to parent
    onVehicleChange(syntheticEvent);
  };

  // Handle standard select change
  const handleSelectChange = (event: SelectChangeEvent<string | number>) => {
    console.log("Select change event:", event);
    console.log("Select change value:", event.target.value);

    // Update local state
    setLocalSelectedId(event.target.value);

    // Propagate to parent
    onVehicleChange(event);
  };

  return (
    <Box>
      <FormControl fullWidth disabled={disabled} sx={{ mb: 2 }}>
        <InputLabel id="vehicle-select-label">Phương tiện giao hàng</InputLabel>
        <Select
          labelId="vehicle-select-label"
          id="vehicle-select"
          value={localSelectedId}
          label="Phương tiện giao hàng"
          onChange={handleSelectChange}
        >
          <MenuItem value="">
            <em>Chọn phương tiện giao hàng</em>
          </MenuItem>

          {vehicles.map((vehicle) => (
            <MenuItem key={vehicle.vehicleId} value={String(vehicle.vehicleId)}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {vehicle.type === VehicleType.Car ? (
                  <DirectionsCarIcon fontSize="small" color="action" />
                ) : (
                  <TwoWheelerIcon fontSize="small" color="action" />
                )}
                <Typography variant="body2">
                  {vehicle.name} - {vehicle.licensePlate}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Alternative direct selection buttons */}
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Hoặc chọn trực tiếp:
      </Typography>

      {/* Scooters */}
      {scooters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <TwoWheelerIcon fontSize="small" />
            Xe máy
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {scooters.map((vehicle) => (
              <Button
                key={vehicle.vehicleId}
                variant={
                  Number(localSelectedId) === vehicle.vehicleId
                    ? "contained"
                    : "outlined"
                }
                size="small"
                onClick={() => handleDirectSelection(vehicle.vehicleId)}
                startIcon={<TwoWheelerIcon />}
                sx={{ borderRadius: 2 }}
                disabled={disabled}
              >
                {vehicle.name}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {/* Cars */}
      {cars.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <DirectionsCarIcon fontSize="small" />Ô tô
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {cars.map((vehicle) => (
              <Button
                key={vehicle.vehicleId}
                variant={
                  Number(localSelectedId) === vehicle.vehicleId
                    ? "contained"
                    : "outlined"
                }
                size="small"
                onClick={() => handleDirectSelection(vehicle.vehicleId)}
                startIcon={<DirectionsCarIcon />}
                sx={{ borderRadius: 2 }}
                disabled={disabled}
              >
                {vehicle.name}
              </Button>
            ))}
          </Box>
        </Box>
      )}

      {/* Debug info */}
      {/* <Box
        sx={{
          mt: 2,
          p: 1,
          bgcolor: "background.paper",
          borderRadius: 1,
          border: "1px dashed grey.300",
        }}
      >
        <Typography
          variant="caption"
          sx={{ display: "block", fontWeight: "bold" }}
        >
          Debug Information:
        </Typography>
        <Typography variant="caption" sx={{ display: "block" }}>
          Local selected ID:{" "}
          {localSelectedId === "" ? "empty string" : localSelectedId}
        </Typography>
        <Typography variant="caption" sx={{ display: "block" }}>
          Prop selectedVehicleId:{" "}
          {selectedVehicleId === null ? "null" : selectedVehicleId}
        </Typography>
        <Typography variant="caption" sx={{ display: "block" }}>
          Selected vehicle:{" "}
          {selectedVehicle
            ? `${selectedVehicle.name} (${selectedVehicle.licensePlate})`
            : "None"}
        </Typography>
        <Typography variant="caption" sx={{ display: "block" }}>
          Vehicles count: {vehicles.length}
        </Typography>
        <Typography variant="caption" sx={{ display: "block" }}>
          Component disabled: {disabled ? "Yes" : "No"}
        </Typography>
      </Box> */}

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
    </Box>
  );
};

export default GroupedVehicleSelection;
