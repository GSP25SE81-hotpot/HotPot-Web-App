import { Box } from "@mui/material";
import OverrideMuiTheme from "../../../theme/override";
import DepositConfirmation from "../../../containers/DepositConfirmation/DepositConfirmation";

export const DepositConfirmationPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <DepositConfirmation />
      </Box>
    </OverrideMuiTheme>
  );
};
