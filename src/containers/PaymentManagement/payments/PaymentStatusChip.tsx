// src/components/payments/PaymentStatusChip.tsx
import React from "react";
import { Chip, ChipProps } from "@mui/material";

interface PaymentStatusChipProps extends Omit<ChipProps, "color"> {
  status: string;
  translatedLabel?: string; // Add this optional prop for the translated status
}

const PaymentStatusChip: React.FC<PaymentStatusChipProps> = ({
  status,
  translatedLabel,
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

  // Use the translatedLabel if provided, otherwise use the original status
  const displayLabel = translatedLabel || status;

  return (
    <Chip
      label={displayLabel}
      color={getStatusColor()}
      size="small"
      {...props}
    />
  );
};

export default PaymentStatusChip;
