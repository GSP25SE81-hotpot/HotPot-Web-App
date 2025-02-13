import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import FeedbackTable from "../../../containers/Feedback/FeedbackTable";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";

const FeedbackPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading={config.Vntext.Feedback.feedbackPage}
          links={[
            { name: config.Vntext.Dashboard.dashboard },
            { name: config.Vntext.Feedback.feedbackPage },
          ]}
        />
        <FeedbackTable />{" "}
      </ContainerWrapper>
    </>
  );
};

export default FeedbackPage;
