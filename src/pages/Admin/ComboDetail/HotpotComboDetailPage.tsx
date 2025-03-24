import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import HotpotComboDetail from "../../../containers/Createcombo/ComboDetail/HotpotComboDetail";

const HotpotComboDetailPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Chi tiết combo lẩu"
          links={[
            {
              name: config.Vntext.Dashboard.dashboard,
              href: config.adminRoutes.dashboard,
            },
            {
              name: config.Vntext.CreateCombo.Menu,
              href: config.adminRoutes.tableHotPotCombo,
            },
            { name: "Chi tiết combo lẩu" },
          ]}
        />

        <HotpotComboDetail />
      </ContainerWrapper>
    </>
  );
};

export default HotpotComboDetailPage;
