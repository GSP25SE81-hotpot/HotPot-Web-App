import React from "react";

import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import HotpotGroupComboCreate from "../../../containers/Createcombo/HotpotGroupComboCreate";

const CreateGroupComboPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading={config.Vntext.CreateCombo.addNewMenu}
          links={[
            {
              name: config.Vntext.Dashboard.dashboard,
              href: config.adminRoutes.dashboard,
            },
            {
              name: config.Vntext.CreateCombo.Menu,
              href: config.adminRoutes.tableHotPotCombo,
            },
            { name: config.Vntext.CreateCombo.addNewMenu },
          ]}
        />

        <HotpotGroupComboCreate />
      </ContainerWrapper>
    </>
  );
};

export default CreateGroupComboPage;
