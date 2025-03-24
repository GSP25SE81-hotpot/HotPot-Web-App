import { Box } from "@mui/material";

import OverrideMuiTheme from "../../../theme/override";
import PaymentManagement from "../../../containers/PaymentManagement/PaymentManagement";

export const PaymentManagementPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <PaymentManagement />
      </Box>
    </OverrideMuiTheme>
  );
};
