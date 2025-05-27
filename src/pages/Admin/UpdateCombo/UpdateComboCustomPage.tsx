import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import HotpotCustomComboUpdate from "../../../containers/ManageCombo/UpdateCombo/UpdateComboCustom";

const UpdateComboCustomPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Cập nhật combo"
          links={[
            {
              name: config.Vntext.Dashboard.dashboard,
              href: config.adminRoutes.dashboard,
            },
            { name: "Cập nhật combo tuỳ chình" },
          ]}
        />

        <HotpotCustomComboUpdate />
      </ContainerWrapper>
    </>
  );
};

export default UpdateComboCustomPage;
