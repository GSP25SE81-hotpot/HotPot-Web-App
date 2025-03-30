import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import TableMaintenanceHotpot from "../../../containers/ManageMaintenance/TableMaintenanceHotpot";

const TableMaintenanceHotpotDetailPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Bảo Trì"
          links={[
            { name: config.Vntext.Dashboard.dashboard },
            { name: "Quản lí nồi lẩu", href: config.adminRoutes.hotpotType },
            { name: "Bảo trì chi tiết nồi lẩu" },
          ]}
        />

        <TableMaintenanceHotpot />
      </ContainerWrapper>
    </>
  );
};

export default TableMaintenanceHotpotDetailPage;
