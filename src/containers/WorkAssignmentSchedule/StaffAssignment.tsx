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
        setError("Chỉ quản lý mới có thể truy cập trang này");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const staff = await scheduleService.getStaffByDay(day as WorkDays);
        setStaffList(staff);
      } catch (err) {
        setError("Không thể lấy danh sách nhân viên cho ngày đã chọn");
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
      setError("Chỉ quản lý mới có thể phân công ngày làm việc");
      return;
    }
    const newDays = staff.daysOfWeek ^ dayValue;
    try {
      await scheduleService.assignStaffWorkDays(staff.userId, newDays);
      await fetchStaffByDay(selectedDay);
    } catch (err) {
      setError("Không thể cập nhật ngày làm việc");
      console.error(err);
    }
  };

  if (!auth || !scheduleService.isManager(auth.user)) {
    return (
      <PageContainer>
        <ErrorMessage variant="body1">
          Bạn không có quyền truy cập trang này.
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
        Quay lại
      </BackButton>
      <PageTitle variant="h4">Phân công nhân viên</PageTitle>
      <StyledFormControl fullWidth>
        <InputLabel>Chọn ngày</InputLabel>
        <Select
          value={selectedDay === "" ? "All" : selectedDay}
          label="Chọn ngày"
          onChange={handleDayChange}
        >
          <MenuItem value="All">Tất cả</MenuItem>
          {Object.entries(WorkDays)
            .filter(
              ([key, value]) => isNaN(Number(key)) && value !== WorkDays.None
            )
            .map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {key === "Monday"
                  ? "Thứ hai"
                  : key === "Tuesday"
                  ? "Thứ ba"
                  : key === "Wednesday"
                  ? "Thứ tư"
                  : key === "Thursday"
                  ? "Thứ năm"
                  : key === "Friday"
                  ? "Thứ sáu"
                  : key === "Saturday"
                  ? "Thứ bảy"
                  : key === "Sunday"
                  ? "Chủ nhật"
                  : key}
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
                  <HeadTableCell>Tên nhân viên</HeadTableCell>
                  {days.map((day) => (
                    <HeadTableCell key={day} align="center">
                      {day === "Monday"
                        ? "Thứ hai"
                        : day === "Tuesday"
                        ? "Thứ ba"
                        : day === "Wednesday"
                        ? "Thứ tư"
                        : day === "Thursday"
                        ? "Thứ năm"
                        : day === "Friday"
                        ? "Thứ sáu"
                        : day === "Saturday"
                        ? "Thứ bảy"
                        : day === "Sunday"
                        ? "Chủ nhật"
                        : day}
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
            <EmptyMessage>
              Không có nhân viên nào được phân công cho ngày này.
            </EmptyMessage>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default StaffAssignment;
