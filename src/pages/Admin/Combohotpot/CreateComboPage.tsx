import React from "react";
import HotpotComboCreate from "../../../containers/Createcombo/HotpotComboCreate";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";

const CreateComboPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading={config.Vntext.CreateCombo.addNewMenu}
          links={[
            { name: config.Vntext.Dashboard.dashboard },
            { name: config.Vntext.CreateCombo.Menu },
            { name: config.Vntext.CreateCombo.addNewMenu },
          ]}
        />

        <HotpotComboCreate />
      </ContainerWrapper>
    </>
  );
};

export default CreateComboPage;
