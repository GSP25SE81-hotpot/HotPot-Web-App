import { Box } from "@mui/material";
import ManageRentals from "../../../containers/ManageRental/ManageRentals";
import OverrideMuiTheme from "../../../theme/override";

export const ManageRentalsPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <ManageRentals />
      </Box>
    </OverrideMuiTheme>
  );
};
