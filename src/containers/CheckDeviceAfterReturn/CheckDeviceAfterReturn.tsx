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
  useTheme,
  Chip,
} from "@mui/material";
import React, { useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BuildIcon from "@mui/icons-material/Build";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

const CheckDeviceAfterReturn: React.FC = () => {
  const theme = useTheme();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Cleaned":
        return <CheckCircleIcon color="success" fontSize="small" />;
      case "Needs Cleaning":
        return <BuildIcon color="error" fontSize="small" />;
      default:
        return <LocalDiningIcon color="primary" fontSize="small" />;
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Kiểm tra thiết bị lẩu sau khi trả lại
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.grey[200] }}>
              <TableCell sx={{ fontWeight: 600 }}>Tên thiết bị</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Vấn đề</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {equipment.map((item) => (
              <TableRow
                key={item.id}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {getStatusIcon(item.status)}
                    <Typography>{item.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    variant="outlined"
                    color={
                      item.status === "Cleaned"
                        ? "success"
                        : item.status === "Needs Cleaning"
                        ? "error"
                        : "default"
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Ghi chú vấn đề"
                    value={item.issues}
                    onChange={(e) => handleLogIssues(item.id, e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.palette.background.paper,
                      },
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleStatusUpdate(item.id, "Cleaned")}
                      sx={{
                        textTransform: "none",
                        color: theme.palette.success.contrastText,
                      }}
                    >
                      Đã làm sạch
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<BuildIcon />}
                      onClick={() =>
                        handleStatusUpdate(item.id, "Needs Cleaning")
                      }
                      sx={{
                        textTransform: "none",
                        color: theme.palette.error.contrastText,
                      }}
                    >
                      Cần vệ sinh
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
