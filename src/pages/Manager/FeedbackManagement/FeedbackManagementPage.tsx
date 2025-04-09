import OverrideMuiTheme from "../../../theme/override";
import FeedbackManagement from "../../../containers/FeedbackManagement/FeedbackManagement";
import ErrorBoundary from "../../../components/ErrorBoundary";

export const FeedbackManagementPage = () => {
  return (
    <ErrorBoundary>
      <FeedbackManagement />
    </ErrorBoundary>
  );
};
