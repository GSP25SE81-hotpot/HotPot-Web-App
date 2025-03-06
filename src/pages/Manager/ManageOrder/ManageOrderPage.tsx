import { Box } from "@mui/material";
import ManageOrder from "../../../containers/ManageOrder/ManageOrder";
import OverrideMuiTheme from "../../../theme/override";

export const ManageOrderPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <ManageOrder />
      </Box>
    </OverrideMuiTheme>
  );
};
