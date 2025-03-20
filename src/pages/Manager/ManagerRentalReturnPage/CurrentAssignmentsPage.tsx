import { Box } from "@mui/material";
import { AuthContextProvider } from "../../../context/AuthContext";
import CurrentAssignments from "../../../containers/ManageRentalReturn/feature/CurrentAssignments";

export const CurrentAssignmentsPage = () => {
  return (
    <AuthContextProvider>
      <Box>
        <CurrentAssignments />
      </Box>
    </AuthContextProvider>
  );
};
