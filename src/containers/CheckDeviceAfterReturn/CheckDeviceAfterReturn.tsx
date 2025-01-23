import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

// Custom colors for hotpot rental
const customColors = {
  ivory: "#FFFFF0",
  maroon: "#800000",
  palegoldenrod: "#EEE8AA",
  powderblue: "#B0E0E6",
  black: "#000000",
};

const CheckDeviceAfterReturn: React.FC = () => {
  const [equipment, setEquipment] = useState([
    {
      id: 1,
      name: "Electric Cooker",
      status: "Pending Inspection",
      issues: "",
    },
    { id: 2, name: "Pot Lid", status: "Pending Inspection", issues: "" },
    {
      id: 3,
      name: "Serving Utensils",
      status: "Pending Inspection",
      issues: "",
    },
  ]);

  const handleStatusUpdate = (id: number, newStatus: string) => {
    setEquipment((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleLogIssues = (id: number, issues: string) => {
    setEquipment((prev) =>
      prev.map((item) => (item.id === id ? { ...item, issues } : item))
    );
  };

  return (
    <Box sx={{ p: 3, bgcolor: customColors.ivory }}>
      <Typography variant="h4" component="h1" mb={3} color="primary">
        Kiểm tra thiết bị lẩu sau khi trả lại
      </Typography>
      <TableContainer component={Paper} sx={{ bgcolor: customColors.ivory }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: customColors.palegoldenrod }}>
              <TableCell>Tên thiết bị</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Vấn đề</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Log issues"
                    value={item.issues}
                    onChange={(e) => handleLogIssues(item.id, e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        bgcolor: customColors.ivory,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: customColors.powderblue,
                        color: customColors.maroon,
                      }}
                      onClick={() => handleStatusUpdate(item.id, "Cleaned")}
                    >
                      Đánh dấu đã được làm sạch
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: customColors.palegoldenrod,
                        color: customColors.maroon,
                      }}
                      onClick={() =>
                        handleStatusUpdate(item.id, "Needs Cleaning")
                      }
                    >
                      Đánh dấu cần được vệ sinh
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CheckDeviceAfterReturn;
