import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import TableIngredients from "../../../containers/ManageIngredients/TableIngredients";

const TableIngredientsPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Bảng Nguyên Liệu"
          links={[
            { name: config.Vntext.Dashboard.dashboard },
            { name: "Bảng nguyên liệu" },
          ]}
        />

        <TableIngredients />
      </ContainerWrapper>
    </>
  );
};

export default TableIngredientsPage;
