import React from "react";
import { ChipProps } from "@mui/material";
import { StyledStatusChip } from "./PaymentStyle";

interface PaymentStatusChipProps extends Omit<ChipProps, "color"> {
  status: string;
  translatedLabel?: string;
}

const PaymentStatusChip: React.FC<PaymentStatusChipProps> = ({
  status,
  translatedLabel,
  ...props
}) => {
  const displayLabel = translatedLabel || status;

  return (
    <StyledStatusChip
      label={displayLabel}
      status={status}
      size="small"
      {...props}
    />
  );
};

export default PaymentStatusChip;
