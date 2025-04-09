import React from "react";
import FeedbackDetail from "../../../containers/Feedback/FeedbackDetail";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";

const FeedbackDetailPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading={config.Vntext.Feedback.feedbackDetail}
          links={[
            {
              name: config.Vntext.Dashboard.dashboard,
              href: config.adminRoutes.dashboard,
            },
            {
              name: config.Vntext.Feedback.feedbackPage,
              href: config.adminRoutes.feedback,
            },
            { name: config.Vntext.Feedback.feedbackDetailId },
          ]}
        />
        <FeedbackDetail />{" "}
      </ContainerWrapper>
    </>
  );
};

export default FeedbackDetailPage;
