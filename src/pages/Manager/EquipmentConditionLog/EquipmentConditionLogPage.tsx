import { Box } from "@mui/material";

import OverrideMuiTheme from "../../../theme/override";
import EquipmentConditionLog from "../../../containers/EquipmentConditionLog/EquipmentConditionLog";

export const EquipmentConditionLogPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <EquipmentConditionLog />
      </Box>
    </OverrideMuiTheme>
  );
};
