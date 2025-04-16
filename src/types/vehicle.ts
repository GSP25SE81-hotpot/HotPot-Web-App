import { VehicleStatus, VehicleType } from "./orderManagement";

export interface VehicleDTO {
  vehicleId: number;
  name: string;
  licensePlate: string;
  type: VehicleType;
  status: VehicleStatus;
  notes: string;
  createdAt: string;
  updateAt: string;
}
