import { PickupRental } from "../../../containers/PickupRental/PickupRental";
import ErrorBoundary from "../../../components/ErrorBoundary";

export const PickupRentalPage = () => {
  return (
    <ErrorBoundary>
      <PickupRental />
    </ErrorBoundary>
  );
};
