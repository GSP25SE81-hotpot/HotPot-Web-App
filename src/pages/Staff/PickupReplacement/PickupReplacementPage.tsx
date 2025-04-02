import ErrorBoundary from "../../../components/ErrorBoundary";
import PickupReplacement from "../../../containers/PickupReplacement/PickupReplacement";

export const PickupReplacementPage = () => {
  return (
    <ErrorBoundary>
      <PickupReplacement />
    </ErrorBoundary>
  );
};
