// src/pages/payments/PaymentDetailDialog.tsx
import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { PaymentListItemDto } from "../../../types/staffPayment";
import PaymentStatusChip from "./PaymentStatusChip";
import { formatCurrency, formatDate } from "../../../utils/formatters";

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
      <DialogTitle>
        Payment Details
        <PaymentStatusChip status={payment.status} sx={{ ml: 2 }} />
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Payment Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Payment ID
              </Typography>
              <Typography variant="body1">{payment.paymentId}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Transaction Code
              </Typography>
              <Typography variant="body1">{payment.transactionCode}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Payment Type
              </Typography>
              <Typography variant="body1">{payment.paymentType}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Amount
              </Typography>
              <Typography variant="body1">
                {formatCurrency(payment.price)}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">
                {formatDate(payment.createdAt)}
              </Typography>
            </Box>
            {payment.updatedAt && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Updated At
                </Typography>
                <Typography variant="body1">
                  {formatDate(payment.updatedAt)}
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle1" gutterBottom>
              Customer Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Customer Name
              </Typography>
              <Typography variant="body1">{payment.customerName}</Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Customer Phone
              </Typography>
              <Typography variant="body1">{payment.customerPhone}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Order Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Order ID
              </Typography>
              <Typography variant="body1">
                {payment.orderId || "N/A"}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Order Status
              </Typography>
              <Typography variant="body1">
                {payment.orderStatus || "N/A"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {payment.status === "Pending" && (
          <>
            <Button
              onClick={onProcessPayment}
              color="primary"
              variant="contained"
            >
              Process Payment
            </Button>
            <Button
              onClick={() =>
                onConfirmDeposit(payment.paymentId, payment.orderId || 0)
              }
              color="secondary"
            >
              Confirm Deposit
            </Button>
          </>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDetailDialog;
