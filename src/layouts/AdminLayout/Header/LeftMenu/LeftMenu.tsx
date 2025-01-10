import React from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Logo from "../../../../components/Logo/Logo";

interface HeaderProps {
  isCollapse: boolean;
  handleCollapsed: () => void;
}

const LeftMenu: React.FC<HeaderProps> = ({ isCollapse, handleCollapsed }) => {
  return (
    <div style={{ display: "flex" }}>
      {isCollapse && (
        <div
          className="demo-logo-vertical"
          style={{ height: "auto", transition: "ease-in-out 2s" }}
        >
          <Logo />
        </div>
      )}
      <Button
        type="text"
        icon={isCollapse ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={handleCollapsed}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
    </div>
  );
};

export default LeftMenu;
