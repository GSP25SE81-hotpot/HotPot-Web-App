/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  CircularProgress,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import notificationService from "../../../api/Services/notificationService"; // Assuming this service is now correctly returning the payload
import {
  Notification,
  NotificationCenterProps,
} from "../../../types/notificationTypes";
import { formatDetailDate } from "../../../utils/formatters";
import useAuth from "../../../hooks/useAuth";
import { useAppNavigate } from "../../../utils/navigationUtils";
import toast, { Toaster } from "react-hot-toast";

const NotificationCenter: React.FC<NotificationCenterProps> = () => {
  const navigate = useAppNavigate(); // Use the context-based navigation
  const { auth } = useAuth();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const open = Boolean(anchorEl);

  const safeFormatDate = (timestamp: string | Date | undefined): string => {
    if (!timestamp) return "Unknown date";
    try {
      return formatDetailDate(timestamp.toString());
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const normalizeCasing = (notification: any): Notification => {
    if (!notification) return notification;
    const normalized: any = {};
    Object.keys(notification).forEach((key) => {
      const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
      normalized[camelKey] = notification[key];
    });
    if (normalized.data) {
      const normalizedData: Record<string, any> = {};
      Object.keys(normalized.data).forEach((key) => {
        const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
        normalizedData[camelKey] = normalized.data[key];
      });
      normalized.data = normalizedData;
    }
    return normalized as Notification;
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    if (!auth.accessToken) {
      // console.warn("No access token available for SignalR connection");
      setError("Authentication required for notifications");
      return;
    }

    try {
      const tokenParts = auth.accessToken.split(".");
      if (tokenParts.length !== 3) {
        console.error("Invalid JWT token format");
        return;
      }
      const payload = tokenParts[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const tokenData = JSON.parse(jsonPayload);
      // console.log("Token claims:", tokenData);
      if (!tokenData.id) {
        setError(
          "Your authentication token is missing required claims for notifications"
        );
      } else {
        // console.log("ID claim type:", typeof tokenData.id);
        // console.log("ID claim value:", tokenData.id);
        if (typeof tokenData.id === "string" && /^\d+$/.test(tokenData.id)) {
          // console.log("ID is a numeric string, should be parseable as int");
        } else {
          // console.warn("ID might not be parseable as int in C#");
          setError(
            "Your user ID format is not compatible with the notification system"
          );
        }
      }
    } catch (e) {
      console.error("Error parsing token:", e);
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl("https://hpty.nexminial.cloud/notificationHub", {
        accessTokenFactory: () => {
          if (!auth.accessToken) {
            throw new Error("No access token available");
          }
          return auth.accessToken;
        },
      })
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
  }, [auth.accessToken]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          // console.log("Connected to notification hub");
          connection.invoke("RegisterConnection").catch((err: Error) => {
            console.error("Error registering connection:", err);
            setError("Failed to register for notifications");
          });
          connection.on("ReceiveNotification", (rawNotification: any) => {
            // console.log("Raw notification from server:", rawNotification);
            const notification = normalizeCasing(rawNotification);
            if (notification.type === "ConnectionRegistered") {
              // console.log(
              //   "SignalR connection registered successfully:",
              //   notification.message
              // );
              setError(null);
              return;
            }
            if (notification.type === "Error") {
              console.error("SignalR error:", notification.message);
              setError(notification.message);
              return;
            }
            if (
              notification &&
              typeof notification === "object" &&
              notification.id &&
              notification.id > 0
            ) {
              showNotificationToast(notification);
              setNotifications((prev) => [notification, ...prev]);
              setUnreadCount((prev) => prev + 1);
            } else {
              // console.warn(
              //   "Received notification with invalid or missing ID:",
              //   notification
              // );
            }
          });
        })
        .catch((err: Error) => {
          console.error("Error connecting to hub:", err);
          setError(
            "Failed to connect to notification service. Please try refreshing the page."
          );
        });
    }
  }, [connection]); // `normalizeCasing` and `showNotificationToast` are stable if defined outside or memoized

  const fetchNotifications = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const paginatedResponse = await notificationService.getNotifications({
        includeRead: false,
        page: 1,
        pageSize: 20,
      });

      // console.log("Paginated response from service:", paginatedResponse);

      if (paginatedResponse && Array.isArray(paginatedResponse.notifications)) {
        const itemsToProcess = paginatedResponse.notifications; // <--- CORRECTED TO LOWERCASE 'notifications'
        const finalNotifications = itemsToProcess.map((notificationItem: any) =>
          normalizeCasing(notificationItem)
        );

        // console.log("Setting notifications:", finalNotifications);
        setNotifications(finalNotifications);
      } else {
        // console.warn(
        //   "Expected 'notifications' array (lowercase) in paginatedResponse, or paginatedResponse was null/undefined. Received:",
        //   paginatedResponse
        // );
        setNotifications([]);
      }

      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Không thể tải thông báo. Vui lòng thử lại."); // Updated error message to Vietnamese
      setNotifications([]);
      setLoading(false);
    }
  };

  const fetchUnreadCount = async (): Promise<void> => {
    try {
      const count = await notificationService.getUnreadCount(); // Assuming getUnreadCount is also fixed
      setUnreadCount(typeof count === "number" && !isNaN(count) ? count : 0);
    } catch (error: any) {
      console.error("Error fetching unread count:", error);
      setUnreadCount(0);
    }
  };

  const markAsRead = async (id: number): Promise<void> => {
    try {
      await notificationService.markAsRead(id);
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
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const showNotificationToast = (notification: Notification): void => {
    toast(
      (t: any) => (
        <Box
          onClick={() => {
            handleNotificationClick(notification);
            toast.dismiss(t.id);
          }}
          sx={{ cursor: "pointer", minWidth: 250 }}
        >
          <Typography variant="subtitle2" fontWeight="bold">
            {notification.title}
          </Typography>
          <Typography variant="body2">{notification.message}</Typography>
        </Box>
      ),
      {
        duration: 6000,
        position: "top-right",
      }
    );
  };

  const handleNotificationClick = (notification: Notification): void => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Instead of using the service's handleNotificationClick, implement it here
    switch (notification.type) {
      case "Schedule":
        navigate("/work-assignment");
        break;
      case "Order":
        navigate(`/manage-order`);

        break;
      case "Feedback":
        if (auth?.user?.role === "Admin") {
          navigate("/dashboard/feedback");
        } else {
          navigate("/feedback");
        }
        break;
      case "RentOrder":
        navigate(`/pickup-rental`);

        break;
      case "PrepOrder":
        navigate(`/assign-order`);

        break;
      case "ShipOrder":
        navigate(`/shipping`);

        break;
      case "Ingredient":
        navigate("/dashboard/listIngredients");
        break;
      case "EquipmentCondition":
        navigate("/dashboard/hotpotMaintenance");
        break;
      case "EquipmentStock":
        navigate("/dashboard/hotpot");
        break;
      case "HotPotDamage":
        navigate("/equipment-condition-log");
        break;
      case "ReturnOrder":
        navigate("/unassigned-pickups");
        break;
      default:
        // console.log(
        //   "No specific action for notification type:",
        //   notification.type
        // );
        break;
    }

    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
    // Optionally, you could re-fetch notifications or unread count when menu is opened
    fetchNotifications();
    fetchUnreadCount();
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <>
      <Toaster />
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
              display: "flex",
              flexDirection: "column",
              maxHeight: 400,
              width: 320,
            },
          },
        }}
      >
        {/* Scrollable notifications container */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            maxHeight: "calc(100% - 48px)", // Reserve space for the sticky footer
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <MenuItem disabled>
              <Typography
                color="error"
                sx={{ p: 1, textAlign: "center", whiteSpace: "normal" }}
              >
                {error}
              </Typography>
            </MenuItem>
          ) : notifications.length === 0 ? (
            <MenuItem disabled>
              <Typography sx={{ p: 1, textAlign: "center" }}>
                Không có thông báo mới
              </Typography>
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
                    borderBottom: "1px solid #eee",
                    "&:last-child": {
                      borderBottom: "none",
                    },
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <Typography variant="subtitle2" fontWeight="bold" noWrap>
                      {notification.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: "2.5em",
                      }}
                    >
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
            </>
          )}
        </Box>

        {/* Sticky footer with "Mark all as read" button */}
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            backgroundColor: "background.paper",
            zIndex: 1,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Divider />
          <MenuItem
            onClick={markAllAsRead}
            sx={{
              justifyContent: "center",
              backgroundColor: "background.paper",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            Đánh dấu tất cả đã đọc
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
};

export default NotificationCenter;
