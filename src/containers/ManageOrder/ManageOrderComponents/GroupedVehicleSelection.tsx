// src/components/GroupedVehicleSelection.tsx
import React, { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import { OrderSizeDTO, VehicleType } from "../../../types/orderManagement";
import { VehicleDTO } from "../../../types/vehicle";
import { getVietnameseOrderSizeLabel } from "./utils/orderHelpers";
import {
  VehicleSelectionContainer,
  StyledFormControl,
  StyledSelect,
  StyledMenuItem,
  VehicleItemContainer,
  SectionTitle,
  VehicleTypeHeader,
  VehicleButtonsContainer,
  VehicleButton,
  OrderSizeContainer,
  SuggestionChip,
} from "./utils/GroupedVehicleSelectionStyles";
import { InputLabel, Typography } from "@mui/material";

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

  // Handle direct selection
  const handleDirectSelection = (vehicleId: number) => {
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
    // Update local state
    setLocalSelectedId(event.target.value);

    // Propagate to parent
    onVehicleChange(event);
  };

  return (
    <VehicleSelectionContainer>
      <StyledFormControl fullWidth disabled={disabled}>
        <InputLabel id="vehicle-select-label">Phương tiện giao hàng</InputLabel>
        <StyledSelect
          labelId="vehicle-select-label"
          id="vehicle-select"
          value={localSelectedId}
          label="Phương tiện giao hàng"
          onChange={handleSelectChange}
        >
          <StyledMenuItem value="">
            <em>Chọn phương tiện giao hàng</em>
          </StyledMenuItem>
          {vehicles.map((vehicle) => (
            <StyledMenuItem
              key={vehicle.vehicleId}
              value={String(vehicle.vehicleId)}
            >
              <VehicleItemContainer>
                {vehicle.type === VehicleType.Car ? (
                  <DirectionsCarIcon fontSize="small" color="action" />
                ) : (
                  <TwoWheelerIcon fontSize="small" color="action" />
                )}
                <Typography variant="body2">
                  {vehicle.name} - {vehicle.licensePlate}
                </Typography>
              </VehicleItemContainer>
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </StyledFormControl>

      {/* Alternative direct selection buttons */}
      <SectionTitle variant="subtitle2">Hoặc chọn trực tiếp:</SectionTitle>

      {/* Scooters */}
      {scooters.length > 0 && (
        <VehicleButtonsContainer>
          <VehicleTypeHeader variant="body2">
            <TwoWheelerIcon fontSize="small" />
            Xe máy
          </VehicleTypeHeader>
          <VehicleButtonsContainer>
            {scooters.map((vehicle) => (
              <VehicleButton
                key={vehicle.vehicleId}
                isSelected={Number(localSelectedId) === vehicle.vehicleId}
                variant={
                  Number(localSelectedId) === vehicle.vehicleId
                    ? "contained"
                    : "outlined"
                }
                size="small"
                onClick={() => handleDirectSelection(vehicle.vehicleId)}
                startIcon={<TwoWheelerIcon />}
                disabled={disabled}
              >
                {vehicle.name}
              </VehicleButton>
            ))}
          </VehicleButtonsContainer>
        </VehicleButtonsContainer>
      )}

      {/* Cars */}
      {cars.length > 0 && (
        <VehicleButtonsContainer>
          <VehicleTypeHeader variant="body2">
            <DirectionsCarIcon fontSize="small" />Ô tô
          </VehicleTypeHeader>
          <VehicleButtonsContainer>
            {cars.map((vehicle) => (
              <VehicleButton
                key={vehicle.vehicleId}
                isSelected={Number(localSelectedId) === vehicle.vehicleId}
                variant={
                  Number(localSelectedId) === vehicle.vehicleId
                    ? "contained"
                    : "outlined"
                }
                size="small"
                onClick={() => handleDirectSelection(vehicle.vehicleId)}
                startIcon={<DirectionsCarIcon />}
                disabled={disabled}
              >
                {vehicle.name}
              </VehicleButton>
            ))}
          </VehicleButtonsContainer>
        </VehicleButtonsContainer>
      )}

      {orderSize && (
        <OrderSizeContainer>
          <Typography variant="caption">
            Kích thước đơn hàng:{" "}
            <strong>{getVietnameseOrderSizeLabel(orderSize.size)}</strong>
          </Typography>
          {orderSize.suggestedVehicleType && (
            <SuggestionChip
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
            />
          )}
        </OrderSizeContainer>
      )}
    </VehicleSelectionContainer>
  );
};

export default GroupedVehicleSelection;
