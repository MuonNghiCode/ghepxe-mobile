import React, { createContext, useContext, useState, ReactNode } from "react";

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
}

interface RouteDraft {
  vehicleId?: string;
  vehicleType?: string;
  dimensions?: string;
  maxWeight?: string;
  availableWeight?: string;
  availableVolume?: string;
  isFullLoad?: boolean;
  temperatureControlled?: boolean;
  minTemp?: string;
  maxTemp?: string;
  selectedSize?: string;
  selectedCategory?: string;
  otherCategory?: string;
  weightRaw?: string;
  driverNote?: string;
  departureTime?: string;
  estimatedArrivalTime?: string;
}

interface RouteContextType {
  pickupLocation: LocationData | null;
  dropoffLocation: LocationData | null;
  routeDraft: RouteDraft | null;
  setPickupLocation: (data: LocationData | null) => void;
  setDropoffLocation: (data: LocationData | null) => void;
  setRouteDraft: (draft: RouteDraft | null) => void;
  clearRoute: () => void;
}

const RouteContext = createContext<RouteContextType>({
  pickupLocation: null,
  dropoffLocation: null,
  routeDraft: null,
  setPickupLocation: () => {},
  setDropoffLocation: () => {},
  setRouteDraft: () => {},
  clearRoute: () => {},
});

export const useRoute = () => useContext(RouteContext);

export function RouteProvider({ children }: { children: ReactNode }) {
  const [pickupLocation, setPickupLocation] = useState<LocationData | null>(
    null
  );
  const [dropoffLocation, setDropoffLocation] = useState<LocationData | null>(
    null
  );
  const [routeDraft, setRouteDraft] = useState<RouteDraft | null>(null);

  const clearRoute = () => {
    setPickupLocation(null);
    setDropoffLocation(null);
    setRouteDraft(null);
  };

  return (
    <RouteContext.Provider
      value={{
        pickupLocation,
        dropoffLocation,
        routeDraft,
        setPickupLocation,
        setDropoffLocation,
        setRouteDraft,
        clearRoute,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}
