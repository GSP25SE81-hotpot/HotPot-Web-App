// src/components/EquipmentAvailability.tsx
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SendIcon from "@mui/icons-material/Send";
import WarningIcon from "@mui/icons-material/Warning";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import stockService from "../../api/Services/stockService";
import { useEquipmentNotifications } from "../../hooks/useStockNotification";
import {
  HotpotStatus,
  NotifyAdminStockRequest,
  HotPotInventoryDto,
  UtensilDto,
  EquipmentStatusDto,
} from "../../types/stock";

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

// Combined equipment interface for both hotpots and utensils
interface Equipment {
  id: number;
  name: string;
  status: string | boolean;
  condition?: string;
  type: "HotPot" | "Utensil";
  quantity?: number;
}

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
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [conditionDialogOpen, setConditionDialogOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState("");
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use our custom hook for equipment notifications
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
  } = useEquipmentNotifications();

  // Fetch equipment data
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Starting to fetch equipment data...");

        // Fetch hotpots and utensils
        const [hotpotsResponse, utensilsResponse] = await Promise.all([
          stockService.getAllHotPotInventory(),
          stockService.getAllUtensils(),
        ]);

        console.log("Hotpot response:", hotpotsResponse);
        console.log("Utensil response:", utensilsResponse);

        // Check if we have successful responses with data
        const hasHotpotData =
          hotpotsResponse &&
          hotpotsResponse.success &&
          Array.isArray(hotpotsResponse.data) &&
          hotpotsResponse.data.length > 0;
        const hasUtensilData =
          utensilsResponse &&
          utensilsResponse.success &&
          Array.isArray(utensilsResponse.data) &&
          utensilsResponse.data.length > 0;

        if (!hasHotpotData && !hasUtensilData) {
          console.error("No equipment data available from either source");
          setError("No equipment data available");
          return;
        }

        // Convert hotpots to our Equipment interface
        const hotpots: Equipment[] = hasHotpotData
          ? hotpotsResponse.data.map((hotpot: HotPotInventoryDto) => ({
              id: hotpot.hotPotInventoryId,
              name: hotpot.hotpotName || `HotPot #${hotpot.seriesNumber}`,
              status: hotpot.status,
              type: "HotPot" as const,
              condition:
                hotpot.status === "Available" ? "Good" : "Needs Maintenance",
            }))
          : [];

        console.log("Processed hotpots:", hotpots);

        // Convert utensils to our Equipment interface
        const utensils: Equipment[] = hasUtensilData
          ? utensilsResponse.data.map((utensil: UtensilDto) => ({
              id: utensil.utensilId,
              name: utensil.name,
              status: utensil.status,
              type: "Utensil" as const,
              quantity: utensil.quantity,
              condition: utensil.status ? "Good" : "Needs Maintenance",
            }))
          : [];

        console.log("Processed utensils:", utensils);

        // Combine both types of equipment
        const combinedEquipment = [...hotpots, ...utensils];
        console.log("Combined equipment list:", combinedEquipment);

        setEquipmentList(combinedEquipment);
      } catch (error) {
        console.error("Error fetching equipment:", error);
        setError("An error occurred while fetching equipment data");
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const getStatusIcon = (status: string | boolean) => {
    const statusStr =
      typeof status === "boolean"
        ? status
          ? "Available"
          : "Unavailable"
        : status;

    switch (statusStr) {
      case "Available":
        return <CheckCircleIcon color="success" />;
      case "Rented":
        return <BuildIcon color="warning" />;
      case "Damaged":
        return <BuildIcon color="error" />;
      case "Unavailable":
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
    const statusText =
      typeof equipment.status === "boolean"
        ? equipment.status
          ? "available"
          : "unavailable"
        : equipment.status.toLowerCase();

    setReportMessage(
      `${equipment.name} is currently ${statusText}${
        equipment.condition
          ? ` and in ${equipment.condition.toLowerCase()} condition`
          : ""
      }.`
    );
    setReportDialogOpen(true);
  };

  // Function to open condition update dialog
  const openConditionDialog = (equipment: Equipment) => {
    setSelectedEquipment(equipment);
    setSelectedCondition(equipment.condition || "Good");
    setConditionDialogOpen(true);
  };

  // Function to update equipment condition
  const updateEquipmentCondition = async () => {
    if (selectedEquipment && selectedCondition) {
      try {
        setLoading(true);

        if (selectedEquipment.type === "HotPot") {
          // Update hotpot status
          const newStatus =
            selectedCondition === "Good"
              ? HotpotStatus.Available
              : HotpotStatus.Damaged;
          await stockService.updateHotPotInventoryStatus(
            selectedEquipment.id,
            newStatus,
            `Condition changed to ${selectedCondition}`
          );
        } else {
          // Update utensil status
          await stockService.updateUtensilStatus(
            selectedEquipment.id,
            selectedCondition === "Good",
            `Condition changed to ${selectedCondition}`
          );
        }

        // Update local state
        setEquipmentList((prev) =>
          prev.map((item) =>
            item.id === selectedEquipment.id &&
            item.type === selectedEquipment.type
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
      } catch (error) {
        console.error("Error updating equipment condition:", error);
        setNotification({
          open: true,
          message: "Failed to update equipment condition",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to report equipment status to admin
  const sendReportToAdmin = async () => {
    if (selectedEquipment) {
      try {
        setLoading(true);

        // Send notification via API
        const request: NotifyAdminStockRequest = {
          notificationType: "StatusChange",
          equipmentType: selectedEquipment.type,
          equipmentId: selectedEquipment.id,
          equipmentName: selectedEquipment.name,
          isAvailable:
            typeof selectedEquipment.status === "boolean"
              ? selectedEquipment.status
              : selectedEquipment.status === "Available",
          reason: reportMessage,
        };

        await stockService.notifyAdminDirectly(request);

        // Show success notification
        setNotification({
          open: true,
          message: "Equipment status report sent to admin successfully",
          severity: "success",
        });

        // Add to local notifications
        addNotification({
          type: "StatusChange",
          equipmentType: selectedEquipment.type,
          equipmentName: selectedEquipment.name,
          message: `Report sent: ${reportMessage}`,
          timestamp: new Date(),
        });

        setReportDialogOpen(false);
      } catch (error) {
        console.error("Error sending report:", error);
        setNotification({
          open: true,
          message: "Failed to send report to admin",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Function to send overall status report to admin
  const sendOverallStatusReport = async () => {
    try {
      setLoading(true);

      // Get equipment status summary
      const summaryResponse = await stockService.getEquipmentStatusSummary();

      if (
        summaryResponse &&
        Array.isArray(summaryResponse) &&
        summaryResponse.length > 0
      ) {
        const summary = summaryResponse;

        // Create a report message
        const availableHotpots =
          summary.find((s: EquipmentStatusDto) => s.equipmentType === "HotPot")
            ?.availableCount || 0;
        const totalHotpots =
          summary.find((s: EquipmentStatusDto) => s.equipmentType === "HotPot")
            ?.totalCount || 0;
        const availableUtensils =
          summary.find((s: EquipmentStatusDto) => s.equipmentType === "Utensil")
            ?.availableCount || 0;
        const totalUtensils =
          summary.find((s: EquipmentStatusDto) => s.equipmentType === "Utensil")
            ?.totalCount || 0;
        const lowStockCount =
          summary.find((s: EquipmentStatusDto) => s.equipmentType === "Utensil")
            ?.lowStockCount || 0;

        const reportMessage = `Equipment Status Report:
- Hotpots: ${availableHotpots}/${totalHotpots} available
- Utensils: ${availableUtensils}/${totalUtensils} available
- Low stock items: ${lowStockCount}`;

        // Send notification to admin
        const request: NotifyAdminStockRequest = {
          notificationType: "StatusChange",
          equipmentType: "Summary",
          equipmentId: 0,
          equipmentName: "Equipment Status Summary",
          reason: reportMessage,
        };

        await stockService.notifyAdminDirectly(request);

        // Show notification
        setNotification({
          open: true,
          message: "Overall equipment status report sent to admin",
          severity: "info",
        });
      } else {
        throw new Error("Failed to get equipment status summary");
      }
    } catch (error) {
      console.error("Error sending overall status report:", error);
      setNotification({
        open: true,
        message: "Failed to send overall status report",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle notifications drawer
  const toggleNotificationsDrawer = () => {
    setNotificationsDrawerOpen(!notificationsDrawerOpen);
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <ToastContainer position="top-right" autoClose={5000} />

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
              {
                equipmentList.filter(
                  (e) =>
                    (typeof e.status === "boolean" && e.status) ||
                    (typeof e.status === "string" && e.status === "Available")
                ).length
              }{" "}
              of {equipmentList.length} mặt hàng có sẵn để cho thuê
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<NotificationsIcon />}
                onClick={sendOverallStatusReport}
                disabled={loading}
              >
                Báo cáo trạng thái thiết bị
              </Button>
              <IconButton
                color="primary"
                onClick={toggleNotificationsDrawer}
                sx={{ bgcolor: theme.palette.action.hover }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Stack spacing={2}>
            {equipmentList.map((equipment) => (
              <StyledCard
                key={`${equipment.type}-${equipment.id}`}
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
                            label={
                              typeof equipment.status === "boolean"
                                ? equipment.status
                                  ? "Available"
                                  : "Unavailable"
                                : equipment.status
                            }
                            size="small"
                            variant="outlined"
                            color={
                              (typeof equipment.status === "boolean" &&
                                equipment.status) ||
                              (typeof equipment.status === "string" &&
                                equipment.status === "Available")
                                ? "success"
                                : "warning"
                            }
                          />
                          {equipment.condition && (
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
                          )}
                          {equipment.type === "Utensil" &&
                            equipment.quantity !== undefined && (
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <LocalDiningIcon
                                  color="primary"
                                  fontSize="small"
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Quantity: {equipment.quantity}
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
                    {hoveredId === equipment.id &&
                      equipment.type === "HotPot" && (
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Tooltip title="Equipment Type">
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <AccessTimeIcon
                                  color="primary"
                                  fontSize="small"
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Type: Hotpot
                                </Typography>
                              </Stack>
                            </Tooltip>
                          </Stack>
                        </Stack>
                      )}
                    {hoveredId === equipment.id &&
                      equipment.type === "Utensil" && (
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Tooltip title="Equipment Type">
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <AccessTimeIcon
                                  color="primary"
                                  fontSize="small"
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Type: Utensil
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
        )}
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
            disabled={loading}
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
            disabled={loading}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications Drawer */}
      <Drawer
        anchor="right"
        open={notificationsDrawerOpen}
        onClose={() => setNotificationsDrawerOpen(false)}
      >
        <Box sx={{ width: 320, p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6">Notifications</Typography>
            <Stack direction="row" spacing={1}>
              <IconButton
                size="small"
                onClick={markAllAsRead}
                disabled={notifications.length === 0}
              >
                <MarkEmailReadIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={clearNotifications}
                disabled={notifications.length === 0}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {notifications.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <InfoIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
              <Typography color="text.secondary">No notifications</Typography>
            </Box>
          ) : (
            <List sx={{ width: "100%" }}>
              {notifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => markAsRead(notification.id)}
                    >
                      {notification.isRead ? (
                        <MarkEmailReadIcon color="disabled" />
                      ) : (
                        <MarkEmailReadIcon color="primary" />
                      )}
                    </IconButton>
                  }
                  sx={{
                    bgcolor: notification.isRead
                      ? "transparent"
                      : theme.palette.action.hover,
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    {notification.type === "LowStock" ? (
                      <WarningIcon color="warning" />
                    ) : (
                      <InfoIcon color="info" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.equipmentName}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          {new Date(notification.timestamp).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Drawer>

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
