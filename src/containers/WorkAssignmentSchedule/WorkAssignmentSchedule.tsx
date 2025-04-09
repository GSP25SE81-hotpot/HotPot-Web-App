/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
  Button, // Thêm import Button
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { shiftTypes, StaffSchedule } from "../../types/scheduleInterfaces";
import useSchedule from "../../hooks/useSchedule";
import { useNavigate } from "react-router-dom";

const WorkAssignmentSchedule: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // Khởi tạo hook useNavigate
  const {
    loading: hookLoading,
    error: hookError,
    isManagerRole,
    fetchMySchedule,
    fetchAllStaffSchedules,
  } = useSchedule();
  const [personalSchedule, setPersonalSchedule] =
    useState<StaffSchedule | null>(null);
  const [allSchedules, setAllSchedules] = useState<StaffSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Hàm xử lý điều hướng
  const goToStaffAssignment = () => {
    navigate("/staff-assignment");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Lấy lịch cá nhân
        const mySchedule = await fetchMySchedule();
        if (mySchedule) {
          setPersonalSchedule(mySchedule);
        }
        // Nếu người dùng là quản lý, lấy lịch của tất cả nhân viên
        if (isManagerRole) {
          const staffSchedules = await fetchAllStaffSchedules();
          if (mySchedule) {
            setAllSchedules([mySchedule, ...staffSchedules]);
          } else {
            setAllSchedules(staffSchedules);
          }
        } else if (mySchedule) {
          // Đối với nhân viên, chỉ hiển thị lịch của họ
          setAllSchedules([mySchedule]);
        }
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu lịch:", err);
        setError("Không thể tải dữ liệu lịch. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isManagerRole]);

  // Cập nhật trạng thái lỗi khi hook error thay đổi
  useEffect(() => {
    if (hookError) {
      setError(hookError);
    }
  }, [hookError]);

  // Cập nhật trạng thái loading khi hook loading thay đổi
  useEffect(() => {
    setLoading(hookLoading);
  }, [hookLoading]);

  const ShiftCell: React.FC<{ shift: string }> = ({ shift }) => {
    // Kiểm tra xem ca làm việc có tồn tại trong shiftTypes không
    if (!shift || !shiftTypes[shift]) {
      console.log("Loại ca không xác định:", shift); // Để gỡ lỗi
      return (
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            backgroundColor: "gray",
            color: "white",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, fontSize: "1rem" }}
          >
            {shift || "Không xác định"}
          </Typography>
        </Box>
      );
    }
    const shiftType = shiftTypes[shift];
    return (
      <Tooltip title={shiftType.description || ""} arrow placement="top">
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            backgroundColor: shiftType.backgroundColor || "#f5f5f5",
            color: shiftType.color || "#000",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: theme.shadows[2],
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, fontSize: "1rem" }}
          >
            {shiftType.label || shift}
          </Typography>
        </Box>
      </Tooltip>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Card
      elevation={2}
      sx={{
        maxWidth: 1400,
        mx: "auto",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            color="primary"
            sx={{ fontSize: "2rem" }}
          >
            Lịch hàng tuần
          </Typography>
          {/* Thay thế Link bằng Button + onClick */}
          {isManagerRole && (
            <Button
              onClick={goToStaffAssignment}
              variant="contained"
              color="primary"
              sx={{
                fontWeight: "bold",
                px: 3,
                py: 1,
                borderRadius: 2,
                boxShadow: theme.shadows[3],
                "&:hover": {
                  boxShadow: theme.shadows[5],
                },
              }}
            >
              Quản lý nhân viên
            </Button>
          )}
        </Box>

        {personalSchedule && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Lịch cá nhân
            </Typography>
            <TableContainer
              component={Paper}
              elevation={1}
              sx={{
                width: "100%",
                minWidth: 1200,
                overflowX: "auto",
                mb: 4,
              }}
            >
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem", p: 2 }}
                    >
                      Tên nhân viên
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem", p: 2 }}
                    >
                      Tuần
                    </TableCell>
                    {days.map((day) => (
                      <TableCell
                        key={day}
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          minWidth: 100,
                          p: 1,
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          {day === "Monday"
                            ? "Thứ 2"
                            : day === "Tuesday"
                            ? "Thứ 3"
                            : day === "Wednesday"
                            ? "Thứ 4"
                            : day === "Thursday"
                            ? "Thứ 5"
                            : day === "Friday"
                            ? "Thứ 6"
                            : day === "Saturday"
                            ? "Thứ 7"
                            : day === "Sunday"
                            ? "CN"
                            : day.substring(0, 3)}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{
                      backgroundColor: theme.palette.primary.light,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.light,
                      },
                    }}
                  >
                    <TableCell sx={{ fontSize: "1rem", p: 2 }}>
                      <Typography fontWeight="bold" color="white">
                        {personalSchedule.employeeName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: "1rem", p: 2, color: "white" }}>
                      {personalSchedule.week}
                    </TableCell>
                    {personalSchedule.schedule.map((shift, index) => (
                      <TableCell key={index} align="center" sx={{ p: 2 }}>
                        <ShiftCell shift={shift} />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {isManagerRole && allSchedules.length > 1 && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Lịch của tất cả nhân viên</Typography>
              {/* Thay thế Link bằng Button + onClick */}
              <Button
                onClick={goToStaffAssignment}
                variant="outlined"
                color="primary"
                size="medium"
                sx={{ ml: 2 }}
              >
                Phân công lịch làm việc
              </Button>
            </Box>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                width: "100%",
                minWidth: 1200,
                overflowX: "auto",
              }}
            >
              <Table size="medium">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem", p: 2 }}
                    >
                      Tên nhân viên
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", fontSize: "1rem", p: 2 }}
                    >
                      Tuần
                    </TableCell>
                    {days.map((day) => (
                      <TableCell
                        key={day}
                        align="center"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "1rem",
                          minWidth: 100,
                          p: 1,
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          {day === "Monday"
                            ? "Thứ 2"
                            : day === "Tuesday"
                            ? "Thứ 3"
                            : day === "Wednesday"
                            ? "Thứ 4"
                            : day === "Thursday"
                            ? "Thứ 5"
                            : day === "Friday"
                            ? "Thứ 6"
                            : day === "Saturday"
                            ? "Thứ 7"
                            : day === "Sunday"
                            ? "CN"
                            : day.substring(0, 3)}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allSchedules
                    .filter(
                      (staff) =>
                        staff.employeeName !== personalSchedule?.employeeName
                    )
                    .map((staff: any) => (
                      <TableRow
                        key={staff.employeeName}
                        sx={{
                          "&:nth-of-type(even)": {
                            backgroundColor: theme.palette.grey[50],
                          },
                          height: 40,
                        }}
                      >
                        <TableCell sx={{ fontSize: "1rem", p: 2 }}>
                          <Typography fontWeight="medium">
                            {staff.employeeName}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontSize: "1rem", p: 2 }}>
                          {staff.week}
                        </TableCell>
                        {staff.schedule.map((shift: any, index: any) => (
                          <TableCell key={index} align="center" sx={{ p: 2 }}>
                            <ShiftCell shift={shift} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {/* Thay thế Link bằng Button + onClick cho nút hành động nổi */}
        {isManagerRole && (
          <Box
            sx={{
              position: "fixed",
              bottom: 30,
              right: 30,
              zIndex: 1000,
            }}
          >
            <Button
              onClick={goToStaffAssignment}
              variant="contained"
              color="secondary"
              sx={{
                borderRadius: "50%",
                width: 64,
                height: 64,
                boxShadow: theme.shadows[8],
                "&:hover": {
                  boxShadow: theme.shadows[12],
                },
              }}
            >
              <Typography variant="body1" fontWeight="bold">
                +
              </Typography>
            </Button>
          </Box>
        )}

        {/* Chú thích cho các loại ca */}
        <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ width: "100%", mb: 1 }}
          >
            Chú thích:
          </Typography>
          {Object.entries(shiftTypes).map(([name, type]) => (
            <Box
              key={name}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 1,
                  backgroundColor: type.backgroundColor,
                  color: type.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                }}
              >
                {type.label}
              </Box>
              {/* Hiển thị mô tả tiếng Việt thay vì tên tiếng Anh */}
              <Typography variant="body2">{type.description}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WorkAssignmentSchedule;
