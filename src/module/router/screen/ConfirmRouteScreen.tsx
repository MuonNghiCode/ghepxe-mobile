import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import tw from "twrnc";
import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouteRequest } from "src/hooks/useRouteRequest";
import { useVehicle } from "src/hooks/useVehicle";
import { useToast } from "src/hooks/useToast";
import Toast from "src/components/Toast";
import { useAuth } from "@context/AuthContext";
import { useRoute } from "src/context/RouteContext";
import UserNoteOverlay from "../components/UserNoteOverlay";
import CategorySelectOverlay from "src/module/orders/components/CategorySelectOverlay";

const defaultCategories = ["Thời trang", "Mỹ phẩm", "Khác"];
const allCategories = [
  "Thời trang",
  "Mỹ phẩm",
  "Thực phẩm",
  "Điện tử",
  "Sách vở",
  "Đồ gia dụng",
  "Đồ chơi",
  "Thể thao",
  "Nội thất",
  "Trang sức",
  "Khác",
];

export default function ConfirmRouteScreen() {
  const navigation = useNavigation();
  const { createRouteRequest, loading } = useRouteRequest();
  const { user } = useAuth();
  const { vehicles, getAllVehicles } = useVehicle();
  const { toast, showSuccess, showError, hideToast } = useToast();
  const { pickupLocation, dropoffLocation } = useRoute();

  const [showVehicleInfo, setShowVehicleInfo] = useState(true);
  const [showRouteInfo, setShowRouteInfo] = useState(true);
  const [showGoodsInfo, setShowGoodsInfo] = useState(true);

  // Vehicle info
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [maxWeight, setMaxWeight] = useState("");

  // Route info
  const [pickupAddress] = useState(
    pickupLocation?.fullAddress || "Chọn điểm đón"
  );
  const [dropoffAddress] = useState(
    dropoffLocation?.fullAddress || "Chọn điểm trả"
  );
  const [pickupLatitude] = useState(pickupLocation?.latitude || 10.762622);
  const [pickupLongitude] = useState(pickupLocation?.longitude || 106.660172);
  const [dropoffLatitude] = useState(dropoffLocation?.latitude || 10.762622);
  const [dropoffLongitude] = useState(dropoffLocation?.longitude || 106.660172);

  // Goods info
  const [supportedCommodities, setSupportedCommodities] = useState(
    defaultCategories[0]
  );
  const [cargoHandlingNotes, setCargoHandlingNotes] = useState("");
  const [showNoteOverlay, setShowNoteOverlay] = useState(false);
  const [showCategoryOverlay, setShowCategoryOverlay] = useState(false);
  const [tempNote, setTempNote] = useState("");
  const [isFullLoad, setIsFullLoad] = useState(false);
  const [temperatureControlled, setTemperatureControlled] = useState(false);
  const [minTemp, setMinTemp] = useState("");
  const [maxTemp, setMaxTemp] = useState("");

  // Additional fields
  const [departureTime] = useState(new Date().toISOString());
  const [estimatedArrivalTime] = useState(
    new Date(Date.now() + 3600000).toISOString()
  );
  const [availableWeight, setAvailableWeight] = useState("");
  const [availableVolume, setAvailableVolume] = useState("");

  React.useEffect(() => {
    getAllVehicles();
  }, []);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateStartPoint = useCallback(() => {
    navigation.navigate("RouteBilling" as never);
  }, [navigation]);

  const handleNavigateEndPoint = useCallback(() => {
    navigation.navigate("RouteShipping" as never);
  }, [navigation]);

  const handleCreateRoute = useCallback(async () => {
    // Validate
    if (!selectedVehicleId) {
      showError("Vui lòng chọn xe!");
      return;
    }
    if (!availableWeight || !availableVolume) {
      showError("Vui lòng nhập đầy đủ thông tin tải trọng và thể tích!");
      return;
    }
    if (!pickupLocation || !dropoffLocation) {
      showError("Vui lòng chọn đầy đủ địa chỉ đón và trả!");
      return;
    }

    const data = {
      driverId: user?.userId || "",
      vehicleId: selectedVehicleId,
      pickupAddress,
      dropoffAddress,
      pickupLatitude,
      pickupLongitude,
      dropoffLatitude,
      dropoffLongitude,
      departureTime,
      estimatedArrivalTime,
      isFullLoad,
      availableWeight: Number(availableWeight),
      availableVolume: Number(availableVolume),
      supportedCommodities: supportedCommodities || "Hàng hóa chung",
      cargoHandlingNotes: cargoHandlingNotes || "",
      temperatureControlled,
      minTemperatureCelsius: temperatureControlled ? Number(minTemp) || 0 : 0,
      maxTemperatureCelsius: temperatureControlled ? Number(maxTemp) || 25 : 25,
      estimatedRouteCost: 55000,
      estimatedFuelCost: 30000,
      additionalNotes: cargoHandlingNotes || "",
      routePolyline: "",
      status: "Pending",
    };

    console.log("📦 CreateRouteRequest:", data);

    const response = await createRouteRequest(data);

    console.log("📦 CreateRouteResponse:", response);

    if (response?.isSuccess) {
      showSuccess("Tạo chuyến thành công!");
      setTimeout(() => {
        navigation.navigate("DriverTrip" as never);
      }, 1200);
    } else {
      showError(response?.error?.description || "Tạo chuyến thất bại!");
    }
  }, [
    selectedVehicleId,
    availableWeight,
    availableVolume,
    user,
    pickupAddress,
    dropoffAddress,
    pickupLatitude,
    pickupLongitude,
    dropoffLatitude,
    dropoffLongitude,
    departureTime,
    estimatedArrivalTime,
    isFullLoad,
    supportedCommodities,
    cargoHandlingNotes,
    temperatureControlled,
    minTemp,
    maxTemp,
    pickupLocation,
    dropoffLocation,
    createRouteRequest,
    showSuccess,
    showError,
    navigation,
  ]);

  // --- Render functions ---
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
      <Text style={tw`text-lg font-semibold text-black flex-1 text-center`}>
        Xác nhận chuyến xe
      </Text>
      <View style={tw`w-10`} />
    </View>
  );

  const renderRouteSection = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-sm`}>
      <View style={tw`flex-row items-center mb-3`}>
        {/* <Ionicons name="location-outline" size={20} color="#00A982" /> */}
        <Text style={tw`text-base font-semibold text-black flex-1`}>
          Lộ trình
        </Text>
        <TouchableOpacity onPress={() => setShowRouteInfo((v) => !v)}>
          <Ionicons
            name={showRouteInfo ? "chevron-up" : "chevron-down"}
            size={18}
            color="#6B6B6B"
          />
        </TouchableOpacity>
      </View>
      {showRouteInfo && (
        <View style={tw`mt-2`}>
          {/* Điểm xuất phát */}
          <TouchableOpacity
            style={tw`flex-row items-start mb-4 bg-gray-50 p-3 rounded-lg`}
            onPress={handleNavigateStartPoint}
            activeOpacity={0.8}
          >
            <View
              style={tw`w-6 h-6 rounded-full bg-black items-center justify-center mt-0.5`}
            >
              <MaterialCommunityIcons name="stop" size={14} color="white" />
            </View>
            <View style={tw`flex-1 ml-3`}>
              <Text style={tw`text-xs text-gray-500 mb-1`}>Điểm đón</Text>
              <Text style={tw`text-sm text-black font-medium`}>
                {pickupAddress}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
          </TouchableOpacity>
          {/* Điểm đến */}
          <TouchableOpacity
            style={tw`flex-row items-start bg-gray-50 p-3 rounded-lg`}
            onPress={handleNavigateEndPoint}
            activeOpacity={0.8}
          >
            <View
              style={tw`w-6 h-6 rounded-full bg-[#00A982] items-center justify-center mt-0.5`}
            >
              <Ionicons name="location" size={14} color="white" />
            </View>
            <View style={tw`flex-1 ml-3`}>
              <Text style={tw`text-xs text-gray-500 mb-1`}>Điểm trả</Text>
              <Text style={tw`text-sm text-black font-medium`}>
                {dropoffAddress}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderVehicleInfoSection = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-sm`}>
      <View style={tw`flex-row items-center mb-3`}>
        {/* <MaterialCommunityIcons name="truck" size={20} color="#00A982" /> */}
        <Text style={tw`text-base font-semibold text-black flex-1`}>
          Thông tin xe <Text style={tw`text-red-500`}>*</Text>
        </Text>
        <TouchableOpacity onPress={() => setShowVehicleInfo((v) => !v)}>
          <Ionicons
            name={showVehicleInfo ? "chevron-up" : "chevron-down"}
            size={18}
            color="#6B6B6B"
          />
        </TouchableOpacity>
      </View>
      {showVehicleInfo && (
        <>
          {/* Chọn xe */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-xs text-gray-500 mb-2`}>
              Chọn xe <Text style={tw`text-red-500`}>*</Text>
            </Text>
            {vehicles.length === 0 ? (
              <View style={tw`items-center py-4`}>
                <Text style={tw`text-gray-400 text-sm`}>
                  Chưa có xe nào. Vui lòng tạo xe trước.
                </Text>
              </View>
            ) : (
              vehicles.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.vehicleId}
                  style={tw`flex-row items-center px-3 py-3 mb-2 rounded-lg border ${
                    selectedVehicleId === vehicle.vehicleId
                      ? "border-[#00A982] bg-[#E6F7F3]"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  onPress={() => {
                    setSelectedVehicleId(vehicle.vehicleId);
                    setVehicleType(vehicle.vehicleType);
                    setMaxWeight(vehicle.maxWeight.toString());
                  }}
                >
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-sm font-semibold text-black mb-1`}>
                      {vehicle.brand} {vehicle.model}
                    </Text>
                    <Text style={tw`text-xs text-gray-500`}>
                      {vehicle.licensePlate} • {vehicle.vehicleType}
                    </Text>
                  </View>
                  {selectedVehicleId === vehicle.vehicleId && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#00A982"
                    />
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Tải trọng tối đa */}
          {selectedVehicleId && (
            <View style={tw`mb-4 bg-blue-50 p-3 rounded-lg`}>
              <Text style={tw`text-xs text-gray-600 mb-1`}>
                Tải trọng tối đa
              </Text>
              <Text style={tw`text-base font-bold text-black`}>
                {maxWeight} kg
              </Text>
            </View>
          )}

          {/* Tải trọng còn trống */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-xs text-gray-500 mb-2`}>
              Tải trọng còn trống (kg) <Text style={tw`text-red-500`}>*</Text>
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-4 py-3 text-base text-black`}
              placeholder="Nhập tải trọng còn trống"
              placeholderTextColor="#9CA3AF"
              value={availableWeight}
              onChangeText={setAvailableWeight}
              keyboardType="numeric"
            />
          </View>

          {/* Thể tích còn trống */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-xs text-gray-500 mb-2`}>
              Thể tích còn trống (m³) <Text style={tw`text-red-500`}>*</Text>
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-4 py-3 text-base text-black`}
              placeholder="Nhập thể tích còn trống"
              placeholderTextColor="#9CA3AF"
              value={availableVolume}
              onChangeText={setAvailableVolume}
              keyboardType="numeric"
            />
          </View>
        </>
      )}
    </View>
  );

  // --- Render Goods Info Section ---
  const renderGoodsInfoSection = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-sm`}>
      <View style={tw`flex-row items-center mb-3`}>
        <MaterialCommunityIcons
          name="package-variant"
          size={20}
          color="#00A982"
        />
        <Text style={tw`ml-2 text-base font-semibold text-black flex-1`}>
          Thông tin hàng hóa
        </Text>
        <TouchableOpacity onPress={() => setShowGoodsInfo((v) => !v)}>
          <Ionicons
            name={showGoodsInfo ? "chevron-up" : "chevron-down"}
            size={18}
            color="#6B6B6B"
          />
        </TouchableOpacity>
      </View>
      {showGoodsInfo && (
        <>
          {/* Loại hàng hóa hỗ trợ */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-xs text-gray-500 mb-2`}>
              Loại hàng hóa hỗ trợ
            </Text>
            <View style={tw`flex-row`}>
              {defaultCategories.slice(0, -1).map((type) => {
                const isSelected = supportedCommodities === type;
                return (
                  <TouchableOpacity
                    key={type}
                    style={tw`flex-1 px-3 py-2.5 rounded-full border mr-2 ${
                      isSelected
                        ? "bg-[#E6F7F3] border-[#00A982]"
                        : "bg-white border-gray-300"
                    }`}
                    onPress={() => setSupportedCommodities(type)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={tw`text-sm text-center ${
                        isSelected
                          ? "text-[#00A982] font-semibold"
                          : "text-black"
                      }`}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {/* Nút Khác hoặc category đã chọn từ overlay */}
              <TouchableOpacity
                style={tw`flex-1 px-3 py-2.5 rounded-full border mr-2 ${
                  !defaultCategories.includes(supportedCommodities)
                    ? "bg-[#E6F7F3] border-[#00A982]"
                    : "bg-white border-gray-300"
                }`}
                onPress={() => setShowCategoryOverlay(true)}
                activeOpacity={0.8}
              >
                <Text
                  style={tw`text-sm text-center ${
                    !defaultCategories.includes(supportedCommodities)
                      ? "text-[#00A982] font-semibold"
                      : "text-black"
                  }`}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {!defaultCategories.includes(supportedCommodities)
                    ? supportedCommodities
                    : defaultCategories[defaultCategories.length - 1]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Full load checkbox */}
          <TouchableOpacity
            style={tw`flex-row items-center mb-4 bg-gray-50 p-3 rounded-lg`}
            onPress={() => setIsFullLoad(!isFullLoad)}
          >
            <Ionicons
              name={isFullLoad ? "checkbox" : "square-outline"}
              size={24}
              color="#00A982"
            />
            <Text style={tw`ml-3 text-sm text-black flex-1`}>
              Chuyến hàng đầy (Full load)
            </Text>
          </TouchableOpacity>

          {/* Temperature control */}
          <TouchableOpacity
            style={tw`flex-row items-center mb-4 bg-gray-50 p-3 rounded-lg`}
            onPress={() => setTemperatureControlled(!temperatureControlled)}
          >
            <Ionicons
              name={temperatureControlled ? "checkbox" : "square-outline"}
              size={24}
              color="#00A982"
            />
            <Text style={tw`ml-3 text-sm text-black flex-1`}>
              Kiểm soát nhiệt độ
            </Text>
          </TouchableOpacity>
          {temperatureControlled && (
            <View style={tw`flex-row gap-3 mb-4`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xs text-gray-500 mb-2`}>Min (°C)</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-lg px-4 py-3 text-base text-black`}
                  placeholder="0"
                  value={minTemp}
                  onChangeText={setMinTemp}
                  keyboardType="numeric"
                />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xs text-gray-500 mb-2`}>Max (°C)</Text>
                <TextInput
                  style={tw`border border-gray-300 rounded-lg px-4 py-3 text-base text-black`}
                  placeholder="25"
                  value={maxTemp}
                  onChangeText={setMaxTemp}
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}
          {/* Ghi chú cho tài xế */}
          <TouchableOpacity
            style={tw`flex-row items-center border-t border-gray-200 pt-3 mt-3`}
            onPress={() => {
              setTempNote(cargoHandlingNotes ?? "");
              setShowNoteOverlay(true);
            }}
          >
            <Ionicons name="document-text-outline" size={18} color="#6B6B6B" />
            <Text style={tw`ml-2 text-sm text-black flex-1`}>
              Ghi chú cho khách hàng
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
          </TouchableOpacity>
          {cargoHandlingNotes ? (
            <View
              style={tw`mt-2 px-2 py-2 bg-gray-100 rounded-lg flex-row items-center`}
            >
              <Text style={tw`text-sm text-gray-700 flex-1`}>
                {cargoHandlingNotes}
              </Text>
              <TouchableOpacity
                style={tw`ml-2 px-2 py-1`}
                onPress={() => setCargoHandlingNotes("")}
              >
                <Ionicons name="close-circle" size={18} color="#FF4D4F" />
              </TouchableOpacity>
            </View>
          ) : null}
        </>
      )}
    </View>
  );

  const renderFooter = () => (
    <View style={tw`bg-white px-4 py-4 border-t border-gray-100`}>
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <Text style={tw`text-sm text-gray-600`}>Chi phí ước tính</Text>
        <Text style={tw`text-xl text-[#00A982] font-bold`}>₫55.000</Text>
      </View>
      <TouchableOpacity
        style={tw`bg-[#00A982] py-4 rounded-xl ${loading ? "opacity-50" : ""}`}
        onPress={handleCreateRoute}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={tw`text-white text-center font-bold text-base`}>
          {loading ? "Đang tạo chuyến..." : "Tạo chuyến"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F8FFFE]`}>
      {renderHeader()}
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-6`}
        showsVerticalScrollIndicator={false}
      >
        {renderRouteSection()}
        {renderVehicleInfoSection()}
        {renderGoodsInfoSection()}
      </ScrollView>
      {renderFooter()}
      <Toast {...toast} onHide={hideToast} />
      <UserNoteOverlay
        visible={showNoteOverlay}
        value={tempNote}
        onChange={setTempNote}
        onCancel={() => setShowNoteOverlay(false)}
        onOk={() => {
          setCargoHandlingNotes(tempNote);
          setShowNoteOverlay(false);
        }}
      />
      {/* Overlay chọn category */}
      <CategorySelectOverlay
        visible={showCategoryOverlay}
        categories={allCategories}
        selected={supportedCommodities}
        onSelect={(value) => {
          setSupportedCommodities(value);
          setShowCategoryOverlay(false);
        }}
        onCancel={() => setShowCategoryOverlay(false)}
      />
    </SafeAreaView>
  );
}
