import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import CreateIngredients from "../../../containers/CreateIngredients/CreateIngredients";

const CreateIngredientsPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading={config.Vntext.CreateIngredients.addNewIngredients}
          links={[
            { name: config.Vntext.Dashboard.dashboard },
            { name: config.Vntext.CreateIngredients.hotpotIngredients },
            { name: config.Vntext.CreateIngredients.createIngredients },
          ]}
        />

        <CreateIngredients />
      </ContainerWrapper>
    </>
  );
};

export default CreateIngredientsPage;
