import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";
import tw from "twrnc";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/type";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type MapSelectNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "MapSelect"
>;

export default function MapSelectScreen({ route }: any) {
  const navigation = useNavigation<MapSelectNavigationProp>();
  const [region, setRegion] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const slideAnim = useState(new Animated.Value(SCREEN_HEIGHT))[0];
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setLoading(false);

      // Animate bottom sheet
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    })();
  }, []);

  const handleMapPress = async (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setSelected({ latitude, longitude });

    try {
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
    } catch (error) {
      setAddress("Không thể xác định địa chỉ");
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

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleMyLocation = async () => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      setSelected(newRegion);

      let addressArr = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (addressArr && addressArr.length > 0) {
        const { street, name, district, city } = addressArr[0];
        setAddress([street || name, district, city].filter(Boolean).join(", "));
      }
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-100`}>
        <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
        <View style={tw`flex-1 justify-center items-center`}>
          <View style={tw`bg-white p-6 rounded-xl shadow-lg`}>
            <Text style={tw`text-gray-600 text-center`}>
              Đang tải bản đồ...
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100`}
      >
        <TouchableOpacity
          onPress={handleGoBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={tw`w-10 h-10 items-center justify-center`}
        >
          <Ionicons name="chevron-back" size={24} color="#00A982" />
        </TouchableOpacity>

        <Text style={tw`text-lg font-semibold text-black flex-1 text-center`}>
          Chọn vị trí
        </Text>
        <View style={tw`w-10 h-10`} />
      </View>

      {/* Map Container */}
      <View style={tw`flex-1 relative`}>
        {region && (
          <MapView
            style={tw`flex-1`}
            initialRegion={region}
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={false}
            customMapStyle={[
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ]}
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

        {/* My Location Button */}
        <TouchableOpacity
          onPress={handleMyLocation}
          style={tw`absolute bottom-32 right-4 bg-white p-3 rounded-full shadow-lg`}
        >
          <Ionicons name="locate" size={24} color="#00A982" />
        </TouchableOpacity>

        {/* Center Pin for visual reference */}
        <View
          style={tw`absolute top-1/2 left-1/2 transform -translate-x-3 -translate-y-6`}
        >
          <Ionicons name="location-outline" size={24} color="#9CA3AF" />
        </View>
      </View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          tw`bg-white rounded-t-3xl shadow-2xl`,
          {
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Handle */}
        <View style={tw`items-center py-3`}>
          <View style={tw`w-10 h-1 bg-gray-300 rounded-full`} />
        </View>

        <View style={tw`px-6 pb-8`}>
          {/* Icon and Title */}
          <View style={tw`flex-row items-center mb-4`}>
            <View style={tw`bg-[#00A982]/10 p-3 rounded-full mr-3`}>
              <Ionicons name="location" size={20} color="#00A982" />
            </View>
            <Text style={tw`text-xl font-bold text-gray-800`}>
              Vị trí đã chọn
            </Text>
          </View>

          {/* Address Display */}
          <View style={tw`bg-gray-50 p-4 rounded-xl mb-6`}>
            {address ? (
              <View style={tw`flex-row items-start`}>
                <Ionicons
                  name="pin"
                  size={16}
                  color="#6B7280"
                  style={tw`mr-2 mt-1`}
                />
                <Text style={tw`text-gray-700 flex-1 leading-5`}>
                  {address}
                </Text>
              </View>
            ) : (
              <View style={tw`flex-row items-center`}>
                <Ionicons
                  name="hand-left"
                  size={16}
                  color="#9CA3AF"
                  style={tw`mr-2`}
                />
                <Text style={tw`text-gray-500 italic`}>
                  Chạm vào bản đồ để chọn vị trí
                </Text>
              </View>
            )}
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            style={[
              tw`py-4 rounded-xl shadow-sm`,
              selected ? tw`bg-[#00A982]` : tw`bg-gray-300`,
            ]}
            onPress={handleConfirm}
            disabled={!selected}
            activeOpacity={0.8}
          >
            <View style={tw`flex-row items-center justify-center`}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="white"
                style={tw`mr-2`}
              />
              <Text style={tw`text-white text-center font-bold text-base`}>
                Xác nhận vị trí này
              </Text>
            </View>
          </TouchableOpacity>

          {/* Helper Text */}
          <Text style={tw`text-center text-gray-500 text-sm mt-3`}>
            Vị trí này sẽ được sử dụng cho giao hàng
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
