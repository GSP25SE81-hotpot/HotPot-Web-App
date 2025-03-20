import { Box } from "@mui/material";
import { AuthContextProvider } from "../../../context/AuthContext";
import UnassignedPickups from "../../../containers/ManageRentalReturn/feature/UnassignedPickups";

export const UnassignedPickupsPage = () => {
  return (
    <AuthContextProvider>
      <Box>
        <UnassignedPickups />
      </Box>
    </AuthContextProvider>
  );
};
