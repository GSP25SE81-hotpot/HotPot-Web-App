/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/OrderManagement/OrderDetailView.tsx
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EditIcon from "@mui/icons-material/Edit";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import {
  Alert,
  alpha,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Snackbar,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { orderManagementService } from "../../api/Services/orderManagementService";
import {
  ActionButton,
  ActionButtonsContainer,
  BackButton,
  CustomerName,
  DeliveryChip,
  DetailCard,
  DetailPageContainer,
  EmptyStateContainer,
  EmptyStateText,
  ErrorContainer,
  HeaderContainer,
  HeaderPaper,
  InfoLabel,
  InfoValue,
  LoadingContainer,
  OrderInfoGrid,
  OrderInfoItem,
  OrderItemsContainer,
  OrderTitle,
  OrderTotal,
  OrderTotalContainer,
  SectionTitle,
  SectionValue,
  StatusChip,
  StyledCardContent,
  StyledCardHeader,
} from "../../components/manager/styles/OrderDetailStyles";
import {
  DeliveryStatusUpdateRequest,
  DeliveryTimeUpdateRequest,
  OrderDetailDTO,
  OrderStatus,
  VehicleType,
} from "../../types/orderManagement";
import {
  formatCurrency,
  formatDate,
  formatDetailDate,
} from "../../utils/formatters";

// Helper function to get vehicle icon based on type
const getVehicleIcon = (type?: VehicleType) => {
  if (type === VehicleType.Car) {
    return <DirectionsCarIcon fontSize="small" />;
  } else if (type === VehicleType.Scooter) {
    return <TwoWheelerIcon fontSize="small" />;
  }
  return undefined;
};

// Helper function to get vehicle type name in Vietnamese
const getVehicleTypeName = (type?: VehicleType): string => {
  if (type === VehicleType.Car) {
    return "Ô tô";
  } else if (type === VehicleType.Scooter) {
    return "Xe máy";
  }
  return "Không có";
};

const getItemTypeDisplay = (itemType: string) => {
  switch (itemType) {
    case "Ingredient":
      return { label: "Nguyên liệu", color: "primary" };
    case "Customization":
      return { label: "Tùy chỉnh", color: "secondary" };
    case "Combo":
      return { label: "Combo", color: "success" };
    case "Utensil":
      return { label: "Dụng cụ", color: "info" };
    case "Hotpot":
      return { label: "Lẩu", color: "warning" };
    default:
      return { label: itemType, color: "default" };
  }
};

const OrderDetailView: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [openDeliveryStatusDialog, setOpenDeliveryStatusDialog] =
    useState(false);
  const [openDeliveryTimeDialog, setOpenDeliveryTimeDialog] = useState(false);

  // Form states
  const [newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.Pending);
  const [isDelivered, setIsDelivered] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [deliveryTime, setDeliveryTime] = useState<Date | null>(null);

  // Action states
  const [updating, setUpdating] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        // Get order details
        const orderData = await orderManagementService.getOrderWithDetails(
          orderId
        );
        setOrder(orderData);

        // Initialize form states based on order data
        setNewStatus(orderData.status);
        if (orderData.shippingInfo) {
          setIsDelivered(orderData.shippingInfo.isDelivered);
          setDeliveryNotes(orderData.shippingInfo.deliveryNotes || "");
          setDeliveryTime(
            orderData.shippingInfo.deliveryTime
              ? new Date(orderData.shippingInfo.deliveryTime)
              : null
          );
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(`Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [orderId]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Dialog open handlers
  const handleOpenStatusDialog = () => {
    setOpenStatusDialog(true);
  };

  const handleOpenDeliveryStatusDialog = () => {
    setOpenDeliveryStatusDialog(true);
  };

  const handleOpenDeliveryTimeDialog = () => {
    setOpenDeliveryTimeDialog(true);
  };

  // Dialog close handlers
  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
  };

  const handleCloseDeliveryStatusDialog = () => {
    setOpenDeliveryStatusDialog(false);
  };

  const handleCloseDeliveryTimeDialog = () => {
    setOpenDeliveryTimeDialog(false);
  };

  // Form change handlers
  const handleStatusChange = (event: SelectChangeEvent<number>) => {
    setNewStatus(Number(event.target.value) as OrderStatus);
  };

  // Action handlers
  const handleUpdateStatus = async () => {
    if (!order) return;
    try {
      setUpdating(true);
      const updatedOrder = await orderManagementService.updateOrderStatus(
        order.orderCode,
        newStatus
      );
      setOrder({ ...order, ...updatedOrder });
      setSnackbar({
        open: true,
        message: `Trạng thái đơn hàng đã được cập nhật thành '${getVietnameseOrderStatusLabel(
          newStatus
        )}' thành công`,
        severity: "success",
      });
      handleCloseStatusDialog();
    } catch (err) {
      console.error("Error updating order status:", err);
      setSnackbar({
        open: true,
        message: `Không thể cập nhật trạng thái đơn hàng: ${
          err instanceof Error ? err.message : "Lỗi không xác định"
        }`,
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateDeliveryStatus = async () => {
    if (!order?.shippingInfo) return;
    try {
      setUpdating(true);
      const request: DeliveryStatusUpdateRequest = {
        isDelivered,
        notes: deliveryNotes || undefined,
      };
      const updatedDeliveryStatus =
        await orderManagementService.updateDeliveryStatus(
          order.shippingInfo.shippingOrderId,
          request
        );
      // Merge the updated delivery status with the existing shipping info
      // instead of replacing the entire object
      const updatedShippingInfo = {
        ...order.shippingInfo,
        isDelivered: updatedDeliveryStatus.isDelivered,
        notes:
          updatedDeliveryStatus.deliveryNotes ||
          order.shippingInfo.deliveryNotes,
      };
      // Update the order with the merged shipping info
      setOrder({ ...order, shippingInfo: updatedShippingInfo });
      setSnackbar({
        open: true,
        message: `Trạng thái giao hàng đã được cập nhật thành công`,
        severity: "success",
      });
      handleCloseDeliveryStatusDialog();
    } catch (err) {
      console.error("Error updating delivery status:", err);
      setSnackbar({
        open: true,
        message: `Không thể cập nhật trạng thái giao hàng: ${
          err instanceof Error ? err.message : "Lỗi không xác định"
        }`,
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateDeliveryTime = async () => {
    if (!order?.shippingInfo || !deliveryTime) return;
    try {
      setUpdating(true);
      const request: DeliveryTimeUpdateRequest = {
        deliveryTime: deliveryTime.toISOString(),
      };
      const updatedDeliveryTime =
        await orderManagementService.updateDeliveryTime(
          order.shippingInfo.shippingOrderId,
          request
        );
      // Merge the updated delivery time with the existing shipping info
      // instead of replacing the entire object
      const updatedShippingInfo = {
        ...order.shippingInfo,
        deliveryTime: updatedDeliveryTime.deliveryTime,
      };
      // Update the order with the merged shipping info
      setOrder({ ...order, shippingInfo: updatedShippingInfo });
      setSnackbar({
        open: true,
        message: `Thời gian giao hàng đã được cập nhật thành công`,
        severity: "success",
      });
      handleCloseDeliveryTimeDialog();
    } catch (err) {
      console.error("Error updating delivery time:", err);
      setSnackbar({
        open: true,
        message: `Không thể cập nhật thời gian giao hàng: ${
          err instanceof Error ? err.message : "Lỗi không xác định"
        }`,
        severity: "error",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <BackButton startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
          Quay lại
        </BackButton>
        <Alert severity="error">{error}</Alert>
      </ErrorContainer>
    );
  }

  if (!order) {
    return (
      <ErrorContainer>
        <BackButton startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
          Quay lại
        </BackButton>
        <Alert severity="warning">Không tìm thấy đơn hàng</Alert>
      </ErrorContainer>
    );
  }

  return (
    <DetailPageContainer>
      <BackButton startIcon={<ArrowBackIcon />} onClick={handleGoBack}>
        Quay lại danh sách đơn hàng
      </BackButton>
      <Grid container spacing={3}>
        {/* Order Header */}
        <Grid size={{ xs: 12 }}>
          <HeaderPaper>
            <HeaderContainer>
              <OrderTitle variant="h5">Đơn hàng #{order.orderCode}</OrderTitle>
              <StatusChip
                label={getVietnameseOrderStatusLabel(order.status)}
                status={order.status}
              />
            </HeaderContainer>
            <OrderInfoGrid>
              <OrderInfoItem>
                <InfoLabel>Ngày đặt hàng</InfoLabel>
                <InfoValue>
                  {formatDate(order.createdAt || new Date().toISOString())}
                </InfoValue>
              </OrderInfoItem>
              <OrderInfoItem>
                <InfoLabel>Tổng tiền</InfoLabel>
                <InfoValue>{formatCurrency(order.totalPrice)}</InfoValue>
              </OrderInfoItem>
            </OrderInfoGrid>
            <ActionButtonsContainer>
              <ActionButton
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleOpenStatusDialog}
              >
                Cập nhật trạng thái
              </ActionButton>
              {order.shippingInfo && (
                <>
                  <ActionButton
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenDeliveryStatusDialog}
                  >
                    Cập nhật trạng thái giao hàng
                  </ActionButton>
                  <ActionButton
                    variant="outlined"
                    color="primary"
                    onClick={handleOpenDeliveryTimeDialog}
                  >
                    Đặt thời gian giao hàng
                  </ActionButton>
                </>
              )}
            </ActionButtonsContainer>
          </HeaderPaper>
        </Grid>
        {/* Customer Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <DetailCard>
            <StyledCardHeader title="Thông tin khách hàng" />
            <Divider />
            <StyledCardContent>
              <SectionTitle>Tên khách hàng</SectionTitle>
              <CustomerName>
                {order.userName || "Khách hàng không xác định"}
              </CustomerName>
              <SectionTitle>Số Điện thoại</SectionTitle>
              <SectionValue>0{order.userPhone}</SectionValue>
              <SectionTitle>Địa chỉ giao hàng</SectionTitle>
              <SectionValue>{order.address || "Không có địa chỉ"}</SectionValue>
              {order.notes && (
                <>
                  <SectionTitle>Ghi chú đơn hàng</SectionTitle>
                  <SectionValue>{order.notes}</SectionValue>
                </>
              )}
            </StyledCardContent>
          </DetailCard>
        </Grid>
        {/* Shipping Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <DetailCard>
            <StyledCardHeader title="Thông tin giao hàng" />
            <Divider />
            <StyledCardContent>
              {order.shippingInfo ? (
                <>
                  <SectionTitle>Nhân viên phụ trách</SectionTitle>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {order.shippingInfo.staffName || "Nhân viên không xác định"}
                  </Typography>
                  {/* Vehicle Information - New Section */}
                  {order.vehicleInfo && (
                    <>
                      <SectionTitle>Phương tiện giao hàng</SectionTitle>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                          gap: 1,
                        }}
                      >
                        {getVehicleIcon(order.vehicleInfo.vehicleType)}
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {order.vehicleInfo.vehicleName} -{" "}
                          {order.vehicleInfo.licensePlate}
                        </Typography>
                        <Chip
                          label={getVehicleTypeName(
                            order.vehicleInfo.vehicleType
                          )}
                          size="small"
                          color={
                            order.vehicleInfo.vehicleType === VehicleType.Car
                              ? "primary"
                              : "secondary"
                          }
                          sx={{ ml: 1, fontWeight: 500 }}
                        />
                      </Box>
                    </>
                  )}
                  <SectionTitle>Trạng thái giao hàng</SectionTitle>
                  <DeliveryChip
                    label={
                      order.shippingInfo.isDelivered
                        ? "Đã giao"
                        : "Đang chờ giao"
                    }
                    delivered={order.shippingInfo.isDelivered}
                  />
                  <SectionTitle>Thời gian giao hàng dự kiến</SectionTitle>
                  <SectionValue>
                    {order.shippingInfo.deliveryTime
                      ? formatDetailDate(order.shippingInfo.deliveryTime)
                      : "Chưa lên lịch"}
                  </SectionValue>
                  {order.shippingInfo.deliveryNotes && (
                    <>
                      <SectionTitle>Ghi chú giao hàng</SectionTitle>
                      <SectionValue>
                        {order.shippingInfo.deliveryNotes}
                      </SectionValue>
                    </>
                  )}
                  <ActionButtonsContainer>
                    <ActionButton
                      variant="outlined"
                      size="small"
                      onClick={handleOpenDeliveryStatusDialog}
                    >
                      Cập nhật trạng thái
                    </ActionButton>
                    <ActionButton
                      variant="outlined"
                      size="small"
                      onClick={handleOpenDeliveryTimeDialog}
                    >
                      Đặt thời gian
                    </ActionButton>
                  </ActionButtonsContainer>
                </>
              ) : (
                <EmptyStateContainer>
                  <EmptyStateText>
                    Đơn hàng này chưa được phân công cho nhân viên nào.
                  </EmptyStateText>
                </EmptyStateContainer>
              )}
            </StyledCardContent>
          </DetailCard>
        </Grid>
        {/* Order Items */}
        <Grid size={{ xs: 12 }}>
          <DetailCard>
            <StyledCardHeader title="Chi tiết đơn hàng" />
            <Divider />
            <StyledCardContent>
              <OrderItemsContainer>
                {/* Display order items */}
                {order.orderItems.length > 0 ? (
                  <Box sx={{ mb: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Sản phẩm
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Loại</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            Số lượng
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.orderItems.map((item) => (
                          <TableRow key={item.orderDetailId}>
                            <TableCell>{item.itemName}</TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Chip
                                  label={
                                    getItemTypeDisplay(item.itemType).label
                                  }
                                  color={
                                    getItemTypeDisplay(item.itemType)
                                      .color as any
                                  }
                                  size="small"
                                />
                              </Box>
                            </TableCell>
                            <TableCell>{item.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                ) : (
                  <Typography
                    variant="body1"
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
                    Không có mặt hàng nào trong đơn hàng này.
                  </Typography>
                )}
                {/* Display rental information if available */}
                {order.hasRentItems && order.rentalInfo && (
                  <Box
                    sx={{
                      mt: 3,
                      p: 2,
                      bgcolor: (theme) =>
                        alpha(theme.palette.secondary.light, 0.1),
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Thông tin thuê
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Ngày bắt đầu thuê
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formatDate(order.rentalInfo.rentalStartDate)}
                        </Typography>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Typography variant="body2" color="text.secondary">
                          Ngày dự kiến trả
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {formatDate(order.rentalInfo.expectedReturnDate)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                {/* Order Summary */}
                <OrderTotalContainer>
                  <OrderTotal>
                    Tổng cộng: {formatCurrency(order.totalPrice)}
                  </OrderTotal>
                </OrderTotalContainer>
              </OrderItemsContainer>
            </StyledCardContent>
          </DetailCard>
        </Grid>
      </Grid>
      {/* Update Status Dialog */}
      <Dialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            pb: 1,
          }}
        >
          Cập nhật trạng thái đơn hàng
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
          <Box sx={{ mt: 1, minWidth: 300 }}>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Trạng thái mới</InputLabel>
              <Select
                labelId="status-select-label"
                value={newStatus}
                label="Trạng thái mới"
                onChange={handleStatusChange}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                {Object.values(OrderStatus)
                  .filter(
                    (status) =>
                      typeof status === "number" &&
                      status !== OrderStatus.Cart &&
                      status !== OrderStatus.Processed
                  )
                  .map((status) => (
                    <MenuItem key={status} value={status as number}>
                      {getVietnameseOrderStatusLabel(status as OrderStatus)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseStatusDialog}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 2,
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color="primary"
            disabled={updating || newStatus === order.status}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {updating ? <CircularProgress size={24} /> : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Delivery Status Dialog */}
      <Dialog
        open={openDeliveryStatusDialog}
        onClose={handleCloseDeliveryStatusDialog}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            pb: 1,
          }}
        >
          Cập nhật trạng thái giao hàng
        </DialogTitle>
        <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
          <Box sx={{ mt: 1, minWidth: 300 }}>
            {/* Display vehicle information if available */}
            {order.vehicleInfo && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, color: "text.secondary" }}
                >
                  Thông tin phương tiện
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getVehicleIcon(order.vehicleInfo.vehicleType)}
                  <Typography variant="body2">
                    {order.vehicleInfo.vehicleName} -{" "}
                    {order.vehicleInfo.licensePlate}
                  </Typography>
                </Box>
              </Box>
            )}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="delivery-status-label">
                Trạng thái giao hàng
              </InputLabel>
              <Select
                labelId="delivery-status-label"
                value={isDelivered ? 1 : 0}
                label="Trạng thái giao hàng"
                onChange={(e) => setIsDelivered(e.target.value === 1)}
                sx={{
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.2),
                  },
                }}
              >
                <MenuItem value={0}>Đang chờ</MenuItem>
                <MenuItem value={1}>Đã giao</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Ghi chú giao hàng"
              fullWidth
              multiline
              rows={4}
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: (theme) =>
                      alpha(theme.palette.primary.main, 0.2),
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDeliveryStatusDialog}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 2,
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleUpdateDeliveryStatus}
            variant="contained"
            disabled={
              updating ||
              (order.shippingInfo?.isDelivered === isDelivered &&
                order.shippingInfo?.deliveryNotes === deliveryNotes)
            }
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {updating ? <CircularProgress size={24} /> : "Cập nhật"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Delivery Time Dialog */}
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Dialog
          open={openDeliveryTimeDialog}
          onClose={handleCloseDeliveryTimeDialog}
          slotProps={{
            paper: {
              sx: {
                borderRadius: 3,
                boxShadow: "0 8px 32px 0 rgba(0,0,0,0.1)",
              },
            },
          }}
        >
          <DialogTitle
            sx={{
              fontSize: "1.25rem",
              fontWeight: 600,
              pb: 1,
            }}
          >
            Đặt thời gian giao hàng
          </DialogTitle>
          <DialogContent sx={{ pt: 2, px: 3, pb: 2 }}>
            <Box sx={{ mt: 1, minWidth: 300 }}>
              {/* Display vehicle information if available */}
              {order.vehicleInfo && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, color: "text.secondary" }}
                  >
                    Thông tin phương tiện
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {getVehicleIcon(order.vehicleInfo.vehicleType)}
                    <Typography variant="body2">
                      {order.vehicleInfo.vehicleName} -{" "}
                      {order.vehicleInfo.licensePlate}
                    </Typography>
                  </Box>
                </Box>
              )}
              <DateTimePicker
                label="Thời gian giao hàng"
                value={deliveryTime}
                onChange={(newValue) => setDeliveryTime(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: (theme) =>
                            alpha(theme.palette.primary.main, 0.2),
                        },
                      },
                    },
                  },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCloseDeliveryTimeDialog}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 2,
              }}
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleUpdateDeliveryTime}
              variant="contained"
              disabled={updating || !deliveryTime}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {updating ? <CircularProgress size={24} /> : "Cập nhật"}
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            fontWeight: 500,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DetailPageContainer>
  );
};

// Hàm trợ giúp để dịch trạng thái đơn hàng sang tiếng Việt
const getVietnameseOrderStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.Cart:
      return "Trong giỏ hàng";
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang xử lý";
    case OrderStatus.Processed:
      return "Đã xử lý";
    case OrderStatus.Shipping:
      return "Đang giao";
    case OrderStatus.Delivered:
      return "Đã giao";
    case OrderStatus.Completed:
      return "Hoàn thành";
    case OrderStatus.Cancelled:
      return "Đã hủy";
    case OrderStatus.Returning:
      return "Đang trả hàng";
    default:
      return `Trạng thái ${status}`; // Fallback, ideally all statuses are covered
  }
};

export default OrderDetailView;
