export type DriverOrderStatus = "ongoing" | "completed" | "cancelled";
export type DriverOrderType = "single" | "grouped";

export interface DriverOrderCustomer {
  id: string;
  name: string;
  phone: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  rating?: number | null;
  price: string;
  orders: DriverOrderItem[];
}

export interface DriverOrderItem {
  id: string;
  productName: string;
  quantity: number;
  weight: string;
  price: string;
  image: any;
}

export interface DriverOrder {
  id: string;
  type: "single" | "grouped";
  status: DriverOrderStatus;
  date: string;
  time?: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupCoordinates: {
    latitude: number;
    longitude: number;
  };
  deliveryCoordinates: {
    latitude: number;
    longitude: number;
  };
  totalQuantity: number;
  totalWeight: string;
  totalPrice: string;
  productName: string;
  productImage?: any;
  customers: DriverOrderCustomer[];
}
