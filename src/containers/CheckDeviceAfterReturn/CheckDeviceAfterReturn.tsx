import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import {
  Box,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";

// Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.background.paper,
    0.9
  )}, ${alpha(theme.palette.background.default, 0.95)})`,
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.08)}`,
  overflow: "hidden",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  padding: theme.spacing(2),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: "translateY(-2px)",
  },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  transition: "all 0.2s ease-in-out",
  textTransform: "none",
  padding: "8px 16px",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 12,
    backgroundColor: alpha(theme.palette.background.paper, 0.8),
    transition: "all 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.background.paper, 0.95),
    },
    "&.Mui-focused": {
      backgroundColor: theme.palette.background.paper,
      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
  },
}));

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
        p: 4,
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.background.default,
          0.95
        )}, ${alpha(theme.palette.background.paper, 0.95)})`,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          mb: 4,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Kiểm tra thiết bị lẩu sau khi trả lại
      </Typography>

      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.grey[200] }}>
              <StyledTableCell sx={{ fontWeight: 600 }}>
                Tên thiết bị
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 600 }}>
                Trạng thái
              </StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 600 }}>Vấn đề</StyledTableCell>
              <StyledTableCell sx={{ fontWeight: 600 }}>
                Hành động
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {equipment.map((item) => (
              <StyledTableRow key={item.id}>
                <StyledTableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {getStatusIcon(item.status)}
                    <Typography>{item.name}</Typography>
                  </Stack>
                </StyledTableCell>
                <StyledTableCell>
                  <Chip
                    label={item.status}
                    variant="filled"
                    color={
                      item.status === "Cleaned"
                        ? "success"
                        : item.status === "Needs Cleaning"
                        ? "error"
                        : "default"
                    }
                    sx={{
                      borderRadius: "12px",
                      boxShadow: `0 2px 8px ${alpha(
                        theme.palette.common.black,
                        0.1
                      )}`,
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <StyledTextField
                    fullWidth
                    size="small"
                    placeholder="Ghi chú vấn đề"
                    value={item.issues}
                    onChange={(e) => handleLogIssues(item.id, e.target.value)}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <Stack direction="row" spacing={1}>
                    <AnimatedButton
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      onClick={() => handleStatusUpdate(item.id, "Cleaned")}
                    >
                      Đã làm sạch
                    </AnimatedButton>
                    <AnimatedButton
                      variant="contained"
                      color="error"
                      startIcon={<BuildIcon />}
                      onClick={() =>
                        handleStatusUpdate(item.id, "Needs Cleaning")
                      }
                    >
                      Cần vệ sinh
                    </AnimatedButton>
                  </Stack>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Box>
  );
};

export default CheckDeviceAfterReturn;
