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
  Button, // Add Button import
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { shiftTypes, StaffSchedule } from "../../types/scheduleInterfaces";
import useSchedule from "../../hooks/useSchedule";
import { useNavigate } from "react-router-dom"; // Import useNavigate instead of Link

const WorkAssignmentSchedule: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // Initialize useNavigate hook

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

  // Navigation handler function
  const goToStaffAssignment = () => {
    navigate("/staff-assignment");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch personal schedule
        const mySchedule = await fetchMySchedule();
        if (mySchedule) {
          setPersonalSchedule(mySchedule);
        }
        // If user is a manager, fetch all staff schedules
        if (isManagerRole) {
          const staffSchedules = await fetchAllStaffSchedules();
          if (mySchedule) {
            setAllSchedules([mySchedule, ...staffSchedules]);
          } else {
            setAllSchedules(staffSchedules);
          }
        } else if (mySchedule) {
          // For staff, only show their own schedule
          setAllSchedules([mySchedule]);
        }
      } catch (err) {
        console.error("Error fetching schedule data:", err);
        setError("Failed to load schedule data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isManagerRole]);

  // Update error state when hook error changes
  useEffect(() => {
    if (hookError) {
      setError(hookError);
    }
  }, [hookError]);

  // Update loading state when hook loading changes
  useEffect(() => {
    setLoading(hookLoading);
  }, [hookLoading]);

  const ShiftCell: React.FC<{ shift: string }> = ({ shift }) => {
    // Check if shift exists in shiftTypes
    if (!shift || !shiftTypes[shift]) {
      console.log("Unknown shift type:", shift); // For debugging
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
            {shift || "Unknown"}
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
          {/* Replace Link with Button + onClick */}
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
                          {day.substring(0, 3)}
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
              {/* Replace Link with Button + onClick */}
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
                          {day.substring(0, 3)}
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
                    .map((staff) => (
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
                        {staff.schedule.map((shift, index) => (
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

        {/* Replace Link with Button + onClick for floating action button */}
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

        {/* Legend for shift types */}
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
              {/* Show the Vietnamese description instead of the English name */}
              <Typography variant="body2">{type.description}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WorkAssignmentSchedule;
