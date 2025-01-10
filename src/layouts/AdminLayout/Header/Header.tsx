import React from "react";
import { Layout, theme } from "antd";

import RightMenu from "./RightMenu/RightMenu";
import LeftMenu from "./LeftMenu/LeftMenu";

const { Header } = Layout;

interface HeaderProps {
  isCollapse: boolean;
  handleCollapsed: () => void;
}

const HeaderAdmin: React.FC<HeaderProps> = ({
  isCollapse,
  handleCollapsed,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "85px",
      }}
    >
      <LeftMenu isCollapse={isCollapse} handleCollapsed={handleCollapsed} />
      <RightMenu />
    </Header>
  );
};

export default HeaderAdmin;
