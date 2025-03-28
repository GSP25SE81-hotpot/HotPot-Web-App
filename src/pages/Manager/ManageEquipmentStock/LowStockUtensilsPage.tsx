import { Box } from "@mui/material";
import LowStockUtensils from "../../../containers/ManageEquipmentStock/LowStockUtensils";
import ErrorBoundary from "../../../components/ErrorBoundary";

export const LowStockUtensilsPage = () => {
  return (
    <ErrorBoundary>
      <Box>
        <LowStockUtensils />
      </Box>
    </ErrorBoundary>
  );
};
