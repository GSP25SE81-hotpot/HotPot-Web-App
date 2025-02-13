import React, { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "../AdminLayout/Sidebar/Sidebar";
import Navbar from "../AdminLayout/Navbar/Navbar";
import classNames from "classnames/bind";
import styles from "./AdminLayout.module.scss";

const AdminLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const cx = classNames.bind(styles);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <Box className={cx("admin-layout", { collapsed: isSidebarCollapsed })}>
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <Box className={cx("main-content")}>
        <Navbar
          onMenuClick={handleToggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <Box className={cx("page-wrapper")}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
