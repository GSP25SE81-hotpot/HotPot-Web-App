import { Box } from "@mui/material";
import OverrideMuiTheme from "../../../theme/override";
import { PickupRental } from "../../../containers/PickupRental/PickupRental";

export const PickupRentalPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <PickupRental />
      </Box>
    </OverrideMuiTheme>
  );
};
