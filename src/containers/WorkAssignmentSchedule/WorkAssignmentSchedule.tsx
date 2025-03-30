// src/components/WorkScheduleTable.tsx
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
} from "@mui/material";
import React from "react";
import { shiftTypes } from "../../types/scheduleInterfaces";
import {
  useManagerSchedule,
  useAllStaffSchedules,
} from "../../hooks/useSchedule";

const WorkAssignmentSchedule: React.FC = () => {
  const theme = useTheme();
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Use our custom hooks
  const {
    schedule: personalSchedule,
    loading: loadingPersonal,
    error: personalError,
  } = useManagerSchedule();
  const {
    schedules: allSchedules,
    loading: loadingAll,
    error: allError,
  } = useAllStaffSchedules();

  const loading = loadingPersonal || loadingAll;
  const error = personalError || allError;

  const ShiftCell: React.FC<{ shift: string }> = ({ shift }) => {
    const shiftType = shiftTypes[shift];
    return (
      <Tooltip title={shiftType.description} arrow placement="top">
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            backgroundColor: shiftType.backgroundColor,
            color: shiftType.color,
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
            {shiftType.label}
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

        {allSchedules.length > 1 && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Lịch của tất cả nhân viên
            </Typography>
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
              <Typography variant="body2">{name}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WorkAssignmentSchedule;
