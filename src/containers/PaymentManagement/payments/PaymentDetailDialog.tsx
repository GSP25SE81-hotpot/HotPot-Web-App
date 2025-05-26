import React from "react";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { PaymentListItemDto } from "../../../types/staffPayment";
import PaymentStatusChip from "./PaymentStatusChip";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import {
  StyledDialogTitle,
  InfoSection,
  SectionTitle,
  InfoItem,
  InfoLabel,
  InfoValue,
  ActionButton,
  StyledDivider,
} from "../../../components/staff/styles/paymentDetailDialogStyles";

// Translation functions for payment and order status
const translatePaymentStatus = (status: string): string => {
  switch (status) {
    case "Success":
      return "Thành công";
    case "Pending":
      return "Đang xử lý";
    case "Cancelled":
      return "Đã hủy";
    case "Refunded":
      return "Hoàn tiền";
    default:
      return status;
  }
};
const translatePaymentType = (type: string): string => {
  switch (type) {
    case "Cash":
      return "Tiền mặt";
    case "Online":
      return "Trực tuyến";
    default:
      return type;
  }
};

const translateOrderStatus = (status: string): string => {
  switch (status) {
    case "Cart":
      return "Giỏ hàng";
    case "Pending":
      return "Chờ xác nhận";
    case "Processing":
      return "Đang xử lý";
    case "Processed":
      return "Đã xử lý";
    case "Shipping":
      return "Đang giao hàng";
    case "Delivered":
      return "Đã giao hàng";
    case "Cancelled":
      return "Đã hủy";
    case "Returning":
      return "Đang trả hàng";
    case "Completed":
      return "Hoàn thành";
    default:
      return status;
  }
};

interface PaymentDetailDialogProps {
  open: boolean;
  payment: PaymentListItemDto | null;
  onClose: () => void;
  onGenerateReceipt: (paymentId: number) => void;
  onViewOrderPayments?: (orderId: number) => void;
}

const PaymentDetailDialog: React.FC<PaymentDetailDialogProps> = ({
  open,
  payment,
  onClose,
  onGenerateReceipt,
}) => {
  if (!payment) return null;

  // Get translated status values
  const translatedPaymentStatus = translatePaymentStatus(payment.status);
  const translatedOrderStatus = payment.orderStatus
    ? translateOrderStatus(payment.orderStatus)
    : "N/A";

  payment.paymentType = translatePaymentType(payment.paymentType);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        Chi tiết thanh toán
        <PaymentStatusChip
          status={payment.status}
          translatedLabel={translatedPaymentStatus}
        />
      </StyledDialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <InfoSection size={{ xs: 12, md: 6 }}>
            <SectionTitle variant="subtitle1">
              Thông tin thanh toán
            </SectionTitle>
            <InfoItem>
              <InfoLabel>Mã giao dịch</InfoLabel>
              <InfoValue>{payment.transactionCode}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Loại thanh toán</InfoLabel>
              <InfoValue>
                {
                  (payment.paymentType = translatePaymentType(
                    payment.paymentType
                  ))
                }
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Số tiền</InfoLabel>
              <InfoValue>{formatCurrency(payment.price)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Ngày tạo</InfoLabel>
              <InfoValue>{formatDate(payment.createdAt)}</InfoValue>
            </InfoItem>
            {payment.updatedAt && (
              <InfoItem>
                <InfoLabel>Ngày cập nhật</InfoLabel>
                <InfoValue>{formatDate(payment.updatedAt)}</InfoValue>
              </InfoItem>
            )}
          </InfoSection>
          <InfoSection size={{ xs: 12, md: 6 }}>
            <SectionTitle variant="subtitle1">
              Thông tin khách hàng
            </SectionTitle>
            <InfoItem>
              <InfoLabel>Tên khách hàng</InfoLabel>
              <InfoValue>{payment.customerName}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Số điện thoại khách hàng</InfoLabel>
              <InfoValue>{payment.customerPhone}</InfoValue>
            </InfoItem>
            <StyledDivider />
            <SectionTitle variant="subtitle1">Thông tin đơn hàng</SectionTitle>
            <InfoItem>
              <InfoLabel>Mã đơn hàng</InfoLabel>
              <InfoValue>{payment.orderCode || "N/A"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Trạng thái đơn hàng</InfoLabel>
              <InfoValue>{translatedOrderStatus}</InfoValue>
            </InfoItem>
          </InfoSection>
        </Grid>
      </DialogContent>
      <DialogActions>
        {payment.status === "Success" && (
          <ActionButton
            onClick={() => onGenerateReceipt(payment.paymentId)}
            color="secondary"
            variant="contained"
          >
            Xem biên lai
          </ActionButton>
        )}
        <ActionButton onClick={onClose}>Đóng</ActionButton>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDetailDialog;
