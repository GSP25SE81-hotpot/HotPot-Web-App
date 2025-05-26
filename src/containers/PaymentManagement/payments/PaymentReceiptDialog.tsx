import React from "react";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  Receipt as ReceiptIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { PaymentReceiptDto } from "../../../types/staffPayment";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import {
  ReceiptDialogTitle,
  PrintIconButton,
  ReceiptContainer,
  ReceiptTitle,
  ReceiptSubtitle,
  ReceiptDate,
  ReceiptDivider,
  ReceiptGrid,
  InfoLabel,
  InfoValue,
  PrintButton,
} from "../../../components/staff/styles/paymentReceiptDialogStyles";

interface PaymentReceiptDialogProps {
  open: boolean;
  receipt: PaymentReceiptDto | null;
  onClose: () => void;
  onPrint: () => void;
}

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

const PaymentReceiptDialog: React.FC<PaymentReceiptDialogProps> = ({
  open,
  receipt,
  onClose,
  onPrint,
}) => {
  if (!receipt) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <ReceiptDialogTitle>
        Biên lai thanh toán
        <PrintIconButton aria-label="đóng" onClick={onClose}>
          <CloseIcon />
        </PrintIconButton>
      </ReceiptDialogTitle>
      <DialogContent dividers>
        <ReceiptContainer>
          <ReceiptTitle variant="h5">Biên lai thanh toán</ReceiptTitle>
          <ReceiptSubtitle variant="subtitle1">
            Biên lai #{receipt.receiptId}
          </ReceiptSubtitle>
          <ReceiptDate variant="body2">
            {formatDate(receipt.paymentDate)}
          </ReceiptDate>
          <ReceiptDivider />
          <ReceiptGrid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoLabel variant="body2">Mã giao dịch</InfoLabel>
              <InfoValue variant="body1">{receipt.transactionCode}</InfoValue>
              <InfoLabel variant="body2">Tên khách hàng</InfoLabel>
              <InfoValue variant="body1">{receipt.customerName}</InfoValue>
              <InfoLabel variant="body2">Số điện thoại khách hàng</InfoLabel>
              <InfoValue variant="body1">{receipt.customerPhone}</InfoValue>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <InfoLabel variant="body2">Mã đơn hàng</InfoLabel>
              <InfoValue variant="body1">{receipt.orderCode}</InfoValue>
              <InfoLabel variant="body2">Phương thức thanh toán</InfoLabel>
              <InfoValue variant="body1">
                {translatePaymentType(receipt.paymentMethod)}
              </InfoValue>
              <InfoLabel variant="body2">Số tiền</InfoLabel>
              <InfoValue variant="body1">
                {formatCurrency(receipt.amount)}
              </InfoValue>
            </Grid>
          </ReceiptGrid>
          <ReceiptDivider />
        </ReceiptContainer>
      </DialogContent>
      <DialogActions>
        <PrintButton
          variant="contained"
          onClick={onPrint}
          startIcon={<ReceiptIcon />}
        >
          In biên lai
        </PrintButton>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentReceiptDialog;
