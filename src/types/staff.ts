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
  staffType: StaffType;
  isAvailable: boolean;
  isEligible: boolean;
  assignmentCount: number;
  workDays?: WorkDays;
  preparedThisOrder: boolean;
  activeOrderIds?: number[];
}

// Add StaffType enum if not already defined
export enum StaffType {
  Preparation = 1,
  Shipping = 2,
}

export interface StaffAvailabilityStatus {
  available: boolean;
  reason: string;
}

export enum WorkDays {
  None = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 4,
  Thursday = 8,
  Friday = 16,
  Saturday = 32,
  Sunday = 64,
  Weekdays = 31, // Mon-Fri
  Weekend = 96, // Sat-Sun
  AllDays = 127, // All days
}
