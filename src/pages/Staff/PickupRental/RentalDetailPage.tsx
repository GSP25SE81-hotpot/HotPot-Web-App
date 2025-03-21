import { Box } from "@mui/material";
import OverrideMuiTheme from "../../../theme/override";
import RentalDetail from "../../../containers/PickupRental/RentalDetail/RentalDetail";

export const RentalDetailPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <RentalDetail />
      </Box>
    </OverrideMuiTheme>
  );
};
