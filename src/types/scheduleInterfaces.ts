export enum WorkDays {
  None = 0,
  Sunday = 1,
  Monday = 2,
  Tuesday = 4,
  Wednesday = 8,
  Thursday = 16,
  Friday = 32,
  Saturday = 64,
}

export interface StaffDto {
  staffId: number;
  userId: number;
  userName: string;
  email: string | null;
  workDays: WorkDays | null;
}

export interface ManagerDto {
  managerId: number;
  userId: number;
  userName: string;
  email: string | null;
  workDays: WorkDays | null;
}

export interface WorkShiftDto {
  workShiftId: number;
  shiftStartTime: string;
  daysOfWeek: WorkDays;
  status: string | null;
  staff?: StaffDto[];
  managers?: ManagerDto[];
}

export interface ManagerWorkShiftDto {
  workShiftId: number;
  shiftStartTime: string;
  daysOfWeek: WorkDays;
  status: string | null;
  managers?: ManagerDto[];
}

export interface StaffWorkShiftDto {
  workShiftId: number;
  shiftStartTime: string;
  daysOfWeek: WorkDays;
  status: string | null;
  staff?: StaffDto[];
}

export interface StaffScheduleDto {
  staff: StaffDto;
  workShifts: StaffWorkShiftDto[];
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
