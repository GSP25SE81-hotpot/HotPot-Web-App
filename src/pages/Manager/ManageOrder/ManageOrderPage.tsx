import { Box } from "@mui/material";
import ManageOrder from "../../../containers/ManageOrder/ManageOrder";
import ErrorBoundary from "../../../components/ErrorBoundary";

export const ManageOrderPage = () => {
  return (
    <ErrorBoundary>
      <Box>
        <ManageOrder />
      </Box>
    </ErrorBoundary>
  );
};
