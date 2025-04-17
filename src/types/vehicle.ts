// src/types/vehicle.ts
import { VehicleStatus, VehicleType } from "./orderManagement";

export interface VehicleDTO {
  vehicleId: number;
  name: string;
  licensePlate: string;
  type: VehicleType;
  status: VehicleStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateVehicleRequest {
  name: string;
  licensePlate: string;
  type: VehicleType;
  status: VehicleStatus;
  notes?: string | null;
}

export interface UpdateVehicleRequest {
  name: string;
  licensePlate: string;
  type: VehicleType;
  status: VehicleStatus;
  notes?: string | null;
}

export interface UpdateVehicleStatusRequest {
  status: VehicleStatus;
}

export interface AllocateOrderWithVehicleRequest {
  orderId: number;
  staffId: number;
  vehicleId?: number | null;
}

export interface OrderSizeDTO {
  orderId: number;
  size: OrderSize;
  suggestedVehicleType: VehicleType;
}

export interface VehicleInfoDto {
  vehicleId?: number | null;
  vehicleName: string;
  licensePlate: string;
  vehicleType: VehicleType;
  orderSize?: OrderSize | null;
}

export interface VehicleQueryParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
  searchTerm?: string;
  type?: VehicleType;
  status?: VehicleStatus;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export enum OrderSize {
  Small = 1,
  Large = 2,
}
