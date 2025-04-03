// src/pages/payments/ProcessPaymentDialog.tsx
import React from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  MoneyOff as RefundIcon,
} from "@mui/icons-material";
import { PaymentListItemDto, PaymentStatus } from "../../../types/staffPayment";

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
      <DialogTitle>Process Payment</DialogTitle>
      <DialogContent>
        <Typography>
          Please select an action for payment #{payment.paymentId}:
        </Typography>
        {actionError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {actionError.message}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button
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
        >
          Approve
        </Button>
        <Button
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
        >
          Cancel
        </Button>
        <Button
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
        >
          Refund
        </Button>
        <Button
          onClick={onClose}
          disabled={actionLoading || processingAction !== null}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProcessPaymentDialog;
