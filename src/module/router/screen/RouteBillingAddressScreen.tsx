import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import tw from "twrnc";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCurrentLocation } from "src/hooks/useCurrentLocation";
import * as Location from "expo-location";
import AddressSuggestModal from "../components/AddressSuggestModal";
import { useRoute } from "src/context/RouteContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAP_HEIGHT = SCREEN_HEIGHT * 0.75;

interface AddressObject {
  name?: string | null;
  street?: string | null;
  city?: string | null;
  country?: string | null;
  [key: string]: any;
}

function formatAddress(addressArr: AddressObject[]): string {
  if (!addressArr || addressArr.length === 0) return "";
  const { name, street, city, country } = addressArr[0];
  return `${name ?? ""} ${street ?? ""}, ${city ?? ""}, ${
    country ?? ""
  }`.trim();
}

export default function RouteBillingAddressScreen() {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [isMapFull, setIsMapFull] = useState(false);

  const navigation = useNavigation();
  const { setPickupLocation } = useRoute();

  // Hook lấy vị trí hiện tại
  const {
    location,
    address: currentAddress,
    loading,
    error,
    refresh,
    coordinates,
  } = useCurrentLocation();

  // Map state
  const [region, setRegion] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);

  // Khi có vị trí hiện tại, set region và marker
  useEffect(() => {
    if (coordinates) {
      setRegion({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setSelected({
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      });
      setAddress(currentAddress || "");
    }
  }, [coordinates, currentAddress]);

  // Khi chọn vị trí mới trên map
  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelected({ latitude, longitude });
    try {
      const addressArr = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      const formatted = formatAddress(addressArr);
      setAddress(formatted);
    } catch (error) {
      setAddress("Không thể xác định địa chỉ");
    }
  };

  // Nút định vị lại vị trí hiện tại
  const handleMyLocation = () => {
    refresh();
  };

  const handleConfirmAddress = () => {
    if (!selected || !address) {
      alert("Vui lòng chọn địa chỉ!");
      return;
    }

    setPickupLocation({
      fullAddress: address,
      street: address.split(",")[0] || "",
      ward: "",
      district: address.split(",")[1]?.trim() || "",
      city: address.split(",")[2]?.trim() || "",
      province: "",
      postalCode: "",
      country: address.split(",")[3]?.trim() || "Vietnam",
      latitude: selected.latitude,
      longitude: selected.longitude,
    });

    navigation.navigate("ConfirmRoute" as never);
  };

  // --- Render functions ---
  const renderBackButton = () => (
    <TouchableOpacity
      style={[
        tw`absolute top-10 left-5 bg-white rounded-full p-2`,
        { zIndex: 999, elevation: 10 },
      ]}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="arrow-back" size={22} color="#00A982" />
    </TouchableOpacity>
  );

  const renderMapView = () => (
    <View
      style={[
        tw`overflow-hidden`,
        isMapFull
          ? {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 20,
            }
          : {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: MAP_HEIGHT,
              zIndex: 1,
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
            },
      ]}
    >
      {region && (
        <MapView
          style={tw`flex-1`}
          initialRegion={region}
          region={
            selected
              ? { ...selected, latitudeDelta: 0.01, longitudeDelta: 0.01 }
              : region
          }
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {selected && (
            <Marker coordinate={selected} pinColor="#00A982">
              <View style={tw`bg-[#00A982] p-2 rounded-full shadow-lg`}>
                <Ionicons name="location" size={18} color="white" />
              </View>
            </Marker>
          )}
        </MapView>
      )}
      {/* Nút chọn từ bản đồ */}
      {!isMapFull && (
        <TouchableOpacity
          style={tw`absolute bottom-10 right-4 bg-white px-3 py-1 rounded-full shadow`}
          onPress={() => setIsMapFull(true)}
        >
          <Text style={tw`text-[#00A982] font-semibold`}>Chọn từ bản đồ</Text>
        </TouchableOpacity>
      )}
      {/* Nút định vị */}
      <TouchableOpacity
        onPress={handleMyLocation}
        style={tw`absolute bottom-10 left-4 bg-white p-3 rounded-full shadow-lg`}
      >
        <Ionicons name="locate" size={24} color="#00A982" />
      </TouchableOpacity>
      {/* Nút đóng map full */}
      {isMapFull && (
        <TouchableOpacity
          style={tw`absolute top-10 right-4 bg-white p-2 rounded-full shadow`}
          onPress={() => setIsMapFull(false)}
        >
          <Ionicons name="close" size={24} color="#00A982" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderAddressSection = () => (
    <View style={tw`px-4 pt-6 w-full`}>
      <View style={tw`mb-6 w-full`}>
        <Text style={tw`text-lg font-bold text-black mb-4`}>Nhận hàng tại</Text>
        <View
          style={[
            tw`flex-row items-center bg-white rounded-xl px-4 py-4 shadow-sm border border-[#E6F7F3] w-full`,
            {
              shadowColor: "#00A982",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 4,
              elevation: 3,
            },
          ]}
        >
          <TouchableOpacity
            style={tw`flex-row items-center flex-1`}
            onPress={() => setShowAddressModal(true)}
            activeOpacity={0.8}
          >
            <View
              style={tw`w-8 h-8 rounded-full bg-[#00A982] items-center justify-center mr-3`}
            >
              <Entypo name="arrow-down" size={16} color="#fff" />
            </View>
            <View style={tw`flex-1`}>
              <Text
                style={tw`text-black font-semibold text-base`}
                numberOfLines={2}
              >
                {address || "XV44+7R Thành Phố XXX"}
              </Text>
            </View>
            <View>
              <Ionicons name="create-outline" size={22} color="#00A982" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={tw`bg-white px-4 py-4 border-t border-gray-100`}>
      <TouchableOpacity
        style={tw`bg-[#00A982] rounded-xl py-4 items-center w-full shadow-lg`}
        activeOpacity={0.8}
        onPress={handleConfirmAddress}
      >
        <Text style={tw`text-white text-lg font-bold`}>Xác nhận địa chỉ</Text>
      </TouchableOpacity>
    </View>
  );

  // --- Main render ---
  return (
    <View style={tw`flex-1 bg-white`}>
      {renderBackButton()}
      {renderMapView()}
      {/* ScrollView và footer chỉ hiện khi không full map */}
      {!isMapFull && (
        <View
          style={[
            tw`absolute left-0 right-0 bottom-0 bg-white rounded-t-[2rem] overflow-hidden`,
            { top: MAP_HEIGHT - 32, zIndex: 10 },
          ]}
        >
          <View
            style={tw`bg-transparent`}
            // contentContainerStyle={tw`pb-20`}
            // showsVerticalScrollIndicator={false}
          >
            {renderAddressSection()}
          </View>
          {renderFooter()}
        </View>
      )}
      <AddressSuggestModal
        visible={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelect={(address: string) => {
          setAddress(address);
          setShowAddressModal(false);
        }}
      />
    </View>
  );
}
