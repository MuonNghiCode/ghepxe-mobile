import React, { createContext, useContext, useState, ReactNode } from "react";
import { CreateShipRequestRequest } from "src/types";

interface LocationData {
  street: string;
  ward: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;
  fullAddress: string;
  note?: string;
  receiverName?: string;
  receiverPhone?: string;
  cod?: string; // Thêm
  goodsValue?: string; // Thêm
}

interface OrderContextType {
  pickupLocation: LocationData | null;
  dropoffLocation: LocationData | null;
  setPickupLocation: (data: LocationData | null) => void;
  setDropoffLocation: (data: LocationData | null) => void;
  clearOrder: () => void;
  buildShipRequest: (
    userId: string,
    items: any[],
    pickupTime: { start: string; end: string }
  ) => CreateShipRequestRequest;
}

const OrderContext = createContext<OrderContextType>({
  pickupLocation: null,
  dropoffLocation: null,
  setPickupLocation: () => {},
  setDropoffLocation: () => {},
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

  const clearOrder = () => {
    setPickupLocation(null);
    setDropoffLocation(null);
  };

  const buildShipRequest = (
    userId: string,
    items: any[],
    pickupTime: { start: string; end: string }
  ): CreateShipRequestRequest => {
    if (!pickupLocation || !dropoffLocation) {
      throw new Error("Thiếu thông tin địa chỉ pickup hoặc dropoff");
    }

    return {
      userId,
      pickupStreet: pickupLocation.street,
      pickupWard: pickupLocation.ward,
      pickupDistrict: pickupLocation.district,
      pickupCity: pickupLocation.city,
      pickupProvince: pickupLocation.province,
      pickupPostalCode: pickupLocation.postalCode,
      pickupCountry: pickupLocation.country,
      pickupLatitude: pickupLocation.latitude,
      pickupLongitude: pickupLocation.longitude,
      dropoffStreet: dropoffLocation.street,
      dropoffWard: dropoffLocation.ward,
      dropoffDistrict: dropoffLocation.district,
      dropoffCity: dropoffLocation.city,
      dropoffProvince: dropoffLocation.province,
      dropoffPostalCode: dropoffLocation.postalCode,
      dropoffCountry: dropoffLocation.country,
      dropoffLatitude: dropoffLocation.latitude,
      dropoffLongitude: dropoffLocation.longitude,
      pickupWindowStart: pickupTime.start,
      pickupWindowEnd: pickupTime.end,
      items,
    };
  };

  return (
    <OrderContext.Provider
      value={{
        pickupLocation,
        dropoffLocation,
        setPickupLocation,
        setDropoffLocation,
        clearOrder,
        buildShipRequest,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}
