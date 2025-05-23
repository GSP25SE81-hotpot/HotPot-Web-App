import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import ImportProduct from "../../../containers/ManageImportProduct/ImportProduct";

const ImportProductPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Nhập hàng"
          links={[
            {
              name: config.Vntext.Dashboard.dashboard,
              href: config.adminRoutes.dashboard,
            },
            { name: "Nhập hàng" },
          ]}
        />
        <ImportProduct />{" "}
      </ContainerWrapper>
    </>
  );
};

export default ImportProductPage;
