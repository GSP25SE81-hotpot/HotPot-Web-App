import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import TableCombo from "../../../containers/ManageCombo/TableCombo";

const TableHotpotComboPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Combo Lẩu"
          links={[
            { name: config.Vntext.Dashboard.dashboard },
            { name: "Quản lí Combo lẩu" },
          ]}
        />

        <TableCombo />
      </ContainerWrapper>
    </>
  );
};

export default TableHotpotComboPage;
