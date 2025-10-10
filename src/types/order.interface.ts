export type OrderStatus = "waiting" | "delivering" | "delivered" | "cancelled";

export type OrderCardStatus = "pending" | "picking" | "review" | "cancelled";

export interface Order {
  id: string;
  status: OrderCardStatus;
  orderStatus?: OrderStatus;
  productImage: any;
  productName: string;
  quantity: number;
  weight: string;
  price: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupContact: string;
  pickupPhone: string;
  deliveryContact: string;
  deliveryPhone: string;
  pickupLatitude: number;
  pickupLongitude: number;
  deliveryLatitude: number;
  deliveryLongitude: number;
  time: string;
  tag: string;
  customerName?: string;
  customerRating?: number;
}

export interface StatusConfig {
  header: string;
  icon: string;
  headerColor: string;
  showCancel: boolean;
  showReport: boolean;
  showReorder: boolean;
  showChat: boolean;
  showCall: boolean;
  statusText: string;
  statusColor: string;
  statusBg: string;
  buttonText: string;
  buttonColor: string;
  reportText?: string;
  reportColor?: string;
}

export interface OrderItem {
  name: string;
  quantity: number | string;
  price: string;
  status: string;
}

// Navigation types
export interface UserOrderDetailScreenParams {
  order: Order;
}

export interface Coordinate {
    latitude: number;
    longitude: number;
}

export interface OrderCardProps {
  order: {
    id: string;
    customerName?: string;
    rating?: number;
    requestTime?: string;
    pickup: {
      address: string;
      details: string;
    };
    delivery: {
      address: string;
      distance?: string;
    };
    price: string;
    co2Reduction?: string;
    status: string;
    serviceType: "single" | "shared";
  };
  onAccept?: (orderId: string) => void;
  onContact?: (orderId: string) => void;
  showCustomerInfo?: boolean;
  variant?: "suggestion" | "current";
}