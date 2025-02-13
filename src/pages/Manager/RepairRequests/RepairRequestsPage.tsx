import { Box } from "@mui/material";
import RepairRequests from "../../../containers/RepairRequests/RepairRequests";
import OverrideMuiTheme from "../../../theme/override";

export const RepairRequestsPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <RepairRequests />
      </Box>
    </OverrideMuiTheme>
  );
};
