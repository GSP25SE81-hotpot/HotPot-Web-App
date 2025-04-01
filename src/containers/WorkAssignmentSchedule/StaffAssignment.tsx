import {
  CircularProgress,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableRow,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import scheduleService from "../../api/Services/scheduleService";
import useAuth from "../../hooks/useAuth";
import { StaffSDto, WorkDays } from "../../types/scheduleInterfaces";
import {
  PageContainer,
  ErrorMessage,
  BackButton,
  PageTitle,
  StyledFormControl,
  LoadingContainer,
  StyledTableContainer,
  HeadTableCell,
  StyledTableHead,
  StyledTableRow,
  StyledTableCell,
  StyledCheckbox,
  EmptyMessage,
} from "../../components/manager/styles/StaffAssignmentStyles";
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const StaffAssignment: React.FC = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [selectedDay, setSelectedDay] = useState<WorkDays | string>(
    WorkDays.Monday
  );
  const [staffList, setStaffList] = useState<StaffSDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStaffByDay = useCallback(
    async (day: WorkDays | string) => {
      if (!auth || !scheduleService.isManager(auth.user)) {
        setError("Only managers can access this page");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const staff = await scheduleService.getStaffByDay(day as WorkDays);
        setStaffList(staff);
      } catch (err) {
        setError("Failed to fetch staff for the selected day");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [auth]
  );

  useEffect(() => {
    fetchStaffByDay(selectedDay);
  }, [selectedDay, fetchStaffByDay]);

  const handleDayChange = (event: SelectChangeEvent<WorkDays | string>) => {
    const value = event.target.value;
    setSelectedDay(value === "All" ? "" : (value as WorkDays));
  };

  const handleCheckboxChange = async (staff: StaffSDto, dayValue: WorkDays) => {
    if (!auth || !scheduleService.isManager(auth.user)) {
      setError("Only managers can assign work days");
      return;
    }
    const newDays = staff.daysOfWeek ^ dayValue;
    try {
      await scheduleService.assignStaffWorkDays(staff.userId, newDays);
      await fetchStaffByDay(selectedDay);
    } catch (err) {
      setError("Failed to update work days");
      console.error(err);
    }
  };

  if (!auth || !scheduleService.isManager(auth.user)) {
    return (
      <PageContainer>
        <ErrorMessage variant="body1">
          You do not have permission to access this page.
        </ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <BackButton
        onClick={() => navigate(-1)}
        variant="contained"
        startIcon={<span>←</span>}
      >
        Back
      </BackButton>

      <PageTitle variant="h4">Staff Assignment</PageTitle>

      <StyledFormControl fullWidth>
        <InputLabel>Select Day</InputLabel>
        <Select
          value={selectedDay === "" ? "All" : selectedDay}
          label="Select Day"
          onChange={handleDayChange}
        >
          <MenuItem value="All">All</MenuItem>
          {Object.entries(WorkDays)
            .filter(
              ([key, value]) => isNaN(Number(key)) && value !== WorkDays.None
            )
            .map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {key}
              </MenuItem>
            ))}
        </Select>
      </StyledFormControl>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      ) : (
        <>
          <StyledTableContainer component={Paper}>
            <Table>
              <StyledTableHead>
                <TableRow>
                  <HeadTableCell>Staff Name</HeadTableCell>
                  {days.map((day) => (
                    <HeadTableCell key={day} align="center">
                      {day}
                    </HeadTableCell>
                  ))}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {staffList.map((staff) => (
                  <StyledTableRow key={staff.userId}>
                    <StyledTableCell>{staff.name}</StyledTableCell>
                    {days.map((day) => {
                      const dayValue = WorkDays[day as keyof typeof WorkDays];
                      return (
                        <StyledTableCell key={day} align="center">
                          <StyledCheckbox
                            checked={(staff.daysOfWeek & dayValue) !== 0}
                            onChange={() =>
                              handleCheckboxChange(staff, dayValue)
                            }
                            color="primary"
                          />
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>

          {staffList.length === 0 && !loading && (
            <EmptyMessage>No staff assigned to this day.</EmptyMessage>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default StaffAssignment;
