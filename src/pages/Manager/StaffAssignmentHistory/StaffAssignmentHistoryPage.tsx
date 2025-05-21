import StaffAssignmentHistory from "../../../containers/StaffAssignmentHistory/StaffAssignmentHistory";
import ErrorBoundary from "../../../components/ErrorBoundary";

export const StaffAssignmentHistoryPage = () => {
  return (
    <ErrorBoundary>
      <StaffAssignmentHistory />
    </ErrorBoundary>
  );
};
