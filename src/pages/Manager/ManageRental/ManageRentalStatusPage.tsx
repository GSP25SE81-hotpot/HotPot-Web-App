import { Box } from "@mui/material";
import ManageRentalStatus from "../../../containers/ManageRental/ManageRentalStatus";
import OverrideMuiTheme from "../../../theme/override";

export const ManageRentalStatusPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <ManageRentalStatus />
      </Box>
    </OverrideMuiTheme>
  );
};
