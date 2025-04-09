/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UserDto {
  userId: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string | null;
  roleName: string | null;
  imageURL: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StaffDto {
  staffId: number;
  workDays: number;
  user: UserDto;
  workShifts: any[];
  shippingOrders: any[] | null;
}

export interface StaffAvailabilityDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  isAvailable: boolean;
  assignmentCount: number;
}

export interface StaffAvailabilityStatus {
  available: boolean;
  reason: string;
}
