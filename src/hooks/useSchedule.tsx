// src/hooks/useSchedule.ts
import { useState, useEffect, useCallback } from "react";
import useAuth from "./useAuth";
import scheduleService, { isManager } from "../api/Services/scheduleService";
import {
  StaffSchedule,
  WorkDays,
  StaffSDto,
} from "../types/scheduleInterfaces";

export const useSchedule = () => {
  const { auth } = useAuth();
  const [mySchedule, setMySchedule] = useState<StaffSchedule | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isManagerRole, setIsManagerRole] = useState<boolean>(false);

  useEffect(() => {
    if (auth?.user) {
      setIsManagerRole(isManager(auth.user));
    }
  }, [auth]);

  const fetchMySchedule = useCallback(async () => {
    if (!auth) return null;

    setLoading(true);
    setError(null);
    try {
      const schedule = await scheduleService.getMySchedule(auth);
      setMySchedule(schedule);
      return schedule;
    } catch (err) {
      setError("Failed to fetch schedule");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [auth]);

  const fetchAllStaffSchedules = async (): Promise<StaffSchedule[]> => {
    if (!isManagerRole) {
      setError("Only managers can access staff schedules");
      return [];
    }
    setLoading(true);
    setError(null);
    try {
      const schedules = await scheduleService.getAllStaffSchedules();
      return schedules;
    } catch (err) {
      setError("Failed to fetch staff schedules");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffSchedule = async (
    staffId: number
  ): Promise<StaffSchedule | null> => {
    if (!isManagerRole) {
      setError("Only managers can access staff schedules");
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const schedule = await scheduleService.getStaffSchedule(staffId);
      return schedule;
    } catch (err) {
      setError(`Failed to fetch schedule for staff ${staffId}`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffByDay = async (day: WorkDays): Promise<StaffSDto[]> => {
    if (!isManagerRole) {
      setError("Only managers can access staff by day");
      return [];
    }
    setLoading(true);
    setError(null);
    try {
      const staff = await scheduleService.getStaffByDay(day);
      return staff;
    } catch (err) {
      setError(`Failed to fetch staff for day ${day}`);
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const assignStaffWorkDays = async (
    staffId: number,
    workDays: WorkDays
  ): Promise<boolean> => {
    if (!isManagerRole) {
      setError("Only managers can assign work days");
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      await scheduleService.assignStaffWorkDays(staffId, workDays);

      await fetchMySchedule();
      return true;
    } catch (err) {
      setError("Failed to assign work days");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    mySchedule,
    loading,
    error,
    isManagerRole,
    fetchMySchedule,
    fetchAllStaffSchedules,
    fetchStaffSchedule,
    fetchStaffByDay,
    assignStaffWorkDays,
  };
};

export default useSchedule;
