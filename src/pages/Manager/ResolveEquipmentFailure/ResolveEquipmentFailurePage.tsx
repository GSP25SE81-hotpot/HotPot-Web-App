import OverrideMuiTheme from "../../../theme/override";
import ResolveEquipmentFailure from "../../../containers/ResolveEquipmentFailure/ResolveEquipmentFailure";
import ErrorBoundary from "../../../components/ErrorBoundary";

export const ResolveEquipmentFailurePage = () => {
  return (
    <OverrideMuiTheme>
      <ErrorBoundary>
        <ResolveEquipmentFailure />
      </ErrorBoundary>
    </OverrideMuiTheme>
  );
};
