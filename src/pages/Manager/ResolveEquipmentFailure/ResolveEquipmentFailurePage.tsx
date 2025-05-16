import ResolveEquipmentFailure from "../../../containers/ResolveEquipmentFailure/ResolveEquipmentFailure";
import ErrorBoundary from "../../../components/ErrorBoundary";

export const ResolveEquipmentFailurePage = () => {
  return (
    <ErrorBoundary>
      <ResolveEquipmentFailure />
    </ErrorBoundary>
  );
};
