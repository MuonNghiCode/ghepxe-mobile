import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVehicle } from "src/hooks/useVehicle";
import { useAuth } from "@context/AuthContext";
import { useToast } from "src/hooks/useToast";
import Toast from "src/components/Toast";

const VEHICLE_TYPE_OPTIONS = [
  { label: "Xe máy", value: "MOTORCYCLE" },
  { label: "Xe bán tải", value: "PICKUP" },
  { label: "Xe tải", value: "TRUCK" },
];

export default function CreateVehicleScreen() {
  const navigation = useNavigation();
  const { createVehicle, loading } = useVehicle();
  const { user } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [licensePlate, setLicensePlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [vehicleType, setVehicleType] = useState("MOTORCYCLE");
  const [maxWeight, setMaxWeight] = useState("");
  const [maxVolume, setMaxVolume] = useState("");
  const [maxSeats, setMaxSeats] = useState("");

  const handleGoBack = () => navigation.goBack();

  const handleSubmit = async () => {
    // Validate dữ liệu
    if (
      !licensePlate ||
      !brand ||
      !model ||
      !year ||
      !color ||
      !maxWeight ||
      !maxVolume ||
      !maxSeats
    ) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông tin xe!");
      return;
    }

    const data = {
      driverId: user?.userId || "", // Lấy từ user context
      licensePlate,
      brand,
      model,
      year: Number(year),
      color,
      vehicleType,
      maxWeight: Number(maxWeight),
      maxVolume: Number(maxVolume),
      maxSeats: Number(maxSeats),
    };

    const response = await createVehicle(data);

    if (response?.isSuccess) {
      showSuccess("Tạo xe thành công!");
      setTimeout(() => navigation.goBack(), 1200);
    } else {
      showError(response?.error?.description || "Tạo xe thất bại!");
    }
  };

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
        Tạo xe mới
      </Text>
      <View style={tw`w-10 h-10`} />
    </View>
  );

  // Card thông tin cơ bản
  const renderBasicInfoCard = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-lg`}>
      <Text style={tw`text-base font-semibold text-black mb-3`}>
        Thông tin cơ bản
      </Text>
      {/* Biển số xe */}
      <Text style={tw`text-xs text-gray-500 mb-1`}>
        Biển số xe <Text style={tw`text-[#00A982]`}>*</Text>
      </Text>
      <TextInput
        style={tw`bg-gray-50 rounded-lg px-3 py-2 mb-3 border border-gray-200`}
        placeholder="Nhập biển số xe"
        value={licensePlate}
        onChangeText={setLicensePlate}
      />
      {/* Hãng xe */}
      <Text style={tw`text-xs text-gray-500 mb-1`}>
        Hãng xe <Text style={tw`text-[#00A982]`}>*</Text>
      </Text>
      <TextInput
        style={tw`bg-gray-50 rounded-lg px-3 py-2 mb-3 border border-gray-200`}
        placeholder="Nhập hãng xe"
        value={brand}
        onChangeText={setBrand}
      />
      {/* Dòng xe */}
      <Text style={tw`text-xs text-gray-500 mb-1`}>
        Dòng xe <Text style={tw`text-[#00A982]`}>*</Text>
      </Text>
      <TextInput
        style={tw`bg-gray-50 rounded-lg px-3 py-2 mb-3 border border-gray-200`}
        placeholder="Nhập dòng xe"
        value={model}
        onChangeText={setModel}
      />
      {/* Năm sản xuất */}
      <Text style={tw`text-xs text-gray-500 mb-1`}>
        Năm sản xuất <Text style={tw`text-[#00A982]`}>*</Text>
      </Text>
      <TextInput
        style={tw`bg-gray-50 rounded-lg px-3 py-2 mb-3 border border-gray-200`}
        placeholder="VD: 2022"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
      />
      {/* Màu xe */}
      <Text style={tw`text-xs text-gray-500 mb-1`}>
        Màu xe <Text style={tw`text-[#00A982]`}>*</Text>
      </Text>
      <TextInput
        style={tw`bg-gray-50 rounded-lg px-3 py-2 mb-1 border border-gray-200`}
        placeholder="Nhập màu xe"
        value={color}
        onChangeText={setColor}
      />
    </View>
  );

  // Card loại xe
  const renderTypeCard = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-lg`}>
      <Text style={tw`text-base font-semibold text-black mb-3`}>Loại xe</Text>
      <View style={tw`flex-row`}>
        {VEHICLE_TYPE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={tw.style(
              "px-4 py-2 rounded-full mr-2",
              vehicleType === option.value ? "bg-[#00A982]" : "bg-gray-100"
            )}
            onPress={() => setVehicleType(option.value)}
          >
            <Text
              style={tw.style(
                "text-xs font-semibold",
                vehicleType === option.value ? "text-white" : "text-gray-700"
              )}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // Card thông số kỹ thuật
  const renderSpecCard = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-lg`}>
      <Text style={tw`text-base font-semibold text-black mb-3`}>
        Thông số kỹ thuật
      </Text>
      {/* Trọng tải tối đa */}
      <Text style={tw`text-xs text-gray-500 mb-1`}>
        Trọng tải tối đa (kg) <Text style={tw`text-[#00A982]`}>*</Text>
      </Text>
      <TextInput
        style={tw`bg-gray-50 rounded-lg px-3 py-2 mb-3 border border-gray-200`}
        placeholder="VD: 1500"
        value={maxWeight}
        onChangeText={setMaxWeight}
        keyboardType="numeric"
      />
      {/* Thể tích tối đa */}
      <Text style={tw`text-xs text-gray-500 mb-1`}>
        Thể tích tối đa (m³) <Text style={tw`text-[#00A982]`}>*</Text>
      </Text>
      <TextInput
        style={tw`bg-gray-50 rounded-lg px-3 py-2 mb-3 border border-gray-200`}
        placeholder="VD: 12"
        value={maxVolume}
        onChangeText={setMaxVolume}
        keyboardType="numeric"
      />
      {/* Số ghế tối đa */}
      <Text style={tw`text-xs text-gray-500 mb-1`}>
        Số ghế tối đa <Text style={tw`text-[#00A982]`}>*</Text>
      </Text>
      <TextInput
        style={tw`bg-gray-50 rounded-lg px-3 py-2 mb-1 border border-gray-200`}
        placeholder="VD: 2"
        value={maxSeats}
        onChangeText={setMaxSeats}
        keyboardType="numeric"
      />
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F8FFFE]`}>
      {renderHeader()}
      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {renderBasicInfoCard()}
        {renderTypeCard()}
        {renderSpecCard()}
        <View style={tw`mx-4 mt-6 mb-8`}>
          <TouchableOpacity
            style={tw`bg-[#00A982] rounded-full py-3 items-center shadow`}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Text style={tw`text-white font-bold text-base`}>
              {loading ? "Đang tạo xe..." : "Tạo xe"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast {...toast} onHide={hideToast} />
    </SafeAreaView>
  );
}
