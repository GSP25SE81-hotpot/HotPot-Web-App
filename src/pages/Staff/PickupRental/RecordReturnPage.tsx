import { Box } from "@mui/material";
import OverrideMuiTheme from "../../../theme/override";
import RecordReturn from "../../../containers/PickupRental/RecordReturn/RecordReturn";

export const RecordReturnPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <RecordReturn />
      </Box>
    </OverrideMuiTheme>
  );
};
