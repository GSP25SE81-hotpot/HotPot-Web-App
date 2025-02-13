import React from "react";
import FeedbackDetail from "../../../containers/Feedback/FeedbackDetail";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";

const FeedbackDetailPage: React.FC = () => {
  const feedbackData = {
    id: "FB12345",
    customerName: "Nguyễn Văn A",
    phone: "0987654321",
    email: "nguyenvana@example.com",
    orderId: "ORD67890",
    content: "Nồi lẩu bị lỗi không hoạt động. Mong được hỗ trợ đổi sản phẩm.",
    feedbackType: "Phản ánh sản phẩm",
    status: "Chưa xử lý",
    createdAt: "2025-01-15 14:30",
    priority: "Cao",
  };
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading={config.Vntext.Feedback.feedbackDetail}
          links={[
            { name: config.Vntext.Dashboard.dashboard },
            { name: config.Vntext.Feedback.feedbackPage },
            { name: config.Vntext.Feedback.feedbackDetailId },
          ]}
        />
        <FeedbackDetail {...feedbackData} />{" "}
      </ContainerWrapper>
    </>
  );
};

export default FeedbackDetailPage;
