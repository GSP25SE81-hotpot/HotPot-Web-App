import { Box } from "@mui/material";
import OverrideMuiTheme from "../../../theme/override";
import OrderHistory from "../../../containers/OrderHistory/OrderHistory";

export const OrderHistoryPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <OrderHistory />
      </Box>
    </OverrideMuiTheme>
  );
};
