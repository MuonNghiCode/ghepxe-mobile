import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  CreateShipRequestRequest,
  CreateShipItemRequest,
  SpecialRequestData,
} from "src/types";
import { Product } from "src/types/product.interface";

interface LocationData {
  fullAddress: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  note?: string;
  receiverName?: string;
  receiverPhone?: string;
}

interface OrderDraft {
  products: Product[];
  orderCategory: string;
  serviceType: string;
  pickupTime: string;
  goodsType: "private" | "personal";
  driverNote: string;
  selectedRequests: {
    returnDelivery: boolean;
    loading: boolean;
    driverAssistance: boolean;
    smsNotification: boolean;
    electronicInvoice: boolean;
  };
}

interface OrderContextType {
  pickupLocation: LocationData | null;
  dropoffLocation: LocationData | null;
  orderDraft: OrderDraft | null;
  setPickupLocation: (data: LocationData | null) => void;
  setDropoffLocation: (data: LocationData | null) => void;
  setOrderDraft: (draft: OrderDraft | null) => void;
  clearOrder: () => void;
  buildShipRequest: (
    userId: string,
    items: CreateShipItemRequest[],
    pickupTime: { start: string; end: string },
    itemType: string, // Loại sản phẩm
    itemCategory: string, // Loại hàng hóa
    specialRequest?: SpecialRequestData
  ) => CreateShipRequestRequest;
}

const OrderContext = createContext<OrderContextType>({
  pickupLocation: null,
  dropoffLocation: null,
  orderDraft: null,
  setPickupLocation: () => {},
  setDropoffLocation: () => {},
  setOrderDraft: () => {},
  clearOrder: () => {},
  buildShipRequest: () => ({} as CreateShipRequestRequest),
});

export const useOrder = () => useContext(OrderContext);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [pickupLocation, setPickupLocation] = useState<LocationData | null>(
    null
  );
  const [dropoffLocation, setDropoffLocation] = useState<LocationData | null>(
    null
  );
  const [orderDraft, setOrderDraft] = useState<OrderDraft | null>(null);

  const clearOrder = () => {
    setPickupLocation(null);
    setDropoffLocation(null);
    setOrderDraft(null);
  };

  const buildShipRequest = (
    userId: string,
    items: CreateShipItemRequest[],
    pickupTime: { start: string; end: string },
    itemType: string, // Loại sản phẩm: "Thời trang", "Điện tử"
    itemCategory: string, // Loại hàng hóa: "Business" hoặc "Personal"
    specialRequest?: SpecialRequestData
  ): CreateShipRequestRequest => {
    if (!pickupLocation || !dropoffLocation) {
      throw new Error("Vui lòng chọn địa chỉ lấy hàng và giao hàng");
    }

    return {
      userId,
      pickupAddress: pickupLocation.fullAddress,
      pickupLatitude: pickupLocation.latitude,
      pickupLongitude: pickupLocation.longitude,
      dropoffAddress: dropoffLocation.fullAddress,
      dropoffLatitude: dropoffLocation.latitude,
      dropoffLongitude: dropoffLocation.longitude,
      pickupWindowStart: pickupTime.start,
      pickupWindowEnd: pickupTime.end,
      items,
      itemType, // "Thời trang", "Điện tử", v.v.
      status: "Pending",
      shipType: "Standard",
      itemCategory, // "Business" hoặc "Personal"
      specialRequest,
    };
  };

  return (
    <OrderContext.Provider
      value={{
        pickupLocation,
        dropoffLocation,
        orderDraft,
        setPickupLocation,
        setDropoffLocation,
        setOrderDraft,
        clearOrder,
        buildShipRequest,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
