// src/components/payments/PaymentStatusChip.tsx
import React from "react";
import { Chip, ChipProps } from "@mui/material";

interface PaymentStatusChipProps extends Omit<ChipProps, "color"> {
  status: string;
}

const PaymentStatusChip: React.FC<PaymentStatusChipProps> = ({
  status,
  ...props
}) => {
  const getStatusColor = (): ChipProps["color"] => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Success":
        return "success";
      case "Cancelled":
        return "error";
      case "Refunded":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <Chip label={status} color={getStatusColor()} size="small" {...props} />
  );
};

export default PaymentStatusChip;
