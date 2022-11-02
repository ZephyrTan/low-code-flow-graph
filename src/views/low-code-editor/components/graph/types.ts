export interface MenuItem {
  id: string | number;
  name: string;
  img?: string;
}

export interface MenuGroup {
  title: string;
  name: string;
  children?: MenuItem[];
}

export interface MenuData {
  groups: MenuGroup[];
  items: any;
}
