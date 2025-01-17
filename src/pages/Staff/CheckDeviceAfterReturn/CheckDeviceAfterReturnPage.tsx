import { Box } from "@mui/material";
import CheckDeviceAfterReturn from "../../../containers/CheckDeviceAfterReturn/CheckDeviceAfterReturn";
import OverrideMuiTheme from "../../../theme/override";

export const CheckDeviceAfterReturnPage = () => {
  return (
    <OverrideMuiTheme>
    <Box>
        <CheckDeviceAfterReturn/>
    </Box>
    </OverrideMuiTheme>
  )
}
