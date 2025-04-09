// src/pages/payments/ProcessPaymentDialog.tsx
import React from "react";
import { CircularProgress, Dialog } from "@mui/material";
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  MoneyOff as RefundIcon,
} from "@mui/icons-material";
import { PaymentListItemDto, PaymentStatus } from "../../../types/staffPayment";
import {
  StyledDialogTitle,
  StyledDialogContent,
  InstructionText,
  ErrorAlert,
  StyledDialogActions,
  ActionButton,
  CloseButton,
} from "../../../components/staff/styles/processPaymentDialogStyles";

interface ProcessPaymentDialogProps {
  open: boolean;
  payment: PaymentListItemDto | null;
  onClose: () => void;
  onProcessPayment: (status: PaymentStatus) => void;
  processingAction: PaymentStatus | null;
  actionLoading: boolean;
  actionError: Error | null;
}

const ProcessPaymentDialog: React.FC<ProcessPaymentDialogProps> = ({
  open,
  payment,
  onClose,
  onProcessPayment,
  processingAction,
  actionLoading,
  actionError,
}) => {
  if (!payment) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <StyledDialogTitle>Xử lý thanh toán</StyledDialogTitle>

      <StyledDialogContent>
        <InstructionText>
          Vui lòng chọn hành động cho thanh toán #{payment.paymentId}:
        </InstructionText>

        {actionError && (
          <ErrorAlert severity="error">{actionError.message}</ErrorAlert>
        )}
      </StyledDialogContent>

      <StyledDialogActions>
        <ActionButton
          onClick={() => onProcessPayment(PaymentStatus.Success)}
          color="success"
          variant="contained"
          disabled={actionLoading || processingAction !== null}
          startIcon={
            processingAction === PaymentStatus.Success ? (
              <CircularProgress size={20} />
            ) : (
              <CheckCircleIcon />
            )
          }
          actionType="approve"
        >
          Phê duyệt
        </ActionButton>

        <ActionButton
          onClick={() => onProcessPayment(PaymentStatus.Cancelled)}
          color="error"
          variant="contained"
          disabled={actionLoading || processingAction !== null}
          startIcon={
            processingAction === PaymentStatus.Cancelled ? (
              <CircularProgress size={20} />
            ) : (
              <CancelIcon />
            )
          }
          actionType="cancel"
        >
          Hủy bỏ
        </ActionButton>

        <ActionButton
          onClick={() => onProcessPayment(PaymentStatus.Refunded)}
          color="warning"
          variant="contained"
          disabled={actionLoading || processingAction !== null}
          startIcon={
            processingAction === PaymentStatus.Refunded ? (
              <CircularProgress size={20} />
            ) : (
              <RefundIcon />
            )
          }
          actionType="refund"
        >
          Hoàn tiền
        </ActionButton>

        <CloseButton
          onClick={onClose}
          disabled={actionLoading || processingAction !== null}
        >
          Đóng
        </CloseButton>
      </StyledDialogActions>
    </Dialog>
  );
};

export default ProcessPaymentDialog;
