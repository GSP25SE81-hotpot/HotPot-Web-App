import React from "react";
import HotpotComboCreate from "../../../containers/Createcombo/HotpotComboCreate";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";

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

        <HotpotComboCreate />
      </ContainerWrapper>
    </>
  );
};

export default CreateIngredientsPage;
