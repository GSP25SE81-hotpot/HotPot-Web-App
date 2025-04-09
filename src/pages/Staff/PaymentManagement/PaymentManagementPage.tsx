import { Box } from "@mui/material";

import PaymentManagement from "../../../containers/PaymentManagement/PaymentManagement";
import ErrorBoundary from "../../../components/ErrorBoundary";

export const PaymentManagementPage = () => {
  return (
    <ErrorBoundary>
      <Box>
        <PaymentManagement />
      </Box>
    </ErrorBoundary>
  );
};
