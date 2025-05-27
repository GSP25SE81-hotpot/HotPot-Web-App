import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import UpdateHotpotCombo from "../../../containers/ManageCombo/UpdateCombo/UpdateCombo";

const UpdateComboPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Cập nhật combo tuỳ chỉnh"
          links={[
            {
              name: config.Vntext.Dashboard.dashboard,
              href: config.adminRoutes.dashboard,
            },
            { name: "Cập nhật combo" },
          ]}
        />

        <UpdateHotpotCombo />
      </ContainerWrapper>
    </>
  );
};

export default UpdateComboPage;
