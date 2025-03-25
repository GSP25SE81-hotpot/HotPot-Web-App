import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SendIcon from "@mui/icons-material/Send";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[6],
  },
  border: `1px solid ${theme.palette.divider}`,
}));

interface Equipment {
  id: number;
  name: string;
  status: string;
  condition: string;
  lastRentalDate?: string;
  nextAvailableDate?: string;
  renter?: string;
}

// Mock hotpot rental data
const equipmentData: Equipment[] = [
  {
    id: 1,
    name: "Large Hotpot Cooker",
    status: "Available",
    condition: "Good",
    lastRentalDate: "2024-01-01",
    nextAvailableDate: "2024-01-10",
    renter: "John Doe",
  },
  {
    id: 2,
    name: "Table Grill Set",
    status: "Rented",
    condition: "Good",
    lastRentalDate: "2024-01-05",
    nextAvailableDate: "2024-01-15",
    renter: "Jane Smith",
  },
  {
    id: 3,
    name: "Soup Base Container",
    status: "Available",
    condition: "Needs Maintenance",
    lastRentalDate: "2024-01-03",
    nextAvailableDate: "2024-01-12",
    renter: "Mike Johnson",
  },
  {
    id: 4,
    name: "Portable Burner",
    status: "Rented",
    condition: "Good",
    lastRentalDate: "2024-01-06",
    nextAvailableDate: "2024-01-18",
    renter: "Sarah Wilson",
  },
];

