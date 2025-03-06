import { Box } from "@mui/material";
import PaymentManagement from "../../../containers/PaymentManagement/PaymentManagement";
import OverrideMuiTheme from "../../../theme/override";

export const PaymentManagementPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <PaymentManagement />
      </Box>
    </OverrideMuiTheme>
  );
};
