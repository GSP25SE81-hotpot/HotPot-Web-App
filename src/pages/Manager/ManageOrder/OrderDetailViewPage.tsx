import { Box } from "@mui/material";
import ErrorBoundary from "../../../components/ErrorBoundary";
import OrderDetailView from "../../../containers/ManageOrder/OrderDetailView";

export const OrderDetailViewPage = () => {
  return (
    <ErrorBoundary>
      <Box>
        <OrderDetailView />
      </Box>
    </ErrorBoundary>
  );
};
