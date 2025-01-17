import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

// Define customColors palette
const customColors = {
  ivory: "#FFFFF0",
  maroon: "#800000",
  palegoldenrod: "#EEE8AA",
  powderblue: "#B0E0E6",
  black: "#000000",
};


const WorkAssignmentSchedule: React.FC = () => {
  const [schedules, setSchedules] = useState([
    {
      id: 1,
      staffName: "John Doe",
      date: "2025-01-12",
      shift: "Morning",
      task: "Stock Shelves",
      availability: "Available",
    },
    {
      id: 2,
      staffName: "Jane Smith",
      date: "2025-01-12",
      shift: "Evening",
      task: "Cashier",
      availability: "Unavailable",
    },
  ]);

  const handleUpdateAvailability = (id: number, newAvailability: string) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === id
          ? {
              ...schedule,
              availability: newAvailability,
            }
          : schedule
      )
    );
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "Available":
        return "#008000"; // green
      case "Unavailable":
        return customColors.maroon;
      default:
        return "#B8860B"; // darkgoldenrod
    }
  };

  return (
      <Box sx={{ p: 3, bgcolor: customColors.ivory }}>
        <Typography variant="h4" component="h1" mb={3} color="primary">
          Work Assignment Schedule
        </Typography>
        <TableContainer component={Paper} sx={{ bgcolor: customColors.ivory }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: customColors.palegoldenrod }}>
                <TableCell sx={{ fontWeight: 600 }}>Staff Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Shift</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Task</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Availability</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.staffName}</TableCell>
                  <TableCell>{schedule.date}</TableCell>
                  <TableCell>{schedule.shift}</TableCell>
                  <TableCell>{schedule.task}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: getAvailabilityColor(schedule.availability),
                        fontWeight: 500,
                      }}
                    >
                      {schedule.availability}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <FormControl
                      size="small"
                      sx={{
                        width: "140px",
                        "& .MuiOutlinedInput-root": {
                          bgcolor: customColors.ivory,
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: customColors.maroon,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: customColors.black,
                        },
                        "& .MuiSelect-select": {
                          color: customColors.black,
                        },
                      }}
                    >
                      <InputLabel>Availability</InputLabel>
                      <Select
                        value={schedule.availability}
                        label="Availability"
                        onChange={(e) =>
                          handleUpdateAvailability(schedule.id, e.target.value as string)
                        }
                      >
                        <MenuItem value="Available">Available</MenuItem>
                        <MenuItem value="Unavailable">Unavailable</MenuItem>
                        <MenuItem value="Pending">Pending</MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
  );
};

export default WorkAssignmentSchedule;
