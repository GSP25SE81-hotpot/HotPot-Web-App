import CheckDeviceAfterReturn from "../../../containers/CheckDeviceAfterReturn/CheckDeviceAfterReturn";
import { Box } from "@mui/material";
import OverrideMuiTheme from "../../../theme/override";

export const CheckDeviceAfterReturnPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <CheckDeviceAfterReturn />
      </Box>
    </OverrideMuiTheme>
  );
};
