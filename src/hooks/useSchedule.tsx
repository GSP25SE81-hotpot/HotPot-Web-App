// src/hooks/useSchedule.ts
import { useEffect, useState } from "react";
import scheduleService from "../api/Services/scheduleService";
import { StaffDto, StaffSchedule, WorkDays } from "../types/scheduleInterfaces";

export function useManagerSchedule() {
  const [schedule, setSchedule] = useState<StaffSchedule | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const data = await scheduleService.getManagerSchedule();
        setSchedule(data);
        setError(null);
      } catch (err) {
        setError("Failed to load manager schedule");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return { schedule, loading, error };
}

export function useAllStaffSchedules() {
  const [schedules, setSchedules] = useState<StaffSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const data = await scheduleService.getAllStaffSchedules();
        setSchedules(data);
        setError(null);
      } catch (err) {
        setError("Failed to load staff schedules");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return { schedules, loading, error };
}

export function useStaffSchedule(staffId: number) {
  const [schedule, setSchedule] = useState<StaffSchedule | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const data = await scheduleService.getStaffSchedule(staffId);
        setSchedule(data);
        setError(null);
      } catch (err) {
        setError(`Failed to load schedule for staff ${staffId}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [staffId]);

  return { schedule, loading, error };
}

export function useStaffByDay(day: WorkDays) {
  const [staff, setStaff] = useState<StaffDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        const data = await scheduleService.getStaffByDay(day);
        setStaff(data);
        setError(null);
      } catch (err) {
        setError(`Failed to load staff for day ${day}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [day]);

  return { staff, loading, error };
}
