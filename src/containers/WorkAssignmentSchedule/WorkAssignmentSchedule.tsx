import {
  Box,
  Card,
  CardContent,
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
// import { useAuth } from "../context/AuthContext"; // Assume you have an auth context

interface ShiftType {
  color: string;
  backgroundColor: string;
  label: string;
  description: string;
}

const shiftTypes: Record<string, ShiftType> = {
  "Day Off": {
    color: "#1a5f7a",
    backgroundColor: "#e3fafc",
    label: "OFF",
    description: "Rest day - Not scheduled for work",
  },
  "Morning Shift": {
    color: "#974c00",
    backgroundColor: "#fff4e6",
    label: "AM",
    description: "Morning Shift - Early hours",
  },
  "Mid-Day Shift": {
    color: "#862e9c",
    backgroundColor: "#f8f0fc",
    label: "MID",
    description: "Mid-Day Shift - Standard hours",
  },
  "Evening Shift": {
    color: "#087f5b",
    backgroundColor: "#e6fcf5",
    label: "PM",
    description: "Evening Shift - Late hours",
  },
  "Overnight Shift": {
    color: "#364fc7",
    backgroundColor: "#edf2ff",
    label: "NOC",
    description: "Overnight Shift - Night hours",
  },
};

interface StaffSchedule {
  employeeName: string;
  week: string;
  schedule: string[];
}

const staffSchedules: StaffSchedule[] = [
  {
    employeeName: "Wyatt Russell",
    week: "09/07/2020",
    schedule: [
      "Day Off",
      "Evening Shift",
      "Morning Shift",
      "Morning Shift",
      "Mid-Day Shift",
      "Day Off",
      "Day Off",
    ],
  },
  {
    employeeName: "Mike Parker",
    week: "09/07/2020",
    schedule: [
      "Morning Shift",
      "Mid-Day Shift",
      "Mid-Day Shift",
      "Day Off",
      "Evening Shift",
      "Day Off",
      "Mid-Day Shift",
    ],
  },
];

const WorkScheduleTable: React.FC<{ schedules?: StaffSchedule[] }> = ({
  schedules = staffSchedules,
}) => {
  const theme = useTheme();
  // const { currentUser } = useAuth(); // Get current logged-in user
  // const [personalSchedule, setPersonalSchedule] =
  //   useState<StaffSchedule | null>(null);
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // For staff personal schedule
  //  useEffect(() => {
  //    if (currentUser) {
  //      const foundSchedule = schedules.find(
  //        (s) => s.employeeName === currentUser.displayName
  //      );
  //      setPersonalSchedule(foundSchedule || null);
  //    }
  //  }, [schedules, currentUser]);

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

  return (
    <Card
      elevation={2}
      sx={{
        maxWidth: 1400, // Wider card
        mx: "auto",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {" "}
        {/* Increased padding */}
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
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", p: 2 }}>
                  {" "}
                  Tên nhân viên
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", p: 2 }}>
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
              {schedules.map((staff) => (
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
      </CardContent>
    </Card>
  );
};

export default WorkScheduleTable;
