// src/services/scheduleService.ts

// import { axiosClient } from "../axiosInstance";
import {
  StaffSchedule,
  StaffScheduleDto,
  WorkShiftDto,
  WorkDays,
  StaffDto,
} from "../../types/scheduleInterfaces";
import axiosClient from "../axiosInstance";

const SCHEDULE_URL = "manager/schedule";

// Helper function to determine shift type based on start time
const getShiftType = (shiftStartTime: string): string => {
  const hour = parseInt(shiftStartTime.split(":")[0], 10);

  if (hour >= 5 && hour < 12) return "Morning Shift";
  if (hour >= 12 && hour < 15) return "Evening Shift";
  return "Overnight Shift";
};

// Helper function to convert WorkDays enum to day of week
const getDayOfWeek = (dayFlag: number): number => {
  if (dayFlag & WorkDays.Monday) return 1;
  if (dayFlag & WorkDays.Tuesday) return 2;
  if (dayFlag & WorkDays.Wednesday) return 4;
  if (dayFlag & WorkDays.Thursday) return 8;
  if (dayFlag & WorkDays.Friday) return 16;
  if (dayFlag & WorkDays.Saturday) return 32;
  if (dayFlag & WorkDays.Sunday) return 64;
  return 0;
};

// Transform API response to component format
const transformToStaffSchedule = (
  staffSchedules: StaffScheduleDto[]
): StaffSchedule[] => {
  return staffSchedules.map((staffSchedule) => {
    const employeeName = staffSchedule.staff.userName || "Unknown";

    // Create a default schedule with all days off
    const schedule = [
      "Day Off",
      "Day Off",
      "Day Off",
      "Day Off",
      "Day Off",
      "Day Off",
      "Day Off",
    ];

    // Fill in the shifts
    staffSchedule.workShifts.forEach((shift) => {
      // Check which days this shift applies to
      for (let flag = 1; flag <= 64; flag *= 2) {
        if (shift.daysOfWeek & flag) {
          const dayIndex = getDayOfWeek(flag);
          if (dayIndex >= 0) {
            schedule[dayIndex] = getShiftType(shift.shiftStartTime);
          }
        }
      }
    });

    // Get current week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    const week = startOfWeek.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    return {
      employeeName,
      week,
      schedule,
    };
  });
};

// Get manager's own schedule
export const getManagerSchedule = async (): Promise<StaffSchedule> => {
  try {
    const response = await axiosClient.get<WorkShiftDto[]>(
      `${SCHEDULE_URL}/my-schedule`
    );

    // Create a default schedule with all days off
    const schedule = [
      "Day Off",
      "Day Off",
      "Day Off",
      "Day Off",
      "Day Off",
      "Day Off",
      "Day Off",
    ];

    // Fill in the shifts
    response.data.forEach((shift) => {
      // Check which days this shift applies to
      for (let flag = 1; flag <= 64; flag *= 2) {
        if (shift.daysOfWeek & flag) {
          const dayIndex = getDayOfWeek(flag);
          if (dayIndex >= 0) {
            schedule[dayIndex] = getShiftType(shift.shiftStartTime);
          }
        }
      }
    });

    // Get current week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    const week = startOfWeek.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    // Get manager name from first shift if available
    let managerName = "Current Manager";
    if (
      response.data.length > 0 &&
      response.data[0].managers &&
      response.data[0].managers.length > 0
    ) {
      managerName = response.data[0].managers[0].userName || "Current Manager";
    }

    return {
      employeeName: managerName,
      week,
      schedule,
    };
  } catch (error) {
    console.error("Error fetching manager schedule:", error);
    throw error;
  }
};

// Get all staff schedules
export const getAllStaffSchedules = async (): Promise<StaffSchedule[]> => {
  try {
    const response = await axiosClient.get<StaffScheduleDto[]>(
      `${SCHEDULE_URL}/staff-schedules`
    );
    return transformToStaffSchedule(response.data);
  } catch (error) {
    console.error("Error fetching staff schedules:", error);
    throw error;
  }
};

// Get schedule for a specific staff
export const getStaffSchedule = async (
  staffId: number
): Promise<StaffSchedule> => {
  try {
    const response = await axiosClient.get<StaffScheduleDto>(
      `${SCHEDULE_URL}/staff-schedules/${staffId}`
    );
    const transformed = transformToStaffSchedule([response.data]);
    return transformed[0];
  } catch (error) {
    console.error(`Error fetching schedule for staff ${staffId}:`, error);
    throw error;
  }
};

// Get staff working on a specific day
export const getStaffByDay = async (day: WorkDays): Promise<StaffDto[]> => {
  try {
    const response = await axiosClient.get<StaffDto[]>(
      `${SCHEDULE_URL}/staff-by-day?day=${day}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching staff for day ${day}:`, error);
    throw error;
  }
};

// Get shifts for a specific day
export const getShiftsByDay = async (
  day: WorkDays
): Promise<WorkShiftDto[]> => {
  try {
    const response = await axiosClient.get<WorkShiftDto[]>(
      `${SCHEDULE_URL}/shifts-by-day?day=${day}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching shifts for day ${day}:`, error);
    throw error;
  }
};

export default {
  getManagerSchedule,
  getAllStaffSchedules,
  getStaffSchedule,
  getStaffByDay,
  getShiftsByDay,
};
