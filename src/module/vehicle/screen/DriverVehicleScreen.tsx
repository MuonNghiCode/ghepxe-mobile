import React, { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import DriverVehicleCard from "../components/DriverVehicleCard";
import { useVehicle } from "src/hooks/useVehicle";

const VEHICLE_TYPES = [
  { key: "all", label: "Tất cả" },
  { key: "Xe tải", label: "Xe tải" },
  { key: "Bán tải", label: "Bán tải" },
  { key: "Xe máy", label: "Xe máy" },
];

export default function DriverVehicleScreen() {
  const navigation = useNavigation();
  const { vehicles, getAllVehicles, loading } = useVehicle();
  const [filterType, setFilterType] = useState("all");
  const [showFilterBar, setShowFilterBar] = useState(false);

  useEffect(() => {
    getAllVehicles();
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
      : vehicles.filter((v) => v.vehicleType === filterType);

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

  const renderCreateButton = () => (
    <View style={tw`px-4 pt-4 pb-2`}>
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

  const renderInfoBar = () => (
    <View
      style={tw`flex-row items-center justify-between px-4 py-2 bg-transparent`}
    >
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
        <Text
          style={tw`ml-1 text-xs font-semibold text-[#00A982] bg-transparent`}
        >
          Bộ lọc
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFilterBar = () =>
    showFilterBar && (
      <View style={tw`flex-row px-4 py-2 bg-transparent`}>
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
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {renderHeader()}
      <ScrollView
        style={tw`pt-2 bg-[#F8FFFE]`}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={tw`items-center justify-center mt-16`}>
            <Text style={tw`text-gray-500 mt-4 text-base`}>
              Đang tải danh sách xe...
            </Text>
          </View>
        ) : filteredVehicles.length === 0 ? (
          <View style={tw`items-center justify-center mt-16`}>
            <Ionicons name="car-outline" size={48} color="#D1D5DB" />
            <Text style={tw`text-gray-500 mt-4 text-base`}>
              Không có xe phù hợp với bộ lọc này.
            </Text>
          </View>
        ) : (
          <View>
            {renderCreateButton()}
            {renderInfoBar()}
            {renderFilterBar()}
            {filteredVehicles.map((vehicle) => (
              <DriverVehicleCard
                key={vehicle.vehicleId}
                vehicle={{
                  id: vehicle.vehicleId,
                  name: vehicle.brand + " " + vehicle.model,
                  plate: vehicle.licensePlate,
                  type: vehicle.vehicleType,
                  image: require("../../../assets/pictures/logo.png"),
                  status: vehicle.status || "Đang hoạt động",
                }}
                onPress={handleVehicleDetail}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
