import React, { useEffect, useState } from "react";
import { Layout, Menu, theme } from "antd";
import { Outlet } from "react-router-dom";
import { menuItems } from "./Header/SideBarAdmin/sidebarMenu";
import HeaderAdmin from "./Header/Header";
import Logo from "../../components/Logo/Logo";
import "./LayoutAdmin.scss";
import { CustomMenuItem } from "../../models/MenuSidebar";

const { Content, Footer, Sider } = Layout;

const LayoutAdmin: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [filteredMenuItems, setFilteredMenuItems] = useState<CustomMenuItem[]>(
    []
  );

  const handleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const rawUserRoles = localStorage.getItem("loginInfo");
    let userRoles: string[] = [];

    //get role login
    try {
      const parsedInfo = JSON.parse(rawUserRoles || "{}");
      if (parsedInfo && parsedInfo.data && parsedInfo.data.role) {
        userRoles = [parsedInfo.data.role];
      }
    } catch (e) {
      console.error("Failed to parse user info from local storage", e);
    }

    //function check role
    const hasAccess = (roles?: string[]) => {
      if (!roles) return true;
      return roles.some((role) => userRoles.includes(role));
    };

    const filterMenuItems = (items: CustomMenuItem[]): CustomMenuItem[] => {
      return items
        .filter((item) => hasAccess(item.roles))
        .map((item) => ({
          ...item,
          children: item.children ? filterMenuItems(item.children) : undefined,
        }));
    };

    //check undefined
    const safeMenuItems: CustomMenuItem[] = Array.isArray(menuItems)
      ? menuItems
      : [];

    setFilteredMenuItems(filterMenuItems(safeMenuItems));
  }, []);

  return (
    <Layout className="layout-admin">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        collapsed={collapsed}
        style={{
          background: "white",
          borderRight: "1px solid rgba(132, 136, 132, 0.3 )",
          transform: "scaleY(1)",
        }}
      >
        <div className="demo-logo-vertical" style={{ height: "auto" }}>
          <Logo />
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          items={filteredMenuItems}
        />
      </Sider>
      <Layout>
        <HeaderAdmin isCollapse={collapsed} handleCollapsed={handleCollapsed} />
        <Content className="content">
          <div
            style={{
              padding: 24,
              height: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              width: "auto",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer className="footer">Welcome To SMMMS Team</Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
