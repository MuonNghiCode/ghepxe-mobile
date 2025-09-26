import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import tw from "twrnc";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/type";

type MapSelectNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MapSelect"
>;

export default function MapSelectScreen({ route }: any) {
  const navigation = useNavigation<MapSelectNavigationProp>();
  const [region, setRegion] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelected({ latitude, longitude });
    let addressArr = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    if (addressArr && addressArr.length > 0) {
      const { street, name, district, city } = addressArr[0];
      setAddress([street || name, district, city].filter(Boolean).join(", "));
    } else {
      setAddress("Không xác định được địa chỉ");
    }
  };

  const handleConfirm = () => {
    if (selected) {
      navigation.navigate(route.params?.returnScreen || "Billing", {
        mapLocation: {
          coords: selected,
          address,
        },
      });
    }
  };

  return (
    <View style={tw`flex-1`}>
      {region && (
        <MapView
          style={tw`flex-1`}
          initialRegion={region}
          onPress={handleMapPress}
        >
          {selected && <Marker coordinate={selected} />}
        </MapView>
      )}
      <View style={tw`p-4 bg-white`}>
        <Text style={tw`text-base font-semibold mb-2`}>Địa chỉ đã chọn:</Text>
        <Text style={tw`text-gray-700 mb-4`}>
          {address || "Chạm vào bản đồ để chọn vị trí"}
        </Text>
        <TouchableOpacity
          style={tw`bg-[#00A982] py-3 rounded-xl`}
          onPress={handleConfirm}
          disabled={!selected}
        >
          <Text style={tw`text-white text-center font-bold text-base`}>
            Xác nhận vị trí này
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
