import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { MenuItem } from "../../../types/menu";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import Iconify from "../../../components/Iconify";
import config from "../../../configs";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const [open, setOpen] = useState<string | null>(null);
  const cx = classNames.bind(styles);

  const menuItems: MenuItem[] = [
    {
      icon: <DashboardIcon />,
      label: config.Vntext.SideBar.Dashboard,
      path: config.adminRoutes.dashboard,
    },
    {
      icon: <PeopleIcon />,
      label: config.Vntext.SideBar.Users,
      path: "",
      children: [
        { label: "Danh sách", path: config.adminRoutes.manageUsers },
        { label: "Vị trí", path: "/users/roles" },
      ],
    },
    {
      icon: <InventoryIcon />,
      label: config.Vntext.SideBar.Hotpot.hotpotSidebar,
      path: "",
      children: [
        {
          label: config.Vntext.SideBar.Hotpot.hotpotCombo,
          path: config.adminRoutes.tableHotPotCombo,
        },
        {
          label: config.Vntext.SideBar.Hotpot.hotpotIngredients,
          path: config.adminRoutes.tableIngredients,
        },
      ],
    },
    {
      icon: <SettingsIcon />,
      label: config.Vntext.SideBar.Settings,
      path: "/settings",
    },
    {
      icon: <Iconify icon={"ri:feedback-line"} />,
      label: config.Vntext.SideBar.Feedback,
      path: config.adminRoutes.feedback,
    },
  ];

  const handleClick = (label: string) => {
    setOpen(open === label ? null : label);
  };

  // const isActive = (path: string): boolean => {
  //   return location.pathname === path;
  // };

  return (
    <Box
      component="aside"
      className={cx("sidebar", { collapsed: isCollapsed })}
    >
      <Link to={config.adminRoutes.dashboard} className={cx("logo-wrapper")}>
        <Box className={cx("logo")}>
          <span className={cx("logo-text")}>LS</span>
        </Box>
        {!isCollapsed && <span className={cx("brand-name")}>Lẩu tự sôi</span>}
      </Link>

      <List component="nav" className={cx("nav-menu")}>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem
              component={Link}
              to={item.path}
              onClick={() => item.children && handleClick(item.label)}
              className={cx("nav-item", {
                active: location.pathname === item.path,
                expanded: open === item.label,
              })}
            >
              <ListItemIcon className={cx("nav-icon")}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.label} />}
            </ListItem>

            {item.children && (
              <Collapse in={open === item.label} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child, index) => (
                    <ListItem
                      key={index}
                      component={Link}
                      to={child.path}
                      className={cx("nav-item", {
                        active: location.pathname === child.path,
                      })}
                    >
                      <ListItemIcon className={cx("nav-icon")}></ListItemIcon>
                      {!isCollapsed && <ListItemText primary={child.label} />}
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
