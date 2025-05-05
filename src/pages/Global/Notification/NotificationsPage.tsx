/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/NotificationCenter.tsx
import React, { useState, useMemo } from "react";
import { useNotifications } from "../../../context/NotificationContext";
import {
  Box,
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Tabs,
  Tab,
  Divider,
  Button,
  Chip,
  ListItemSecondaryAction,
  Tooltip,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { NotificationGroup } from "../../../types/notifications";

const NotificationCenter: React.FC = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    getNotificationsByGroup,
  } = useNotifications();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [activeTab, setActiveTab] = useState<NotificationGroup | "all">("all");

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    return getNotificationsByGroup(activeTab as NotificationGroup);
  }, [activeTab, notifications, getNotificationsByGroup]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (
    _: React.SyntheticEvent,
    newValue: NotificationGroup | "all"
  ) => {
    setActiveTab(newValue);
  };

  const handleNotificationClick = (id: number) => {
    markAsRead(id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "default";
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <>
      <IconButton color="inherit" aria-describedby={id} onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          style: { width: "400px", maxHeight: "500px" },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Notifications</Typography>
          <Box>
            <Button size="small" onClick={markAllAsRead}>
              Mark all as read
            </Button>
            <Button size="small" color="error" onClick={clearAllNotifications}>
              Clear all
            </Button>
          </Box>
        </Box>

        <Divider />

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="All" value="all" />
          <Tab label="Equipment" value="equipment" />
          <Tab label="Feedback" value="feedback" />
          <Tab label="Rental" value="rental" />
          <Tab label="Replacement" value="replacement" />
          <Tab label="Schedule" value="schedule" />
          <Tab label="System" value="system" />
        </Tabs>

        <List sx={{ maxHeight: "350px", overflow: "auto" }}>
          {filteredNotifications.length === 0 ? (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          ) : (
            filteredNotifications.map((notification) => (
              <ListItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                sx={{
                  backgroundColor: notification.read
                    ? "transparent"
                    : "rgba(0, 0, 0, 0.04)",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
                  cursor: "pointer",
                }}
                divider
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: notification.read ? "normal" : "bold",
                        }}
                      >
                        {notification.title}
                      </Typography>
                      <Chip
                        label={notification.priority}
                        size="small"
                        color={getPriorityColor(notification.priority) as any}
                        sx={{ height: 20 }}
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span">
                        {notification.message}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        {formatDistanceToNow(new Date(notification.timestamp), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Tooltip title="Mark as read">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notification.id);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationCenter;
