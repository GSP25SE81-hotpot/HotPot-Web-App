// src/pages/payments/PaymentReceiptDialog.tsx
import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Receipt as ReceiptIcon } from "@mui/icons-material";
import { PaymentReceiptDto } from "../../../types/staffPayment";
import { formatCurrency, formatDate } from "../../../utils/formatters";

interface PaymentReceiptDialogProps {
  open: boolean;
  receipt: PaymentReceiptDto | null;
  onClose: () => void;
  onPrint: () => void;
}

const PaymentReceiptDialog: React.FC<PaymentReceiptDialogProps> = ({
  open,
  receipt,
  onClose,
  onPrint,
}) => {
  if (!receipt) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Payment Receipt
        <IconButton
          aria-label="print"
          onClick={onPrint}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <ReceiptIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Payment Receipt
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Receipt #{receipt.receiptId}
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            gutterBottom
          >
            {formatDate(receipt.paymentDate)}
          </Typography>
          <Divider sx={{ my: 3 }} />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Transaction Code
              </Typography>
              <Typography variant="body1" gutterBottom>
                {receipt.transactionCode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customer Name
              </Typography>
              <Typography variant="body1" gutterBottom>
                {receipt.customerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customer Phone
              </Typography>
              <Typography variant="body1" gutterBottom>
                {receipt.customerPhone}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Order ID
              </Typography>
              <Typography variant="body1" gutterBottom>
                {receipt.orderId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Payment Method
              </Typography>
              <Typography variant="body1" gutterBottom>
                {receipt.paymentMethod}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Amount
              </Typography>
              <Typography variant="body1" gutterBottom>
                {formatCurrency(receipt.amount)}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" align="center" color="text.secondary">
            Thank you for your business!
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onPrint}
          startIcon={<ReceiptIcon />}
        >
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentReceiptDialog;
