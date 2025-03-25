import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Sidebar.module.scss";
import config from "../../../configs";
import { MenuItem } from "../../../types/menu";
import { menuItems } from "./MenuItems";

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const [open, setOpen] = useState<string | null>(null);
  const cx = classNames.bind(styles);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const rawUserRoles = localStorage.getItem("loginInfo");
    let userRoles: string[] = [];

    try {
      const parsedInfo = JSON.parse(rawUserRoles || "{}");
      if (parsedInfo && parsedInfo.data && parsedInfo.data.role) {
        userRoles = [parsedInfo.data.role];
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      console.error("Lỗi lấy dữ liệu");
    }

    const hasAccess = (roles: string[]) => {
      if (!roles) return true;
      return roles.some((role) => userRoles.includes(role));
    };

    const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
      return items
        .filter((item: any) => hasAccess(item?.role))
        .map((item) => ({
          ...item,
          children: item.children ? filterMenuItems(item.children) : undefined,
        }));
    };

    const safeMenuItems: MenuItem[] = Array.isArray(menuItems) ? menuItems : [];

    setFilteredMenuItems(filterMenuItems(safeMenuItems));
  }, []);

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
        {filteredMenuItems.map((item, index) => (
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
