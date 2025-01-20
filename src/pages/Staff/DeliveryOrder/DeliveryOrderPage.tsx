import React from "react";
import { Box } from "@mui/material";
import OverrideMuiTheme from "../../../theme/override";
import DeliveryOrder from "../../../containers/DeliveryOrder/DeliveryOrder";

export const DeliveryOrderPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <DeliveryOrder />
      </Box>
    </OverrideMuiTheme>
  );
};
