import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import tw from "twrnc";
import { useOrderMap } from "src/hooks/useOrderMap";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Customer {
  id: string;
  name: string;
  coordinates: Coordinates;
  address: string;
}

interface OrderMapProps {
  pickupCoordinates: Coordinates;
  deliveryCoordinates: Coordinates;
  pickupAddress: string;
  deliveryAddress: string;
  customers?: Customer[]; // cho đơn ghép
  orderStatus: string;
  statusImage: any;
  enableVietnameseRoute?: boolean;
  orderType?: "single" | "grouped";
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAP_HEIGHT = SCREEN_HEIGHT * 0.45;

export const OrderMap: React.FC<OrderMapProps> = ({
  pickupCoordinates,
  deliveryCoordinates,
  pickupAddress,
  deliveryAddress,
  customers = [],
  orderStatus,
  statusImage,
  enableVietnameseRoute = false,
  orderType = "single",
}) => {
  const customerCoordinates = customers.map((c) => c.coordinates);

  const { mapRef, routeCoordinates, distance, duration } = useOrderMap({
    pickupCoordinates,
    deliveryCoordinates,
    customerCoordinates,
    enableVietnameseRoute,
    orderType, // Thêm prop này
  });

  return (
    <View style={tw`w-full`}>
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: MAP_HEIGHT }}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Marker điểm nhận */}
        <Marker
          coordinate={pickupCoordinates}
          pinColor="#000"
          title="Điểm nhận"
          description={pickupAddress}
        />

        {/* Marker điểm giao chính */}
        <Marker
          coordinate={deliveryCoordinates}
          pinColor="#00A982"
          title="Điểm giao cuối"
          description={deliveryAddress}
        />

        {/* Markers cho từng khách hàng trong đơn ghép */}
        {orderType === "grouped" &&
          customers.map((customer, index) => (
            <Marker
              key={customer.id}
              coordinate={customer.coordinates}
              pinColor={`hsl(${index * 137.5}, 60%, 50%)`}
              title={`${customer.name} (${index + 1})`}
              description={customer.address}
            />
          ))}

        {/* Polyline đường đi */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#00A982"
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </MapView>

      {/* Icon trạng thái trên map */}
      <TouchableOpacity
        style={[
          tw`absolute right-4`,
          {
            bottom: 24,
            backgroundColor: "#fff",
            borderRadius: 9999,
            padding: 8,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
        ]}
      >
        <Image source={statusImage} style={tw`w-6 h-6`} resizeMode="contain" />
      </TouchableOpacity>

      {/* Hiển thị distance và duration */}
      {(distance || duration) && (
        <View
          style={[
            tw`absolute left-4`,
            {
              bottom: 24,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 8,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
            },
          ]}
        >
          <Text style={tw`text-xs font-semibold text-black`}>
            {distance} • {duration}
            {orderType === "grouped" && customers.length > 0 && (
              <Text style={tw`text-xs text-gray-500`}>
                {" "}
                • {customers.length} điểm
              </Text>
            )}
          </Text>
        </View>
      )}
    </View>
  );
};
