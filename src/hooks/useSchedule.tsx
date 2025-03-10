// src/hooks/useSchedule.ts
import { useState, useEffect, useCallback } from "react";
import { StaffSchedule } from "../types/scheduleInterfaces";
import scheduleService from "../api/services/scheduleService";
import { useAuthContext } from "../context/AuthContext";

interface UseScheduleReturn {
  loading: boolean;
  error: string | null;
  schedules: StaffSchedule[];
  personalSchedule: StaffSchedule | null;
  refreshSchedules: () => Promise<void>;
}

export const useSchedule = (): UseScheduleReturn => {
  const { authUser, role, isLoading: authLoading } = useAuthContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<StaffSchedule[]>([]);
  const [personalSchedule, setPersonalSchedule] =
    useState<StaffSchedule | null>(null);

  // Use useCallback to memoize the fetchSchedules function
  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // If user is not authenticated, don't fetch anything
      if (!authUser) {
        setSchedules([]);
        setPersonalSchedule(null);
        setLoading(false);
        return;
      }

      // If user is a manager, get their schedule and all staff schedules
      if (role === "Manager") {
        const managerSchedule = await scheduleService.getManagerSchedule();
        const staffSchedules = await scheduleService.getAllStaffSchedules();

        setPersonalSchedule(managerSchedule);
        setSchedules([managerSchedule, ...staffSchedules]);
      }
      // If user is a staff, get only their schedule
      else if (role === "Staff") {
        // For staff, we'll use the authUser as staffId
        // You might need to adjust this if your staffId is different from authUser
        const staffId = parseInt(authUser);
        const staffSchedule = await scheduleService.getStaffSchedule(staffId);
        setPersonalSchedule(staffSchedule);
        setSchedules([staffSchedule]);
      }
      // Otherwise, try to get all staff schedules (for admin)
      else if (role === "Admin") {
        const allSchedules = await scheduleService.getAllStaffSchedules();
        setSchedules(allSchedules);
      }
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load schedules. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [authUser, role]); // Include dependencies that fetchSchedules uses from the component scope

  useEffect(() => {
    // Only fetch schedules when auth loading is complete and user is authenticated
    if (!authLoading && authUser) {
      fetchSchedules();
    } else if (!authLoading) {
      // If auth loading is complete but no user, set loading to false
      setLoading(false);
    }
  }, [authUser, role, authLoading, fetchSchedules]); // Now we can safely include fetchSchedules

  return {
    loading: loading || authLoading,
    error,
    schedules,
    personalSchedule,
    refreshSchedules: fetchSchedules,
  };
};
