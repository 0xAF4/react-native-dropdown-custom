// index.d.ts
import { ComponentType } from 'react';
import { ViewStyle, TextStyle } from 'react-native';

export interface DropdownItem {
  id: string | number;
  label: string;
}

export interface DropdownProps {
  value: string | number;
  data: DropdownItem[];
  label?: string;
  onChange: (value: string | number) => void;
  renderDisplay?: () => JSX.Element;
  showSearchBar?: boolean;
  theme?: Record<string, any>;
  placeholderTextColor?: string;
}

const Dropdown: ComponentType<DropdownProps>;

export default Dropdown;
