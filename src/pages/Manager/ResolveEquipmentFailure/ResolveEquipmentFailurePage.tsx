import { Box } from "@mui/material";
import OverrideMuiTheme from "../../../theme/override";
import ResolveEquipmentFailure from "../../../containers/ResolveEquipmentFailure/ResolveEquipmentFailure";

export const ResolveEquipmentFailurePage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <ResolveEquipmentFailure />
      </Box>
    </OverrideMuiTheme>
  );
};
