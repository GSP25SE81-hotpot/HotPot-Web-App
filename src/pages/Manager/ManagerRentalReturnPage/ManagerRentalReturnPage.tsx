import { Box } from "@mui/material";
import ManagerRentalReturn from "../../../containers/ManageRentalReturn/ManagerRentalReturn";
import { AuthContextProvider } from "../../../context/AuthContext";

export const ManagerRentalReturnPage = () => {
  return (
    <AuthContextProvider>
      <Box>
        <ManagerRentalReturn />
      </Box>
    </AuthContextProvider>
  );
};
