import { Box } from "@mui/material";

import OverrideMuiTheme from "../../../theme/override";
import ManageReplacement from "../../../containers/ManageReplacement/ManageReplacement";

export const ManageReplacementPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <ManageReplacement />
      </Box>
    </OverrideMuiTheme>
  );
};
