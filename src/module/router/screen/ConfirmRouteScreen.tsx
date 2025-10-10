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
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserNoteOverlay from "../components/UserNoteOverlay";

const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];
const categories = ["Thời trang", "Mỹ phẩm", "Khác"];

export default function ConfirmRouteScreen() {
  const navigation = useNavigation();
  const [showVehicleInfo, setShowVehicleInfo] = useState(true);
  const [showGoodsInfo, setShowGoodsInfo] = useState(true);
  const [vehicleType, setVehicleType] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [maxWeight, setMaxWeight] = useState("");

  // Goods info states
  const [showNoteOverlay, setShowNoteOverlay] = useState(false);
  const [driverNote, setDriverNote] = useState("");
  const [tempNote, setTempNote] = useState("");
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [otherCategory, setOtherCategory] = useState("");
  const [weightRaw, setWeightRaw] = useState("");

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateStartPoint = useCallback(() => {
    navigation.navigate("RouteBilling" as never);
  }, [navigation]);

  const handleNavigateEndPoint = useCallback(() => {
    navigation.navigate("RouteShipping" as never);
  }, [navigation]);

  const handleCreateRoute = useCallback(() => {
    navigation.navigate("DriverTrip" as never);
  }, [navigation]);

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
        Chi tiết chuyến xe
      </Text>
      <TouchableOpacity style={tw`w-10 h-10 items-center justify-center`}>
        <Feather name="file-plus" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  const renderRouteSection = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-lg`}>
      <View style={tw`flex-row items-center mb-2`}>
        <Text style={tw`text-base font-semibold text-black`}>Lộ trình</Text>
        <View style={tw`flex-1`} />
        <FontAwesome5
          name="exchange-alt"
          size={16}
          color="black"
          style={{ transform: [{ rotate: "90deg" }] }}
        />
        <Text style={tw`ml-1 text-base font-semibold text-black`}>
          Hoán đổi
        </Text>
      </View>
      <View style={tw`mt-2`}>
        {/* Điểm xuất phát */}
        <TouchableOpacity
          style={tw`flex-row items-center mb-4`}
          onPress={handleNavigateStartPoint}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="stop"
            size={14}
            color="white"
            style={tw`bg-black rounded-full p-1`}
          />
          <Text style={tw`ml-2 text-base flex-1 text-black font-medium`}>
            XV44+7R Thành Phố XXX
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
        </TouchableOpacity>
        {/* Điểm đến */}
        <TouchableOpacity
          style={tw`flex-row items-center`}
          onPress={handleNavigateEndPoint}
          activeOpacity={0.8}
        >
          <Entypo
            name="arrow-down"
            size={14}
            color="#fff"
            style={tw`bg-[#00A982] rounded-full p-1`}
          />
          <Text style={tw`ml-2 text-base flex-1 text-black font-medium`}>
            XV44+7R Thành Phố XXX
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderVehicleInfoSection = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-lg`}>
      <View style={tw`flex-row items-center mb-3`}>
        <MaterialCommunityIcons name="car" size={20} color="#00A982" />
        <Text style={tw`ml-2 text-base font-semibold text-black`}>
          Thông tin xe <Text style={tw`text-[#00A982]`}>*</Text>
        </Text>
        <Ionicons
          name="information-circle-outline"
          size={14}
          color="#6B6B6B"
          style={tw`ml-1`}
        />
        <View style={tw`flex-1`} />
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
          {/* Loại xe */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-xs text-gray-500 mb-2`}>
              Loại xe <Text style={tw`text-[#00A982]`}>*</Text>
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 text-base text-black`}
              placeholder="Nhập loại xe"
              placeholderTextColor="#6B6B6B"
              value={vehicleType}
              onChangeText={setVehicleType}
            />
          </View>
          {/* Kích thước lòng thùng */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-xs text-gray-500 mb-2`}>
              Kích thước lòng thùng <Text style={tw`text-[#00A982]`}>*</Text>
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 text-base text-black`}
              placeholder="Nhập kích thước"
              placeholderTextColor="#6B6B6B"
              value={dimensions}
              onChangeText={setDimensions}
            />
          </View>
          {/* Tải trọng tối đa */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-xs text-gray-500 mb-2`}>
              Tải trọng tối đa (kg) <Text style={tw`text-[#00A982]`}>*</Text>
            </Text>
            <TextInput
              style={tw`border border-gray-300 rounded-lg px-3 py-2 text-base text-black`}
              placeholder="Nhập khối lượng"
              placeholderTextColor="#6B6B6B"
              value={maxWeight}
              onChangeText={setMaxWeight}
              keyboardType="numeric"
            />
          </View>
        </>
      )}
    </View>
  );

  const renderGoodsInfoSection = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-lg`}>
      {/* Header */}
      <View style={tw`flex-row items-center mb-3`}>
        <MaterialCommunityIcons
          name="package-variant"
          size={20}
          color="#00A982"
        />
        <Text style={tw`ml-2 text-base font-semibold text-black`}>
          Thông tin hàng hóa <Text style={tw`text-[#00A982]`}>*</Text>
        </Text>
        <Ionicons
          name="information-circle-outline"
          size={14}
          color="#6B6B6B"
          style={tw`ml-1`}
        />
        <View style={tw`flex-1`} />
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
          {/* Kích cỡ */}
          <View style={tw`mb-4`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Text style={tw`text-xs text-gray-500 flex-1`}>
                Kích cỡ <Text style={tw`text-[#00A982]`}>*</Text>
              </Text>
              <TouchableOpacity>
                <Text style={tw`text-xs text-[#00A982]`}>Xem hình ảnh</Text>
              </TouchableOpacity>
            </View>
            <Text style={tw`text-xs text-gray-400 mb-2`}>
              Tối đa 25x32x12 cm
            </Text>
            <View style={tw`flex-row justify-between`}>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={tw`w-12 h-12 rounded-full border items-center justify-center ${
                    selectedSize === size
                      ? "bg-[#E6F7F3] border-[#00A982]"
                      : "bg-white border-gray-300"
                  }`}
                  onPress={() => setSelectedSize(size)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={tw`text-sm ${
                      selectedSize === size
                        ? "text-[#00A982] font-semibold"
                        : "text-black"
                    }`}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Khối lượng */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-xs text-gray-500 mb-1`}>
              Khối lượng (kg) <Text style={tw`text-[#00A982]`}>*</Text>
            </Text>
            <View style={tw`relative`}>
              <TextInput
                style={tw`flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base text-black pr-10`}
                placeholder="Nhập khối lượng"
                placeholderTextColor="#6B6B6B"
                value={weightRaw}
                onChangeText={setWeightRaw}
                keyboardType="numeric"
              />
              {weightRaw.length > 0 && (
                <TouchableOpacity
                  style={tw`absolute right-3 top-1/2 -translate-y-1/2`}
                  onPress={() => setWeightRaw("")}
                >
                  <Ionicons name="close-circle" size={22} color="#FF4D4F" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* Loại hàng hóa */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-xs text-gray-500 mb-2`}>
              Loại hàng hóa <Text style={tw`text-[#00A982]`}>*</Text>
            </Text>
            <View style={tw`flex-row`}>
              {categories.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={tw`px-4 py-2 rounded-full border mr-2 ${
                    selectedCategory === type
                      ? "bg-[#E6F7F3] border-[#00A982]"
                      : "bg-white border-gray-300"
                  }`}
                  onPress={() => setSelectedCategory(type)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={tw`text-sm ${
                      selectedCategory === type
                        ? "text-[#00A982] font-semibold"
                        : "text-black"
                    }`}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {selectedCategory === "Khác" && (
              <View style={tw`flex-row items-center mt-2 relative`}>
                <TextInput
                  style={tw`flex-1 border border-gray-300 rounded-lg px-3 py-2 text-base text-black pr-10`}
                  placeholder="Nhập loại hàng hóa khác"
                  placeholderTextColor="#6B6B6B"
                  value={otherCategory}
                  onChangeText={setOtherCategory}
                />
                {otherCategory.length > 0 && (
                  <TouchableOpacity
                    style={tw`absolute right-3`}
                    onPress={() => setOtherCategory("")}
                  >
                    <Ionicons name="close-circle" size={22} color="#FF4D4F" />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          {/* Ghi chú cho khách hàng */}
          <TouchableOpacity
            style={tw`flex-row items-center border-t border-gray-200 pt-3`}
            onPress={() => {
              setTempNote(driverNote);
              setShowNoteOverlay(true);
            }}
          >
            <Ionicons name="document-text-outline" size={18} color="#6B6B6B" />
            <Text style={tw`ml-2 text-sm text-black flex-1`}>
              Ghi chú cho khách hàng
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
          </TouchableOpacity>
          {/* Hiện ghi chú nếu có */}
          {driverNote ? (
            <View
              style={tw`mt-2 px-2 py-2 bg-gray-100 rounded-lg flex-row items-center`}
            >
              <Text style={tw`text-sm text-gray-700 flex-1`}>{driverNote}</Text>
              <TouchableOpacity
                style={tw`ml-2 px-2 py-1`}
                onPress={() => setDriverNote("")}
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
    <View style={tw`bg-white px-4 pt-4 pb-4`}>
      <View style={tw`flex-row items-center justify-between my-4`}>
        <View style={tw`flex-row items-center`}>
          <Text
            style={tw`text-base text-black font-semibold`}
            numberOfLines={1}
          >
            Chi phí ước tính
          </Text>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color="#6B6B6B"
            style={tw`ml-1`}
          />
        </View>
        <Text style={tw`text-xl text-[#00A982] font-bold`}>₫55.000</Text>
      </View>
      {/* Nút tạo chuyến */}
      <TouchableOpacity
        style={tw`bg-[#00A982] py-3 rounded-xl`}
        onPress={handleCreateRoute}
        activeOpacity={0.8}
      >
        <Text style={tw`text-white text-center font-bold text-base`}>
          Tạo chuyến
        </Text>
      </TouchableOpacity>
    </View>
  );

  // --- Main render ---
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {renderHeader()}
      <ScrollView
        style={tw`flex-1 bg-[#F8FFFE]`}
        contentContainerStyle={tw`pb-6`}
      >
        <View style={{ position: "relative", minHeight: 800 }}>
          <View style={{ position: "relative", zIndex: 1 }}>
            {renderRouteSection()}
            {renderVehicleInfoSection()}
            {renderGoodsInfoSection()}
          </View>
        </View>
      </ScrollView>
      <UserNoteOverlay
        visible={showNoteOverlay}
        value={tempNote}
        onChange={setTempNote}
        onCancel={() => setShowNoteOverlay(false)}
        onOk={() => {
          setDriverNote(tempNote);
          setShowNoteOverlay(false);
        }}
      />
      {renderFooter()}
    </SafeAreaView>
  );
}
