import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
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

  const { mapRef, routeCoordinates, distance, duration, fitMapToCoordinates } =
    useOrderMap({
      pickupCoordinates,
      deliveryCoordinates,
      customerCoordinates,
      enableVietnameseRoute,
      orderType,
    });

  // Hàm để fit map khi user nhấn nút
  const handleFitMap = () => {
    if (mapRef.current) {
      const coordinates =
        routeCoordinates.length > 2
          ? routeCoordinates
          : [pickupCoordinates, deliveryCoordinates, ...customerCoordinates];

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  };

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
        {/* Marker điểm nhận - màu đỏ */}
        <Marker
          coordinate={pickupCoordinates}
          pinColor="#FF0000"
          title="Điểm nhận"
          description={pickupAddress}
        />

        {/* Markers cho từng khách hàng trong đơn ghép - màu đỏ */}
        {orderType === "grouped" &&
          customers.map((customer, index) => (
            <Marker
              key={customer.id}
              coordinate={customer.coordinates}
              pinColor="#FF0000"
              title={`Điểm giao ${index + 1}: ${customer.name}`}
              description={customer.address}
            />
          ))}

        {/* Marker điểm giao cuối - màu xanh */}
        <Marker
          coordinate={deliveryCoordinates}
          pinColor="#00A982"
          title="Điểm đến cuối"
          description={deliveryAddress}
        />

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

      {/* Nút Fit Map */}
      <TouchableOpacity
        onPress={handleFitMap}
        style={[
          tw`absolute right-4`,
          {
            top: 16,
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 8,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
        ]}
      >
        <Ionicons name="scan-outline" size={20} color="#00A982" />
      </TouchableOpacity>

      {/* Khoảng cách & thời gian */}
      <View
        style={tw`absolute bottom-7 left-4 right-4 flex-row items-center justify-center bg-black/70 rounded-xl px-4 py-2`}
      >
        <Ionicons name="car-outline" size={18} color="#fff" />
        <Text style={tw`ml-2 text-white text-sm`}>
          {distance ? `${distance}` : "--"}
        </Text>
        <Ionicons name="time-outline" size={18} color="#fff" style={tw`ml-4`} />
        <Text style={tw`ml-2 text-white text-sm`}>
          {duration ? `${duration}` : "--"}
        </Text>
      </View>
    </View>
  );
};
