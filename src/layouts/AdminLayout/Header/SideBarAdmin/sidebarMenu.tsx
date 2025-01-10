import React from "react";
import MenuSideBars from "./SidebarMenuItems";
import { CustomMenuItem } from "../../../../models/MenuSidebar";

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: CustomMenuItem[],
  type?: "group",
  roles?: string[]
): CustomMenuItem {
  return {
    label,
    key,
    icon,
    children,
    type,
    roles,
  } as CustomMenuItem;
}

export const menuItems: CustomMenuItem[] = MenuSideBars.map((item) =>
  getItem(item.label, item.key, item.icon, item.children, item.type, item.roles)
);
