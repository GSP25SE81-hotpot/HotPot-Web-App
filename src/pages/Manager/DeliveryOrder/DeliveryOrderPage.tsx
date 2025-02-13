import { Box } from "@mui/material";
import DeliveryOrder from "../../../containers/DeliveryOrder/DeliveryOrder";
import OverrideMuiTheme from "../../../theme/override";

export const DeliveryOrderPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <DeliveryOrder />
      </Box>
    </OverrideMuiTheme>
  );
};
