import { Box } from "@mui/material";
import ManageVehicle from "../../../containers/ManageVehicle/ManageVehicle";
import ErrorBoundary from "../../../components/ErrorBoundary";

export const ManageVehiclePage = () => {
  return (
    <Box>
      <ErrorBoundary>
        <ManageVehicle />
      </ErrorBoundary>
    </Box>
  );
};
