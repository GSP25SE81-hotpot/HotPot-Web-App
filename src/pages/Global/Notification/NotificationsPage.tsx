// src/pages/NotificationsPage.tsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Paper,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkReadIcon,
} from "@mui/icons-material";
import { useNotifications } from "../../../context/NotificationContext";
import { Notification } from "../../../types/notifications";
import { useNavigate } from "react-router-dom";

const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  } = useNotifications();
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "ConditionAlert":
      case "LowStockAlert":
        return <WarningIcon color="warning" />;
      case "Error":
        return <ErrorIcon color="error" />;
      case "FeedbackResponse":
      case "ScheduleUpdate":
        return <CheckCircleIcon color="success" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getNotificationTitle = (notification: Notification): string => {
    const { type, data } = notification;

    if (data.title) return data.title;

    switch (type) {
      case "ConditionAlert":
        return "Equipment Condition Alert";
      case "LowStockAlert":
        return "Low Stock Alert";
      case "StatusChange":
        return "Equipment Status Change";
      case "FeedbackResponse":
        return "Feedback Response";
      case "NewFeedback":
        return "New Feedback Received";
      case "ApprovedFeedback":
        return "Feedback Approved";
      case "ScheduleUpdate":
        return "Schedule Update";
      case "ResolutionUpdate":
        return "Resolution Update";
      case "EquipmentUpdate":
        return "Equipment Update";
      case "RentalNotification":
        return "Rental Notification";
      case "ReplacementNotification":
        return "Replacement Notification";
      case "DirectNotification":
        return "Direct Notification";
      default:
        return "Notification";
    }
  };

  const getNotificationMessage = (notification: Notification): string => {
    const { type, data } = notification;

    if (data.message) return data.message;

    switch (type) {
      case "ConditionAlert":
        return `Issue reported for ${data.equipmentName}: ${data.issueName}`;
      case "LowStockAlert":
        return `${data.equipmentName} is running low (${data.currentQuantity}/${data.threshold})`;
      case "StatusChange":
        return `${data.equipmentName} is now ${
          data.isAvailable ? "available" : "unavailable"
        }`;
      case "NewFeedback":
        return `New feedback from ${data.customerName}: ${data.feedbackTitle}`;
      case "ApprovedFeedback":
        return `Feedback "${data.feedbackTitle}" approved by ${data.adminName}`;
      case "ScheduleUpdate":
        return `Your schedule has been updated for ${new Date(
          data.shiftDate
        ).toLocaleDateString()}`;
      case "ResolutionUpdate":
        return `Resolution update for issue #${data.conditionLogId}: ${data.status}`;
      case "EquipmentUpdate":
        return `Update for ${data.equipmentName}: ${data.status}`;
      default:
        return JSON.stringify(data);
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    return new Date(timestamp).toLocaleString();
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark notification as read
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Handle navigation based on notification type
    switch (notification.type) {
      case "ConditionAlert":
        navigate(`/equipment/condition/${notification.data.conditionLogId}`);
        break;
      case "FeedbackResponse":
        navigate(`/feedback/${notification.data.feedbackId}`);
        break;
      case "ScheduleUpdate":
        navigate("/schedule");
        break;
      case "RentalNotification":
        navigate("/rentals");
        break;
      case "ReplacementNotification":
        navigate(`/replacements/${notification.data.replacementRequestId}`);
        break;
      // Add more navigation cases as needed
      default:
        // Default action for other notification types
        break;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h1" gutterBottom>
            Notifications
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {unreadCount > 0 && (
              <Button
                variant="outlined"
                startIcon={<MarkReadIcon />}
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={clearAllNotifications}
              >
                Clear all
              </Button>
            )}
          </Box>
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 5 }}>
            <InfoIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No notifications to display
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: "100%" }}>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    py: 2,
                    bgcolor: notification.read ? "transparent" : "action.hover",
                    "&:hover": { bgcolor: "action.selected" },
                    cursor: "pointer",
                    borderRadius: 1,
                  }}
                  secondaryAction={
                    <Box sx={{ display: "flex" }}>
                      {!notification.read && (
                        <Tooltip title="Mark as read">
                          <IconButton
                            edge="end"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <MarkReadIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                  onClick={() => handleNotificationClick(notification)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "background.paper" }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        component="div"
                        sx={{
                          fontWeight: notification.read ? "normal" : "bold",
                        }}
                      >
                        {getNotificationTitle(notification)}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          component="span"
                          sx={{ display: "block", mb: 0.5 }}
                        >
                          {getNotificationMessage(notification)}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="span"
                        >
                          {formatTimestamp(notification.timestamp)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default NotificationsPage;
