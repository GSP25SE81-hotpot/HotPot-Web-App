import { Box } from "@mui/material";
import DepositConfirmation from "../../../containers/DepositConfirmation/DepositConfirmation";
import OverrideMuiTheme from "../../../theme/override";

export const DepositConfirmationPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <DepositConfirmation />
      </Box>
    </OverrideMuiTheme>
  );
};
