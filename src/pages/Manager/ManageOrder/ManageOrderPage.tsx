import { Box } from "@mui/material";
import ManageOrder from "../../../containers/ManageOrder/ManageOrder";
// import { AuthContextProvider } from "../../../context/AuthContext";
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
