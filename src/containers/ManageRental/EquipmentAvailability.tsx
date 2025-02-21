import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useState, useEffect } from "react";

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
    lastRentalDate: "2024-01-01",
    nextAvailableDate: "2024-01-10",
    renter: "John Doe",
  },
  {
    id: 2,
    name: "Table Grill Set",
    status: "Rented",
    lastRentalDate: "2024-01-05",
    nextAvailableDate: "2024-01-15",
    renter: "Jane Smith",
  },
  {
    id: 3,
    name: "Soup Base Container",
    status: "Available",
    lastRentalDate: "2024-01-03",
    nextAvailableDate: "2024-01-12",
    renter: "Mike Johnson",
  },
  {
    id: 4,
    name: "Portable Burner",
    status: "Rented",
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Available":
        return <CheckCircleIcon color="success" />;
      case "Rented":
        return <BuildIcon color="error" />;
      default:
        return <BuildIcon />;
    }
  };

  // Function to report equipment status
  const reportEquipmentStatus = (equipment: Equipment) => {
    const statusMessage = `${
      equipment.name
    } is currently ${equipment.status.toLowerCase()}`;
    const adminMessage = `Admin notified about ${equipment.name} status`;

    const severity = equipment.status === "Available" ? "success" : "warning";

    // Simulate API calls
    console.log(`[LOG] Equipment Status: ${statusMessage}`); // Log to system
    console.log(`[ADMIN NOTIFICATION] ${adminMessage}`); // Notify admin

    setNotification({
      open: true,
      message: `${statusMessage}. Admin notification sent.`,
      severity,
    });
  };

  // Function to handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Monitor equipment status changes
  useEffect(() => {
    const availableCount = equipmentData.filter(
      (e) => e.status === "Available"
    ).length;

    if (availableCount <= equipmentData.length / 2) {
      console.log("[ADMIN ALERT] Low equipment availability!");
      setNotification({
        open: true,
        message: "Low equipment availability alert! Admin team notified.",
        severity: "warning",
      });
    }
  }, []);

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
              {equipmentData.filter((e) => e.status === "Available").length} of{" "}
              {equipmentData.length} mặt hàng có sẵn để cho thuê
            </Typography>
            <Tooltip title="Report Status">
              <IconButton
                color="primary"
                onClick={() => {
                  const availableCount = equipmentData.filter(
                    (e) => e.status === "Available"
                  ).length;
                  reportEquipmentStatus({
                    id: 0,
                    name: "Overall Status",
                    status: availableCount > 0 ? "Available" : "Unavailable",
                  });
                }}
              >
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        <Stack spacing={2}>
          {equipmentData.map((equipment) => (
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
                          onClick={() => reportEquipmentStatus(equipment)}
                        />
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocalDiningIcon color="primary" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            Renter: {equipment.renter}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
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
