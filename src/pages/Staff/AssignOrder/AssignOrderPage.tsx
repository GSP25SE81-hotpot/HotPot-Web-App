import { Box } from "@mui/material";
import AssignOrder from "../../../containers/AssignOrder/AssignOrder";
import OverrideMuiTheme from "../../../theme/override";

export const AssignOrderPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <AssignOrder />
      </Box>
    </OverrideMuiTheme>
  );
};
