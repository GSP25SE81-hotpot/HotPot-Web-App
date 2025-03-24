export interface MenuItem {
  icon?: React.ReactNode;
  label: string;
  path: string;
  children?: MenuItem[];
  role?:  string[];
}
