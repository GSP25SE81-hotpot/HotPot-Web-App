import { Box } from "@mui/material";

import OverrideMuiTheme from "../../../theme/override";
import EquipmentConditionDetails from "../../../containers/EquipmentConditionLog/EquipmentConditionDetail";

export const EquipmentConditionDetailPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <EquipmentConditionDetails />
      </Box>
    </OverrideMuiTheme>
  );
};