import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import TableHotpot from "../../../containers/ManageHotpot/TableHotpot";

const TableHotpotPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Nồi Lẩu"
          links={[
            { name: config.Vntext.Dashboard.dashboard },
            { name: "Quản lí nồi lẩu" },
          ]}
        />

        <TableHotpot />
      </ContainerWrapper>
    </>
  );
};

export default TableHotpotPage;
