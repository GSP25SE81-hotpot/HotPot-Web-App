import { Box } from "@mui/material";
import ManageOrder from "../../../containers/ManageOrder/ManageOrder";
import ErrorBoundary from "../../../components/ErrorBoundary";

export const ManageOrderPage = () => {
  return (
    <Box>
      <ErrorBoundary>
        <ManageOrder />
      </ErrorBoundary>
    </Box>
  );
};
