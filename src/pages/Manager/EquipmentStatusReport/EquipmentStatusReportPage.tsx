import { Box } from "@mui/material";
import OverrideMuiTheme from "../../../theme/override";
import EquipmentStatusReport from "../../../containers/EquipmentStatusReport/EquipmentStatusReport";

export const EquipmentStatusReportPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <EquipmentStatusReport />
      </Box>
    </OverrideMuiTheme>
  );
};
