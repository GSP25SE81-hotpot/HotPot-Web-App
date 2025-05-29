/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Receipt as ReceiptIcon } from "@mui/icons-material";
import React from "react";
import {
  ActionIconButton,
  ActionsContainer,
  StyledTooltip,
} from "./PaymentStyle";

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
  // orderId = 0,
  onGenerateReceipt,
  // onViewOrderPayments,
  stopPropagation = true,
}) => {
  const handleAction = (callback: Function, e?: React.MouseEvent) => {
    if (stopPropagation && e) {
      e.stopPropagation();
    }
    callback();
  };

  return (
    <ActionsContainer>
      {status === "Success" && (
        <StyledTooltip title="In hóa đơn" arrow>
          <ActionIconButton
            color="secondary"
            onClick={(e) => handleAction(() => onGenerateReceipt(paymentId), e)}
          >
            <ReceiptIcon />
          </ActionIconButton>
        </StyledTooltip>
      )}
      {/* {orderId && onViewOrderPayments && (
        <StyledTooltip title="View Order Payments" arrow>
          <ActionIconButton
            color="primary"
            onClick={(e) => handleAction(() => onViewOrderPayments(orderId), e)}
          >
            <VisibilityIcon />
          </ActionIconButton>
        </StyledTooltip>
      )} */}
    </ActionsContainer>
  );
};

export default PaymentActions;
