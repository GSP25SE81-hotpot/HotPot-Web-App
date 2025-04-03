/* eslint-disable @typescript-eslint/no-unsafe-function-type */
// src/pages/payments/PaymentActions.tsx
import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

interface PaymentActionsProps {
  status: string;
  paymentId: number;
  orderId?: number;
  onConfirmDeposit: (paymentId: number, orderId: number) => void;
  onGenerateReceipt: (paymentId: number) => void;
  onProcessPayment?: () => void;
  stopPropagation?: boolean;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({
  status,
  paymentId,
  orderId = 0,
  onConfirmDeposit,
  onGenerateReceipt,
  onProcessPayment,
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
      {status === "Pending" && (
        <>
          <Tooltip title="Confirm Deposit">
            <IconButton
              color="primary"
              onClick={(e) =>
                handleAction(() => onConfirmDeposit(paymentId, orderId), e)
              }
            >
              <CheckCircleIcon />
            </IconButton>
          </Tooltip>

          {onProcessPayment && (
            <Tooltip title="Process Payment">
              <IconButton
                color="info"
                onClick={(e) => handleAction(onProcessPayment, e)}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}

      {status === "Success" && (
        <Tooltip title="Generate Receipt">
          <IconButton
            color="secondary"
            onClick={(e) => handleAction(() => onGenerateReceipt(paymentId), e)}
          >
            <ReceiptIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default PaymentActions;
