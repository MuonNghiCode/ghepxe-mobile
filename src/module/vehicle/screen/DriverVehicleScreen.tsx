import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import DriverVehicleCard from "../components/DriverVehicleCard";

const VEHICLE_TYPES = [
  { key: "all", label: "Tất cả", icon: "car-outline" },
  { key: "Xe tải", label: "Xe tải", icon: "truck-outline" },
  { key: "Bán tải", label: "Bán tải", icon: "car-pickup" },
  { key: "Xe máy", label: "Xe máy", icon: "motorbike" },
];

const dummyVehicles = [
  {
    id: "1",
    name: "Xe tải Fuso 1.5T",
    plate: "51C-123.45",
    type: "Xe tải",
    image: require("../../../assets/pictures/logo.png"),
    status: "Đang hoạt động",
  },
  {
    id: "2",
    name: "Xe bán tải Ford Ranger",
    plate: "51D-678.90",
    type: "Bán tải",
    image: require("../../../assets/pictures/logo.png"),
    status: "Đang hoạt động",
  },
  {
    id: "3",
    name: "Honda Wave Alpha",
    plate: "59X3-456.78",
    type: "Xe máy",
    image: require("../../../assets/pictures/logo.png"),
    status: "Đang bảo trì",
  },
];

export default function DriverVehicleScreen() {
  const navigation = useNavigation();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [showFilterBar, setShowFilterBar] = useState(false);

  useEffect(() => {
    // TODO: Gọi API lấy danh sách xe của tài xế
    setVehicles(dummyVehicles);
  }, []);

  const handleCreateVehicle = useCallback(() => {
    navigation.navigate("CreateVehicle" as never);
  }, [navigation]);

  const handleVehicleDetail = useCallback(
    (vehicleId: string) => {
      // navigation.navigate("VehicleDetail" as never, { vehicleId });
    },
    [navigation]
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Bộ lọc xe
  const filteredVehicles =
    filterType === "all"
      ? vehicles
      : vehicles.filter((v) => v.type === filterType);

  const renderHeader = () => (
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
      <Text style={tw`text-lg font-bold text-black flex-1 text-center`}>
        Quản lý xe
      </Text>
      <View style={tw`w-10 h-10`} />
    </View>
  );

  // Nút tạo xe nổi bật
  const renderCreateButton = () => (
    <View style={tw`px-4 pt-4 pb-2 bg-white`}>
      <TouchableOpacity
        style={tw`flex-row items-center justify-center bg-[#00A982] rounded-full py-3 shadow`}
        onPress={handleCreateVehicle}
        activeOpacity={0.85}
      >
        <Ionicons name="add-circle-outline" size={22} color="#fff" />
        <Text style={tw`ml-2 text-white font-semibold text-base`}>
          Tạo xe mới
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Thanh thông tin tổng số xe và nút filter
  const renderInfoBar = () => (
    <View style={tw`flex-row items-center justify-between px-4 py-2 bg-white`}>
      <View style={tw`flex-row items-center`}>
        <Ionicons name="car-outline" size={18} color="#00A982" />
        <Text style={tw`ml-2 text-base font-semibold text-black`}>
          Có {filteredVehicles.length} xe
        </Text>
      </View>
      <TouchableOpacity
        style={tw`flex-row items-center px-3 py-2 rounded-full bg-gray-100`}
        onPress={() => setShowFilterBar((v) => !v)}
        activeOpacity={0.85}
      >
        <Ionicons name="filter-outline" size={18} color="#00A982" />
        <Text style={tw`ml-1 text-xs font-semibold text-[#00A982]`}>
          Bộ lọc
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Bộ lọc loại xe (hiện khi showFilterBar = true)
  const renderFilterBar = () =>
    showFilterBar && (
      <View style={tw`flex-row px-4 py-2 bg-white`}>
        {VEHICLE_TYPES.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={tw.style(
              "px-4 py-2 rounded-full mr-2",
              filterType === type.key ? "bg-[#E6F7F3]" : "bg-gray-100"
            )}
            onPress={() => {
              setFilterType(type.key);
              setShowFilterBar(false);
            }}
            activeOpacity={0.85}
          >
            <Text
              style={tw.style(
                "text-xs font-semibold",
                filterType === type.key ? "text-[#00A982]" : "text-gray-700"
              )}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {renderHeader()}
      {renderCreateButton()}
      {renderInfoBar()}
      {renderFilterBar()}
      <ScrollView style={tw`pt-2`} showsVerticalScrollIndicator={false}>
        {filteredVehicles.length === 0 ? (
          <View style={tw`items-center justify-center mt-16`}>
            <Ionicons name="car-outline" size={48} color="#D1D5DB" />
            <Text style={tw`text-gray-500 mt-4 text-base`}>
              Không có xe phù hợp với bộ lọc này.
            </Text>
          </View>
        ) : (
          filteredVehicles.map((vehicle) => (
            <DriverVehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onPress={handleVehicleDetail}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