const EquipmentAvailability: React.FC = () => {
  const theme = useTheme();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null
  );
  const [reportMessage, setReportMessage] = useState("");
  const [equipmentList, setEquipmentList] =
    useState<Equipment[]>(equipmentData);
  const [conditionDialogOpen, setConditionDialogOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState("");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Available":
        return <CheckCircleIcon color="success" />;
      case "Rented":
        return <BuildIcon color="warning" />;
      case "Maintenance":
        return <BuildIcon color="error" />;
      default:
        return <BuildIcon />;
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case "Good":
        return <CheckCircleIcon color="success" />;
      case "Needs Maintenance":
        return <BuildIcon color="warning" />;
      case "Damaged":
        return <BuildIcon color="error" />;
      default:
        return <BuildIcon />;
    }
  };

  // Function to open report dialog
  const openReportDialog = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setReportMessage(
      `${
        equipment.name
      } is currently ${equipment.status.toLowerCase()} and in ${equipment.condition.toLowerCase()} condition.`
    );
    setReportDialogOpen(true);
  };

  // Function to open condition update dialog
  const openConditionDialog = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setSelectedCondition(equipment.condition);
    setConditionDialogOpen(true);
  };

  // Function to update equipment condition
  const updateEquipmentCondition = () => {
    if (selectedEquipment && selectedCondition) {
      setEquipmentList((prev) =>
        prev.map((item) =>
          item.id === selectedEquipment.id
            ? { ...item, condition: selectedCondition }
            : item
        )
      );

      // Show notification
      setNotification({
        open: true,
        message: `${selectedEquipment.name} condition updated to ${selectedCondition}`,
        severity: "success",
      });

      setConditionDialogOpen(false);
    }
  };

  // Function to report equipment status to admin
  const sendReportToAdmin = () => {
    if (selectedEquipment) {
      // Simulate API call to notify admin
      console.log(`[ADMIN NOTIFICATION] Equipment Report: ${reportMessage}`);

      // Show success notification
      setNotification({
        open: true,
        message: "Equipment status report sent to admin successfully",
        severity: "success",
      });

      setReportDialogOpen(false);
    }
  };

  // Function to handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Function to send overall status report to admin
  const sendOverallStatusReport = () => {
    const availableCount = equipmentList.filter(
      (e) => e.status === "Available"
    ).length;
    const maintenanceCount = equipmentList.filter(
      (e) => e.condition === "Needs Maintenance" || e.condition === "Damaged"
    ).length;

    const reportSummary = `
      Equipment Status Report:
      - Total equipment: ${equipmentList.length}
      - Available: ${availableCount}
      - In use: ${equipmentList.length - availableCount}
      - Needs maintenance: ${maintenanceCount}
    `;

    // Simulate API call
    console.log(`[ADMIN NOTIFICATION] Overall Status Report: ${reportSummary}`);

    // Show notification
    setNotification({
      open: true,
      message: "Overall equipment status report sent to admin",
      severity: "info",
    });
  };

  // Monitor equipment status changes
  useEffect(() => {
    const availableCount = equipmentList.filter(
      (e) => e.status === "Available"
    ).length;

    const maintenanceNeeded = equipmentList.filter(
      (e) => e.condition === "Needs Maintenance" || e.condition === "Damaged"
    ).length;

    if (availableCount <= equipmentList.length / 2) {
      console.log("[ADMIN ALERT] Low equipment availability!");
      setNotification({
        open: true,
        message: "Low equipment availability alert! Admin team notified.",
        severity: "warning",
      });
    }

    if (maintenanceNeeded > 0) {
      console.log(`[ADMIN ALERT] ${maintenanceNeeded} items need maintenance!`);
    }
  }, [equipmentList]);

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Stack spacing={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Dịch vụ cho thuê lẩu sẵn có
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1" color="text.secondary">
              {equipmentList.filter((e) => e.status === "Available").length} of{" "}
              {equipmentList.length} mặt hàng có sẵn để cho thuê
            </Typography>
            <Button
              variant="contained"
              startIcon={<NotificationsIcon />}
              onClick={sendOverallStatusReport}
            >
              Báo cáo trạng thái thiết bị
            </Button>
          </Stack>
        </Box>

        <Stack spacing={2}>
          {equipmentList.map((equipment) => (
            <StyledCard
              key={equipment.id}
              onMouseEnter={() => setHoveredId(equipment.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Stack spacing={1}>
                      <Typography variant="h6">{equipment.name}</Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                          icon={getStatusIcon(equipment.status)}
                          label={equipment.status}
                          size="small"
                          variant="outlined"
                          color={
                            equipment.status === "Available"
                              ? "success"
                              : "warning"
                          }
                        />
                        <Chip
                          icon={getConditionIcon(equipment.condition)}
                          label={equipment.condition}
                          size="small"
                          variant="outlined"
                          color={
                            equipment.condition === "Good"
                              ? "success"
                              : "warning"
                          }
                          onClick={() => openConditionDialog(equipment)}
                        />
                        {equipment.status === "Rented" && (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <LocalDiningIcon color="primary" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              Renter: {equipment.renter}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Stack>

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => openReportDialog(equipment)}
                      startIcon={<SendIcon />}
                    >
                      Báo cáo
                    </Button>
                  </Stack>

                  {hoveredId === equipment.id && (
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Tooltip title="Last Rental Date">
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <AccessTimeIcon color="primary" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              Last: {equipment.lastRentalDate}
                            </Typography>
                          </Stack>
                        </Tooltip>
                        <Tooltip title="Next Available Date">
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <BuildIcon color="primary" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              Next: {equipment.nextAvailableDate}
                            </Typography>
                          </Stack>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </StyledCard>
          ))}
        </Stack>
      </Stack>

      {/* Report Dialog */}
      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
      >
        <DialogTitle>Báo cáo về trạng thái thiết bị</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1, minWidth: 400 }}>
            <Typography>
              Gửi báo cáo về {selectedEquipment?.name} tới quản trị viên:
            </Typography>
            <TextField
              label="Chi tiết báo cáo"
              multiline
              rows={4}
              fullWidth
              value={reportMessage}
              onChange={(e) => setReportMessage(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={sendReportToAdmin}
          >
            Gửi báo cáo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Condition Update Dialog */}
      <Dialog
        open={conditionDialogOpen}
        onClose={() => setConditionDialogOpen(false)}
      >
        <DialogTitle>Cập nhật tình trạng thiết bị</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1, minWidth: 300 }}>
            <Typography>
              Cập nhật tình trạng của {selectedEquipment?.name}:
            </Typography>
            <FormControl fullWidth>
              <Select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
              >
                <MenuItem value="Good">Good</MenuItem>
                <MenuItem value="Needs Maintenance">Needs Maintenance</MenuItem>
                <MenuItem value="Damaged">Damaged</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConditionDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={updateEquipmentCondition}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EquipmentAvailability;
