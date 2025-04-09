import ErrorBoundary from "../../../components/ErrorBoundary";
import PageContainer from "../../../components/pageContainer/PageContainer";
import ReplacementDetail from "../../../containers/PickupReplacement/replacement/ReplacementDetail";

export const ReplacementDetailPage = () => {
  return (
    <PageContainer title="Replacement Request Details">
      <ErrorBoundary>
        <ReplacementDetail />
      </ErrorBoundary>
    </PageContainer>
  );
};
