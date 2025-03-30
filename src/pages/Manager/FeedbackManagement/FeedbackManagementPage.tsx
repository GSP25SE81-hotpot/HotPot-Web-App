import FeedbackManagement from "../../../containers/FeedbackManagement/FeedbackManagement";
import ErrorBoundary from "../../../components/ErrorBoundary";
import { SignalRProvider } from "../../../context/SignalRContext";

export const FeedbackManagementPage = () => {
  return (
    <ErrorBoundary>
      <SignalRProvider>
        <FeedbackManagement />
      </SignalRProvider>
    </ErrorBoundary>
  );
};
