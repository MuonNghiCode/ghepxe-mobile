export interface AddressItemType {
  id: number;
  title: string;
  subtitle: string;
}

export interface AddressItemProps {
  item: AddressItemType;
  onPress: (item: AddressItemType) => void;
  onMenuPress: (item: AddressItemType) => void;
}

export interface HelpItemType {
  id: number;
  icon: string;
  iconColor: string;
  text: string;
}

export interface HelpItemProps {
  item: HelpItemType;
  onPress: (item: HelpItemType) => void;
}