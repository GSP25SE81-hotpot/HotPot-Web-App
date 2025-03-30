import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import TableIngredientType from "../../../containers/ManageIngredientType/TableIngredientType";

const TableIngredientTypePage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Bảng Loại Nguyên Liệu"
          links={[
            { name: config.Vntext.Dashboard.dashboard },
            { name: "Bảng loại nguyên liệu" },
          ]}
        />

        <TableIngredientType />
      </ContainerWrapper>
    </>
  );
};

export default TableIngredientTypePage;
