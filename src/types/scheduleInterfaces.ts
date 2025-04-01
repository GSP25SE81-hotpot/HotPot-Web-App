// src/types/scheduleInterfaces.ts
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

export interface TimeSpan {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface StaffDto {
  userId: number;
  name: string | null;
  email: string | null;
  workDays: WorkDays;
}

export interface ManagerSDto {
  userId: number;
  name: string | null;
  email: string | null;
}

export interface StaffSDto {
  userId: number;
  name: string | null;
  email: string | null;
  daysOfWeek: WorkDays;
}

export interface ManagerWorkShiftDto {
  workShiftId: number;
  shiftStartTime: TimeSpan;
  shiftEndTime: TimeSpan | null;
  shiftName: string;
  daysOfWeek: WorkDays;
  managers: ManagerSDto[];
}

export interface StaffWorkShiftDto {
  workShiftId: number;
  shiftStartTime: TimeSpan;
  shiftEndTime: TimeSpan | null;
  shiftName: string;
  daysOfWeek: WorkDays;
  staff?: StaffSDto[];
}

export interface StaffScheduleDto {
  staff: StaffSDto;
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
    description: "Ngày nghỉ",
  },
  "Morning Shift": {
    color: "#974c00",
    backgroundColor: "#fff4e6",
    label: "AM",
    description: "Ca sáng",
  },
  "Evening Shift": {
    color: "#087f5b",
    backgroundColor: "#e6fcf5",
    label: "PM",
    description: "Ca chiều",
  },
  "All Day Shift": {
    color: "#5f3dc4",
    backgroundColor: "#f3f0ff",
    label: "ALL",
    description: "Ca toàn thời gian",
  },
};

export interface AssignStaffWorkDaysDto {
  staffId: number;
  workDays: WorkDays;
}
