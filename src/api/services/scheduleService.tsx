/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ManagerWorkShiftDto,
  StaffSchedule,
  StaffScheduleDto,
  StaffSDto,
  WorkDays,
} from "../../types/scheduleInterfaces";
import axiosClient from "../axiosInstance";

// Base URLs for different roles
const MANAGER_SCHEDULE_URL = "manager/schedule";
const STAFF_SCHEDULE_URL = "staff/schedule";

// Helper function to determine shift type based on start time and name
const getShiftType = (shiftStartTime: any, shiftName?: string): string => {
  // If we have a shift name, use it to determine the type
  if (shiftName) {
    if (shiftName.toLowerCase().includes("morning")) return "Morning Shift";
    if (shiftName.toLowerCase().includes("evening")) return "Evening Shift";
    if (shiftName.toLowerCase().includes("all day")) return "All Day Shift";
  }

  if (!shiftStartTime) return "Day Off";

  let hour;
  if (typeof shiftStartTime === "string") {
    hour = parseInt(shiftStartTime.split(":")[0], 10);
  } else {
    hour = shiftStartTime.hours || 0;
  }

  if (hour >= 5 && hour < 12) return "Morning Shift";
  if (hour >= 12 && hour < 15) return "Evening Shift";
  return "All Day Shift";
};

// Function to determine if user is a manager
export const isManager = (user: any): boolean => {
  if (!user) return false;

  // Check if the user has a role claim
  if (user.role) {
    return user.role === "Manager";
  }

  // Alternative check if roles are stored differently
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.includes("Manager");
  }

  return false;
};

// Transform a single StaffScheduleDto to StaffSchedule
export const transformSingleStaffSchedule = (
  staffScheduleDto: StaffScheduleDto
): StaffSchedule => {
  const employeeName = staffScheduleDto.staff.name || "Unknown";

  // Create a default schedule with all days off
  const schedule = [
    "Day Off", // Monday
    "Day Off", // Tuesday
    "Day Off", // Wednesday
    "Day Off", // Thursday
    "Day Off", // Friday
    "Day Off", // Saturday
    "Day Off", // Sunday
  ];

  // Check if daysOfWeek exists and is not None
  if (staffScheduleDto.staff.daysOfWeek !== WorkDays.None) {
    // Check each day flag
    const daysToCheck = [
      WorkDays.Monday,
      WorkDays.Tuesday,
      WorkDays.Wednesday,
      WorkDays.Thursday,
      WorkDays.Friday,
      WorkDays.Saturday,
      WorkDays.Sunday,
    ];

    // Default shift type for working days
    const defaultShiftType = "All Day Shift";

    daysToCheck.forEach((day, index) => {
      // Use bitwise AND to check if this day is included in daysOfWeek
      if ((staffScheduleDto.staff.daysOfWeek & day) !== 0) {
        schedule[index] = defaultShiftType;
      }
    });
  }

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
};

// Transform API response to component format for staff schedules
export const transformToStaffSchedule = (
  staffSchedules: StaffScheduleDto[]
): StaffSchedule[] => {
  return staffSchedules.map(transformSingleStaffSchedule);
};

// Get current user's schedule based on role
export const getMySchedule = async (auth: any): Promise<StaffSchedule> => {
  try {
    const isUserManager = isManager(auth.user);
    const endpoint = isUserManager
      ? `${MANAGER_SCHEDULE_URL}/my-schedule`
      : `${STAFF_SCHEDULE_URL}/my-schedule`;

    if (isUserManager) {
      const response = await axiosClient.get<any, ManagerWorkShiftDto[]>(
        endpoint
      );

      // Create a default schedule with all days off
      const schedule = [
        "Day Off", // Monday
        "Day Off", // Tuesday
        "Day Off", // Wednesday
        "Day Off", // Thursday
        "Day Off", // Friday
        "Day Off", // Saturday
        "Day Off", // Sunday
      ];

      // Fill in the shifts
      response.forEach((shift) => {
        // Check which days this shift applies to
        const daysToCheck = [
          WorkDays.Monday,
          WorkDays.Tuesday,
          WorkDays.Wednesday,
          WorkDays.Thursday,
          WorkDays.Friday,
          WorkDays.Saturday,
          WorkDays.Sunday,
        ];

        daysToCheck.forEach((day, index) => {
          if ((shift.daysOfWeek & day) !== 0) {
            // Use the actual shift start time and name from the response
            schedule[index] = getShiftType(
              shift.shiftStartTime,
              shift.shiftName
            );
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
        managerName = response[0].managers[0].name || "Current Manager";
      } else if (auth.user && auth.user.name) {
        managerName = auth.user.name;
      }

      return {
        employeeName: managerName,
        week,
        schedule,
      };
    } else {
      // For staff, we now get a single StaffScheduleDto
      const response = await axiosClient.get<any, StaffScheduleDto>(endpoint);

      return transformSingleStaffSchedule(response);
    }
  } catch (error) {
    console.error("Error fetching schedule:", error);
    throw error;
  }
};

// Manager-only functions
export const getAllStaffSchedules = async (): Promise<StaffSchedule[]> => {
  try {
    const response = await axiosClient.get<any, StaffScheduleDto[]>(
      `${MANAGER_SCHEDULE_URL}/staff-schedules`
    );
    return transformToStaffSchedule(response);
  } catch (error) {
    console.error("Error fetching staff schedules:", error);
    throw error;
  }
};

export const getStaffSchedule = async (
  staffId: number
): Promise<StaffSchedule> => {
  try {
    const response = await axiosClient.get<any, StaffScheduleDto>(
      `${MANAGER_SCHEDULE_URL}/staff-schedules/${staffId}`
    );
    return transformSingleStaffSchedule(response);
  } catch (error) {
    console.error(`Error fetching schedule for staff ${staffId}:`, error);
    throw error;
  }
};

export const getStaffByDay = async (
  day: WorkDays | string
): Promise<StaffSDto[]> => {
  try {
    // Create a params object that conditionally includes the day parameter
    const params: Record<string, string> = {};
    if (day !== "") {
      params.day = day.toString();
    }

    const response = await axiosClient.get<any, StaffSDto[]>(
      `${MANAGER_SCHEDULE_URL}/staff-by-day`,
      { params }
    );
    return response;
  } catch (error) {
    console.error(
      `Error fetching staff${day ? ` for day ${day}` : ""}:`,
      error
    );
    throw error;
  }
};

export const assignStaffWorkDays = async (
  staffId: number,
  workDays: WorkDays
): Promise<StaffSDto> => {
  try {
    const response = await axiosClient.post<any, StaffSDto>(
      `${MANAGER_SCHEDULE_URL}/assign-staff`,
      { staffId, workDays }
    );
    return response;
  } catch (error) {
    console.error("Error assigning staff work days:", error);
    throw error;
  }
};

export default {
  getMySchedule,
  getAllStaffSchedules,
  getStaffSchedule,
  getStaffByDay,
  assignStaffWorkDays,
  isManager,
};
