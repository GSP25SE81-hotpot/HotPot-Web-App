import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import TableBatchDetail from "../../../containers/ManageBatch/TableBatchDetail";

const TableBatchDetailPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Quản lí lô hàng"
          links={[
            { name: config.Vntext.Dashboard.dashboard },
            { name: "Quản lí lô hàng" },
          ]}
        />

        <TableBatchDetail />
      </ContainerWrapper>
    </>
  );
};

export default TableBatchDetailPage;
