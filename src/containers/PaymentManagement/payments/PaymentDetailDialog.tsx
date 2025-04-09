// src/pages/payments/PaymentDetailDialog.tsx
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

interface PaymentDetailDialogProps {
  open: boolean;
  payment: PaymentListItemDto | null;
  onClose: () => void;
  onProcessPayment: () => void;
  onConfirmDeposit: (paymentId: number, orderId: number) => void;
}

const PaymentDetailDialog: React.FC<PaymentDetailDialogProps> = ({
  open,
  payment,
  onClose,
  onProcessPayment,
  onConfirmDeposit,
}) => {
  if (!payment) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        Chi tiết thanh toán
        <PaymentStatusChip status={payment.status} />
      </StyledDialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <InfoSection size={{ xs: 12, md: 6 }}>
            <SectionTitle variant="subtitle1">
              Thông tin thanh toán
            </SectionTitle>

            <InfoItem>
              <InfoLabel>Mã thanh toán</InfoLabel>
              <InfoValue>{payment.paymentId}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Mã giao dịch</InfoLabel>
              <InfoValue>{payment.transactionCode}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Loại thanh toán</InfoLabel>
              <InfoValue>{payment.paymentType}</InfoValue>
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
              <InfoValue>{payment.orderId || "N/A"}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>Trạng thái đơn hàng</InfoLabel>
              <InfoValue>{payment.orderStatus || "N/A"}</InfoValue>
            </InfoItem>
          </InfoSection>
        </Grid>
      </DialogContent>

      <DialogActions>
        {payment.status === "Pending" && (
          <>
            <ActionButton
              onClick={onProcessPayment}
              color="primary"
              variant="contained"
            >
              Xử lý thanh toán
            </ActionButton>

            <ActionButton
              onClick={() =>
                onConfirmDeposit(payment.paymentId, payment.orderId || 0)
              }
              color="secondary"
            >
              Xác nhận đặt cọc
            </ActionButton>
          </>
        )}

        <ActionButton onClick={onClose}>Đóng</ActionButton>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDetailDialog;
