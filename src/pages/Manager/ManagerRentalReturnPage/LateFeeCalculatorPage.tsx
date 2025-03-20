import { Box } from "@mui/material";
import { AuthContextProvider } from "../../../context/AuthContext";
import LateFeeCalculator from "../../../containers/ManageRentalReturn/feature/LateFeeCalculator";

export const LateFeeCalculatorPage = () => {
  return (
    <AuthContextProvider>
      <Box>
        <LateFeeCalculator />
      </Box>
    </AuthContextProvider>
  );
};
