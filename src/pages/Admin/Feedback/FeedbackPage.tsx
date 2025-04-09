import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import TableFeedback from "../../../containers/Feedback/FeedbackTable";

const FeedbackPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading={config.Vntext.Feedback.feedbackPage}
          links={[
            {
              name: config.Vntext.Dashboard.dashboard,
              href: config.adminRoutes.dashboard,
            },
            { name: config.Vntext.Feedback.feedbackPage },
          ]}
        />
        <TableFeedback />{" "}
      </ContainerWrapper>
    </>
  );
};

export default FeedbackPage;
