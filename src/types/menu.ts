export interface MenuItem {
  icon?: React.ReactNode;
  label: string;
  path: string;
  children?: MenuItem[];
  role?: string[];
}

export interface MenuItemLayout {
  role: string;
  menu: MenuItem[];
}
