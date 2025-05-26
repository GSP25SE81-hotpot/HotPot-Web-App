/* eslint-disable @typescript-eslint/no-unsafe-function-type */
// src/pages/payments/PaymentActions.tsx
import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  Receipt as ReceiptIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

interface PaymentActionsProps {
  status: string;
  paymentId: number;
  orderId?: number;
  onGenerateReceipt: (paymentId: number) => void;
  onViewOrderPayments?: (orderId: number) => void;
  stopPropagation?: boolean;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({
  status,
  paymentId,
  orderId = 0,
  onGenerateReceipt,
  onViewOrderPayments,
  stopPropagation = true,
}) => {
  const handleAction = (callback: Function, e?: React.MouseEvent) => {
    if (stopPropagation && e) {
      e.stopPropagation();
    }
    callback();
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      {status === "Success" && (
        <Tooltip title="In hóa đơn">
          <IconButton
            color="secondary"
            onClick={(e) => handleAction(() => onGenerateReceipt(paymentId), e)}
          >
            <ReceiptIcon />
          </IconButton>
        </Tooltip>
      )}

      {orderId && onViewOrderPayments && (
        <Tooltip title="View Order Payments">
          <IconButton
            color="primary"
            onClick={(e) => handleAction(() => onViewOrderPayments(orderId), e)}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default PaymentActions;
