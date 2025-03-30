// src/components/admin/EquipmentConditionNotification.tsx
import React, { useEffect, useState } from "react";
import {
  Alert,
  Snackbar,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import unifiedHubService from "../../api/Services/unifiedHubService";
import { useNavigate } from "react-router-dom";
import { MaintenanceScheduleType } from "../../api/Services/equipmentConditionService";

interface ConditionNotification {
  id: number;
  equipmentType: string;
  equipmentName: string;
  issueName: string;
  description: string;
  scheduleType: string;
  timestamp: Date;
  read: boolean;
}

const EquipmentConditionNotification: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<ConditionNotification[]>(
    []
  );
  const [newNotification, setNewNotification] =
    useState<ConditionNotification | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Connect to SignalR hub when component mounts
  useEffect(() => {
    const connectToHub = async () => {
      try {
        // Get user info from your auth system
        const userId = 1; // Replace with actual user ID from your auth system
        const userType = "admin"; // Replace with actual user type from your auth system

        // Initialize the hub connection
        await unifiedHubService.initializeHubs(userId, userType, [
          "equipmentCondition",
        ]);

        // Set up listener for direct notifications
        unifiedHubService.equipmentCondition.onReceiveDirectNotification(
          (
            conditionLogId,
            equipmentType,
            equipmentName,
            issueName,
            description,
            scheduleType,
            timestamp
          ) => {
            const notification: ConditionNotification = {
              id: conditionLogId,
              equipmentType,
              equipmentName,
              issueName,
              description: description || "",
              scheduleType,
              timestamp: new Date(timestamp),
              read: false,
            };

            // Add to notifications list
            setNotifications((prev) => [notification, ...prev]);

            // Show snackbar with new notification
            setNewNotification(notification);
            setShowSnackbar(true);
          }
        );
      } catch (error) {
        console.error("Error connecting to SignalR hub:", error);
      }
    };

    connectToHub();

    // Disconnect when component unmounts
    return () => {
      unifiedHubService.disconnectAll();
    };
  }, []);

  // Handle notification click
  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle notification item click
  const handleNotificationItemClick = (notification: ConditionNotification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // Navigate to the equipment condition details page
    navigate(`/equipment-condition/${notification.id}`);

    // Close the menu
    handleClose();
  };

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleString();
  };

  // Get schedule type label
  const getScheduleTypeLabel = (type: string) => {
    return type === MaintenanceScheduleType.Emergency.toString()
      ? "Emergency"
      : "Regular";
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleNotificationClick}
        aria-label="notifications"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 400,
            overflow: "auto",
          },
        }}
      >
        <Box sx={{ p: 2, bgcolor: "background.paper" }}>
          <Typography variant="h6">
            Equipment Condition Notifications
          </Typography>
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2">No notifications</Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={`${notification.id}-${notification.timestamp.getTime()}`}
              onClick={() => handleNotificationItemClick(notification)}
              sx={{
                py: 1.5,
                px: 2,
                borderLeft: notification.read ? "none" : "4px solid",
                borderLeftColor: "primary.main",
                bgcolor: notification.read ? "inherit" : "action.hover",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    {notification.issueName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(notification.timestamp)}
                  </Typography>
                </Box>
                <Typography variant="body2" noWrap>
                  {notification.equipmentType}: {notification.equipmentName}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {notification.description.substring(0, 50)}
                    {notification.description.length > 50 ? "..." : ""}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        notification.scheduleType ===
                        MaintenanceScheduleType.Emergency.toString()
                          ? "error.main"
                          : "success.main",
                      fontWeight: "bold",
                    }}
                  >
                    {getScheduleTypeLabel(notification.scheduleType)}
                  </Typography>
                </Box>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setShowSnackbar(false)}
          severity={
            newNotification?.scheduleType ===
            MaintenanceScheduleType.Emergency.toString()
              ? "error"
              : "info"
          }
          sx={{ width: "100%" }}
        >
          <Typography variant="subtitle2">
            New Equipment Issue: {newNotification?.issueName}
          </Typography>
          <Typography variant="body2">
            {newNotification?.equipmentType}: {newNotification?.equipmentName}
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default EquipmentConditionNotification;
