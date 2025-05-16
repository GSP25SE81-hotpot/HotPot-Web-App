import React from "react";
import { Chip, Tooltip } from "@mui/material";
import {
  OrderStatus,
  OrderWithDetailsDTO,
  VehicleType,
} from "../../../types/orderManagement";
import { getVehicleIcon, getVehicleTypeName } from "./utils/orderHelpers";

interface VehicleInfoDisplayProps {
  order: OrderWithDetailsDTO;
}

const VehicleInfoDisplay: React.FC<VehicleInfoDisplayProps> = ({ order }) => {
  // Only show vehicle info for shipping orders
  if (order.status !== OrderStatus.Shipping || !order.vehicleInfo) {
    return null;
  }

  const vehicleInfo = order.vehicleInfo;

  return (
    <Tooltip
      title={`${vehicleInfo?.vehicleName} - ${vehicleInfo?.licensePlate}`}
    >
      <Chip
        icon={
          vehicleInfo?.vehicleType
            ? getVehicleIcon(vehicleInfo.vehicleType)
            : undefined
        }
        label={getVehicleTypeName(vehicleInfo?.vehicleType)}
        size="small"
        color={
          vehicleInfo?.vehicleType === VehicleType.Car ? "primary" : "secondary"
        }
        sx={{ ml: 1, fontWeight: 500 }}
      />
    </Tooltip>
  );
};

export default VehicleInfoDisplay;
