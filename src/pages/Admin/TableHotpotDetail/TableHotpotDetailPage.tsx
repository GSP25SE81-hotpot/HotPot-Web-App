import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import TableHotpotDetail from "../../../containers/ManageHotpotDetail/TableHotpotDetail";

const TableHotpotDetailPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Nồi Lẩu"
          links={[
            {
              name: config.Vntext.Dashboard.dashboard,
              href: config.adminRoutes.dashboard,
            },
            { name: "Quản lí nồi lẩu", href: config.adminRoutes.hotpotType },
            { name: "Chi tiết nồi lẩu" },
          ]}
        />

        <TableHotpotDetail />
      </ContainerWrapper>
    </>
  );
};

export default TableHotpotDetailPage;
