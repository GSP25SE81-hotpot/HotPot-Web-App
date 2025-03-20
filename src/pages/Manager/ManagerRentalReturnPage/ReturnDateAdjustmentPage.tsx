import { Box } from "@mui/material";
import { AuthContextProvider } from "../../../context/AuthContext";
import ReturnDateAdjustment from "../../../containers/ManageRentalReturn/feature/ReturnDateAdjustment";

export const ReturnDateAdjustmentPage = () => {
  return (
    <AuthContextProvider>
      <Box>
        <ReturnDateAdjustment />
      </Box>
    </AuthContextProvider>
  );
};
