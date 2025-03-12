import { Box } from "@mui/material";
import ManageOrder from "../../../containers/ManageOrder/ManageOrder";
import { AuthContextProvider } from "../../../context/AuthContext";

export const ManageOrderPage = () => {
  return (
    <AuthContextProvider>
      <Box>
        <ManageOrder />
      </Box>
    </AuthContextProvider>
  );
};
