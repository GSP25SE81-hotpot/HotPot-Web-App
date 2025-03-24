import OverrideMuiTheme from "../../../theme/override";
import FeedbackManagement from "../../../containers/FeedbackManagement/FeedbackManagement";
import ErrorBoundary from "../../../components/ErrorBoundary";
import { SignalRProvider } from "../../../context/SignalRContext";
import { AuthContextProvider } from "../../../context/AuthContext";

export const FeedbackManagementPage = () => {
  return (
    <OverrideMuiTheme>
      <ErrorBoundary>
        <AuthContextProvider>
          <SignalRProvider>
            <FeedbackManagement />
          </SignalRProvider>
        </AuthContextProvider>
      </ErrorBoundary>
    </OverrideMuiTheme>
  );
};
