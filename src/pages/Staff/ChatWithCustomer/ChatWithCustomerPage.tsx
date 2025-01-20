import ChatWithCustomer from "../../../containers/ChatWithCustomer/ChatWithCustomer";
import { Box } from "@mui/material";
import OverrideMuiTheme from "../../../theme/override";

export const ChatWithCustomerPage = () => {
  return (
    <OverrideMuiTheme>
      <Box>
        <ChatWithCustomer />
      </Box>
    </OverrideMuiTheme>
  );
};
