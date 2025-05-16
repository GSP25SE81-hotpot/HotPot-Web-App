import { Box } from "@mui/material";
import OverrideMuiTheme from "../../../theme/override";
import RentalAvailability from "../../../containers/ManageRental/RentalAvailability";

export const RentalAvailabilityPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <RentalAvailability />
      </Box>
    </OverrideMuiTheme>
  );
};
