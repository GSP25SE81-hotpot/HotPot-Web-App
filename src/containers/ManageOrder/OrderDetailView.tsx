/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/OrderManagement/OrderDetailView.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { orderManagementService } from "../../api/Services/orderManagementService";
import { OrderDetailDTO, OrderStatus } from "../../types/orderManagement";

// Import sub-components
import OrderHeader from "./OrderDetailView/OrderHeader";
import CustomerInfoCard from "./OrderDetailView/CustomerInfoCard";
import ShippingInfoCard from "./OrderDetailView/ShippingInfoCard";
import OrderItemsCard from "./OrderDetailView/OrderItemsCard";
import StatusUpdateDialog from "./OrderDetailView/StatusUpdateDialog";
import DeliveryStatusDialog from "./OrderDetailView/DeliveryStatusDialog";
import DeliveryTimeDialog from "./OrderDetailView/DeliveryTimeDialog";

// Import styles
import {
  BackButton,
  DetailPageContainer,
  ErrorContainer,
  LoadingContainer,
} from "../../components/manager/styles/OrderDetailStyles";

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
  const [_newStatus, setNewStatus] = useState<OrderStatus>(OrderStatus.Pending);
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

  // Dialog handlers
  const handleOpenStatusDialog = () => setOpenStatusDialog(true);
  const handleCloseStatusDialog = () => setOpenStatusDialog(false);

  const handleOpenDeliveryStatusDialog = () =>
    setOpenDeliveryStatusDialog(true);
  const handleCloseDeliveryStatusDialog = () =>
    setOpenDeliveryStatusDialog(false);

  const handleOpenDeliveryTimeDialog = () => setOpenDeliveryTimeDialog(true);
  const handleCloseDeliveryTimeDialog = () => setOpenDeliveryTimeDialog(false);

  // Update handlers
  const handleUpdateStatus = async (newStatus: OrderStatus) => {
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
        message: `Trạng thái đơn hàng đã được cập nhật thành công`,
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

  const handleUpdateDeliveryStatus = async (
    isDelivered: boolean,
    notes: string
  ) => {
    if (!order?.shippingInfo) return;
    try {
      setUpdating(true);
      const updatedDeliveryStatus =
        await orderManagementService.updateDeliveryStatus(
          order.shippingInfo.shippingOrderId,
          { isDelivered, notes: notes || undefined }
        );

      // Update order with new shipping info
      const updatedShippingInfo = {
        ...order.shippingInfo,
        isDelivered: updatedDeliveryStatus.isDelivered,
        deliveryNotes:
          updatedDeliveryStatus.deliveryNotes ||
          order.shippingInfo.deliveryNotes,
      };

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

  const handleUpdateDeliveryTime = async (newDeliveryTime: Date) => {
    if (!order?.shippingInfo || !newDeliveryTime) return;
    try {
      setUpdating(true);
      const updatedDeliveryTime =
        await orderManagementService.updateDeliveryTime(
          order.shippingInfo.shippingOrderId,
          { deliveryTime: newDeliveryTime.toISOString() }
        );

      // Update order with new delivery time
      const updatedShippingInfo = {
        ...order.shippingInfo,
        deliveryTime: updatedDeliveryTime.deliveryTime,
      };

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

      {/* Order Header */}
      <OrderHeader
        order={order}
        onUpdateStatus={handleOpenStatusDialog}
        onUpdateDeliveryStatus={handleOpenDeliveryStatusDialog}
        onUpdateDeliveryTime={handleOpenDeliveryTimeDialog}
      />

      {/* Customer and Shipping Information */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        <CustomerInfoCard order={order} />
        <ShippingInfoCard
          order={order}
          onUpdateDeliveryStatus={handleOpenDeliveryStatusDialog}
          onUpdateDeliveryTime={handleOpenDeliveryTimeDialog}
        />
      </div>

      {/* Order Items */}
      <OrderItemsCard order={order} />

      {/* Dialogs */}
      <StatusUpdateDialog
        open={openStatusDialog}
        onClose={handleCloseStatusDialog}
        currentStatus={order.status}
        onUpdateStatus={handleUpdateStatus}
        isUpdating={updating}
      />

      <DeliveryStatusDialog
        open={openDeliveryStatusDialog}
        onClose={handleCloseDeliveryStatusDialog}
        shippingInfo={order.shippingInfo}
        vehicleInfo={order.vehicleInfo}
        isDelivered={isDelivered}
        setIsDelivered={setIsDelivered}
        deliveryNotes={deliveryNotes}
        setDeliveryNotes={setDeliveryNotes}
        onUpdateDeliveryStatus={handleUpdateDeliveryStatus}
        isUpdating={updating}
      />

      <DeliveryTimeDialog
        open={openDeliveryTimeDialog}
        onClose={handleCloseDeliveryTimeDialog}
        vehicleInfo={order.vehicleInfo}
        deliveryTime={deliveryTime}
        setDeliveryTime={setDeliveryTime}
        onUpdateDeliveryTime={handleUpdateDeliveryTime}
        isUpdating={updating}
      />

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

export default OrderDetailView;
