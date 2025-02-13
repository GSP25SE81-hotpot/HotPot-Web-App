import { Box } from "@mui/material";
import EquipmentAvailability from "../../../containers/ManageRentals/EquipmentAvailability";
import OverrideMuiTheme from "../../../theme/override";


export const EquipmentAvailabilityPage = () => {
  return (
    <OverrideMuiTheme>
    <Box>
        <EquipmentAvailability/>
    </Box>
    </OverrideMuiTheme>
  )
}
