/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  StaffSchedule,
  StaffScheduleDto,
  WorkDays,
  StaffDto,
  ManagerWorkShiftDto,
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

// Helper function to convert WorkDays enum to day index (0-6)
const getDayIndex = (dayFlag: WorkDays): number => {
  switch (dayFlag) {
    case WorkDays.Sunday:
      return 0;
    case WorkDays.Monday:
      return 1;
    case WorkDays.Tuesday:
      return 2;
    case WorkDays.Wednesday:
      return 3;
    case WorkDays.Thursday:
      return 4;
    case WorkDays.Friday:
      return 5;
    case WorkDays.Saturday:
      return 6;
    default:
      return -1;
  }
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
      Object.values(WorkDays).forEach((day) => {
        if (typeof day === "number" && day !== 0) {
          if ((shift.daysOfWeek & day) !== 0) {
            const dayIndex = getDayIndex(day);
            if (dayIndex >= 0) {
              schedule[dayIndex] = getShiftType(shift.shiftStartTime);
            }
          }
        }
      });
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
    const response = await axiosClient.get<any, ManagerWorkShiftDto[]>(
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
    response.forEach((shift) => {
      // Check which days this shift applies to
      Object.values(WorkDays).forEach((day) => {
        if (typeof day === "number" && day !== 0) {
          if ((shift.daysOfWeek & day) !== 0) {
            const dayIndex = getDayIndex(day);
            if (dayIndex >= 0) {
              schedule[dayIndex] = getShiftType(shift.shiftStartTime);
            }
          }
        }
      });
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
      response.length > 0 &&
      response[0].managers &&
      response[0].managers.length > 0
    ) {
      managerName = response[0].managers[0].userName || "Current Manager";
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
    const response = await axiosClient.get<any, StaffScheduleDto[]>(
      `${SCHEDULE_URL}/staff-schedules`
    );
    return transformToStaffSchedule(response);
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
    const response = await axiosClient.get<any, StaffScheduleDto>(
      `${SCHEDULE_URL}/staff-schedules/${staffId}`
    );
    const transformed = transformToStaffSchedule([response]);
    return transformed[0];
  } catch (error) {
    console.error(`Error fetching schedule for staff ${staffId}:`, error);
    throw error;
  }
};

// Get staff working on a specific day
export const getStaffByDay = async (day: WorkDays): Promise<StaffDto[]> => {
  try {
    const response = await axiosClient.get<any, StaffDto[]>(
      `${SCHEDULE_URL}/staff-by-day?day=${day}`
    );
    return response;
  } catch (error) {
    console.error(`Error fetching staff for day ${day}:`, error);
    throw error;
  }
};

export default {
  getManagerSchedule,
  getAllStaffSchedules,
  getStaffSchedule,
  getStaffByDay,
};
