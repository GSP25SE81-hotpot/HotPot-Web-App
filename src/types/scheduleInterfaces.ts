// src/types/scheduleInterfaces.ts

export enum WorkDays {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 4,
  Thursday = 8,
  Friday = 16,
  Saturday = 32,
  Sunday = 64,
}

export interface StaffDto {
  staffId: number;
  userId: number;
  userName: string;
  email: string | null;
  workDays: number;
}

export interface ManagerDto {
  managerId: number;
  userId: number;
  userName: string;
  email: string | null;
  workDays: number;
  workShifts: string[];
}

export interface WorkShiftDto {
  workShiftId: number;
  shiftStartTime: string;
  daysOfWeek: number;
  status: string | null;
  staff?: StaffDto[];
  managers?: ManagerDto[];
}

export interface StaffScheduleDto {
  staff: StaffDto;
  workShifts: WorkShiftDto[];
}

// Interface for the component's expected format
export interface StaffSchedule {
  employeeName: string;
  week: string;
  schedule: string[];
}

export interface ShiftType {
  color: string;
  backgroundColor: string;
  label: string;
  description: string;
}

export const shiftTypes: Record<string, ShiftType> = {
  "Day Off": {
    color: "#1a5f7a",
    backgroundColor: "#e3fafc",
    label: "OFF",
    description: "Rest day - Not scheduled for work",
  },
  "Morning Shift": {
    color: "#974c00",
    backgroundColor: "#fff4e6",
    label: "AM",
    description: "Morning Shift - Early hours",
  },
  "Evening Shift": {
    color: "#087f5b",
    backgroundColor: "#e6fcf5",
    label: "PM",
    description: "Evening Shift - Late hours",
  },
};
