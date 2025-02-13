import { Box } from "@mui/material";
import OverrideMuiTheme from "../../../theme/override";
import FeedbackManagement from "../../../containers/FeedbackManagement/FeedbackManagement";

export const FeedbackManagementPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <FeedbackManagement />
      </Box>
    </OverrideMuiTheme>
  );
};
