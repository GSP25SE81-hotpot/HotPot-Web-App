/* eslint-disable react-hooks/exhaustive-deps */
// src/components/NotificationCenter.tsx
import React, { useEffect, useState } from "react";
import {
  HubConnectionBuilder,
  LogLevel,
  HubConnection,
} from "@microsoft/signalr";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography,
  Box,
  Snackbar,
  Alert,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import notificationService from "../../../api/Services/notificationService";
import {
  Notification,
  NotificationCenterProps,
} from "../../../types/notificationTypes";
// Import your existing date formatting utilities
import { formatDetailDate } from "../../../utils/formatters"; // Adjust the import path as needed

const NotificationCenter: React.FC<NotificationCenterProps> = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    notification: Notification | null;
  }>({
    open: false,
    notification: null,
  });

  const open = Boolean(anchorEl);

  // Helper function to safely format dates using your existing utility
  const safeFormatDate = (timestamp: string | Date | undefined): string => {
    if (!timestamp) return "Unknown date";

    try {
      // Use your existing formatDetailDate function
      return formatDetailDate(timestamp.toString());
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  useEffect(() => {
    // Load initial notifications
    fetchNotifications();
    fetchUnreadCount();

    // Set up SignalR connection
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://hpty.vinhuser.one/notificationHub")
      // https://hpty.vinhuser.one
      // https://localhost:7163
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      if (connection) {
        connection
          .stop()
          .catch((err) => console.error("Error stopping connection:", err));
      }
    };
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to notification hub");
          // Register connection with the hub
          connection
            .invoke("RegisterConnection")
            .catch((err: Error) =>
              console.error("Error registering connection:", err)
            );

          // Set up notification handler
          connection.on("ReceiveNotification", (notification: Notification) => {
            // Validate notification before processing
            if (
              notification &&
              typeof notification === "object" &&
              notification.id
            ) {
              // Show a toast notification
              showNotificationToast(notification);

              // Update notifications list and count
              setNotifications((prev) => [notification, ...prev]);
              setUnreadCount((prev) => prev + 1);
            } else {
              console.warn(
                "Received invalid notification from SignalR:",
                notification
              );
            }
          });
        })
        .catch((err: Error) => console.error("Error connecting to hub:", err));
    }
  }, [connection]);

  const fetchNotifications = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getNotifications();

      // Ensure that 'response' is an array before setting the state
      if (Array.isArray(response)) {
        // Filter out notifications with invalid data
        const validNotifications = response.filter(
          (notification) =>
            notification &&
            typeof notification === "object" &&
            notification.id !== undefined
        );

        setNotifications(validNotifications);
      } else {
        console.warn("Expected array of notifications but got:", response);
        setNotifications([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Failed to load notifications");
      setNotifications([]);
      setLoading(false);
    }
  };

  const fetchUnreadCount = async (): Promise<void> => {
    try {
      const response = await notificationService.getUnreadCount();
      // Ensure response is a number and not NaN, default to 0 otherwise
      setUnreadCount(
        typeof response === "number" && !isNaN(response) ? response : 0
      );
    } catch (error) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0); // Default to 0 on error
    }
  };

  const markAsRead = async (id: number): Promise<void> => {
    try {
      await notificationService.markAsRead(id);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    try {
      await notificationService.markAllAsRead();
      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const showNotificationToast = (notification: Notification): void => {
    setSnackbar({
      open: true,
      notification,
    });
  };

  const handleNotificationClick = (notification: Notification): void => {
    markAsRead(notification.id);
    notificationService.handleNotificationClick(notification);
    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleSnackbarClose = (): void => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleSnackbarClick = (): void => {
    if (snackbar.notification) {
      markAsRead(snackbar.notification.id);
      notificationService.handleNotificationClick(snackbar.notification);
      handleSnackbarClose();
    }
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="notifications"
        aria-controls={open ? "notification-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="notification-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "notification-button",
          },
          paper: {
            style: {
              maxHeight: 400,
              width: 320,
            },
          },
        }}
      >
        {/* <MenuItem disabled>
          <Typography variant="subtitle1" fontWeight="bold">
            Thông báo
          </Typography>
        </MenuItem>
        <Divider /> */}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <MenuItem disabled>
            <Typography color="error">{error}</Typography>
          </MenuItem>
        ) : notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography>Không có thông báo mới</Typography>
          </MenuItem>
        ) : (
          <>
            {notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  backgroundColor: notification.isRead
                    ? "transparent"
                    : "rgba(25, 118, 210, 0.08)",
                  padding: "10px 15px",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {notification.title}
                  </Typography>
                  <Typography variant="body2">
                    {notification.message}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    {safeFormatDate(notification.timestamp)}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={markAllAsRead}>
              <ListItemText
                primary="Mark all as read"
                slotProps={{
                  primary: {
                    align: "center",
                  },
                }}
              />
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemText
                primary={
                  <a
                    href="/notifications"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    View all notifications
                  </a>
                }
                slotProps={{
                  primary: {
                    align: "center",
                  },
                }}
              />
            </MenuItem>
          </>
        )}
      </Menu>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {snackbar.notification ? (
          <Alert
            onClose={handleSnackbarClose}
            severity="info"
            sx={{ width: "100%", cursor: "pointer" }}
            onClick={handleSnackbarClick}
          >
            <Typography variant="subtitle2">
              {snackbar.notification.title}
            </Typography>
            <Typography variant="body2">
              {snackbar.notification.message}
            </Typography>
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  );
};

export default NotificationCenter;
