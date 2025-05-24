import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import TableBatch from "../../../containers/ManageBatch/TableBatch";

const TableBatchPage: React.FC = () => {
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

        <TableBatch />
      </ContainerWrapper>
    </>
  );
};

export default TableBatchPage;
