import { Box } from "@mui/material";
import { AuthContextProvider } from "../../../context/AuthContext";
import RentalHistory from "../../../containers/ManageRentalReturn/feature/RentalHistory";

export const RentalHistoryPage = () => {
  return (
    <AuthContextProvider>
      <Box>
        <RentalHistory />
      </Box>
    </AuthContextProvider>
  );
};
