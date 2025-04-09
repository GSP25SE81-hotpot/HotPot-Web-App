/* eslint-disable react-hooks/exhaustive-deps */
// src/components/admin/EquipmentConditionNotification.tsx
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Badge,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
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

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Kết nối với SignalR hub khi component được tạo

  // Xử lý khi nhấp vào biểu tượng thông báo
  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Xử lý đóng menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Xử lý khi nhấp vào mục thông báo
  const handleNotificationItemClick = (notification: ConditionNotification) => {
    // Đánh dấu là đã đọc
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // Điều hướng đến trang chi tiết điều kiện thiết bị
    navigate(`/equipment-condition-log/${notification.id}`);

    // Đóng menu
    handleClose();
  };

  // Đếm thông báo chưa đọc
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Định dạng thời gian
  const formatTime = (date: Date) => {
    return date.toLocaleString();
  };

  // Lấy nhãn loại lịch trình
  const getScheduleTypeLabel = (type: string) => {
    return type === MaintenanceScheduleType.Emergency.toString()
      ? "Khẩn cấp"
      : "Thông thường";
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleNotificationClick}
        aria-label="thông báo"
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: 350,
              maxHeight: 400,
              overflow: "auto",
            },
          },
        }}
      >
        <Box sx={{ p: 2, bgcolor: "background.paper" }}>
          <Typography variant="h6">Thông báo điều kiện thiết bị</Typography>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2">Không có thông báo</Typography>
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
      ></Snackbar>
    </>
  );
};

export default EquipmentConditionNotification;
