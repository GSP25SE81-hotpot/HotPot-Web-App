import React from "react";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ContainerWrapper from "../../../components/Container";
import config from "../../../configs";
import CreateHotpot from "../../../containers/ManageHotpot/CreateHopot/CreateHotpot";

const CreateHotpotPage: React.FC = () => {
  return (
    <>
      <ContainerWrapper>
        <HeaderBreadcrumbs
          heading="Thêm nồi lẩu"
          links={[
            { name: config.Vntext.Dashboard.dashboard },
            { name: "Bảng nồi lẩu" },
            { name: "Thêm nồi lẩu" },
          ]}
        />

        <CreateHotpot />
      </ContainerWrapper>
    </>
  );
};

export default CreateHotpotPage;
