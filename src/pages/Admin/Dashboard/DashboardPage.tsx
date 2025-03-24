import React from "react";
import ContainerWrapper from "../../../components/Container";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Analytics from "../../../containers/Dashboard/Analytics";
import config from "../../../configs";

const DashboardPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Bảng Thống Kê"
          links={[{ name: config.Vntext.Dashboard.dashboard }]}
        />

        <Analytics />
      </ContainerWrapper>
    </>
  );
};

export default DashboardPage;
