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
import ParticleBackground from "@components/ParticleBackground";
import DriverNoteOverlay from "../components/DriverNoteOverlay";
import ServiceSelectOverlay from "../components/ServiceSelectOverlay";
import GoodsTypeOverlay from "../components/GoodsTypeOverlay";
import PickupTimeOverlay from "../components/PickupTimeOverlay";
import PaymentDetailOverlay from "../components/PaymnetDetailOverlay";

const specialRequests = [
  { label: "Giao hàng về", value: "120,000" },
  { label: "Bốc hàng", value: "50,000" },
  { label: "Hỗ trợ tài xế", value: "30,000" },
  { label: "Nhắn tin SMS", value: "10,000" },
  { label: "Xuất hóa đơn điện tử", value: "5,000" },
];

const sizes = ["S", "M", "L", "XL", "2XL", "3XL"];
const categories = ["Thời trang", "Mỹ phẩm", "Khác"];

export default function ConfirmOrderScreen() {
  const navigation = useNavigation();
  const [showGoodsInfo, setShowGoodsInfo] = useState(true);
  const [showNoteOverlay, setShowNoteOverlay] = useState(false);
  const [driverNote, setDriverNote] = useState("");
  const [tempNote, setTempNote] = useState("");
  const [showServiceOverlay, setShowServiceOverlay] = useState(false);
  const [serviceType, setServiceType] = useState("single");
  const [showGoodsTypeOverlay, setShowGoodsTypeOverlay] = useState(false);
  const [goodsType, setGoodsType] = useState("private");
  const [showPickupTimeOverlay, setShowPickupTimeOverlay] = useState(false);
  const [pickupTime, setPickupTime] = useState("standard");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [totalFee, setTotalFee] = useState(55000);
  const [showPaymentDetail, setShowPaymentDetail] = useState(false);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [otherCategory, setOtherCategory] = useState("");
  const [weightRaw, setWeightRaw] = useState("");

  interface SpecialRequest {
    label: string;
    value: string;
  }

  const handleToggleRequest = (item: SpecialRequest) => {
    const value: number = parseInt(item.value.replace(/\D/g, ""), 10);
    if (selectedRequests.includes(item.label)) {
      setSelectedRequests(selectedRequests.filter((r) => r !== item.label));
      setTotalFee((fee) => fee - value);
    } else {
      setSelectedRequests([...selectedRequests, item.label]);
      setTotalFee((fee) => fee + value);
    }
  };

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleNavigateBillingAddress = useCallback(() => {
    navigation.navigate("OrderBilling" as never);
  }, [navigation]);

  const handleNavigateShippingAddress = useCallback(() => {
    navigation.navigate("OrderShipping" as never);
  }, [navigation]);

  const handleMatchRoute = useCallback(() => {
    navigation.navigate("Matching" as never);
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
        Chi tiết đơn hàng
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
        <TouchableOpacity
          style={tw`flex-row items-center mb-4`}
          onPress={handleNavigateBillingAddress}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="stop"
            size={14}
            color="white"
            style={tw`bg-black rounded-full p-1 `}
          />
          <Text style={tw`ml-2 text-base flex-1 text-black font-medium `}>
            XV44+7R Thành Phố XXX
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center`}
          onPress={handleNavigateShippingAddress}
          activeOpacity={0.8}
        >
          <Entypo
            name="arrow-down"
            size={14}
            color="#fff"
            style={tw`bg-[#00A982] rounded-full p-1 `}
          />
          <Text style={tw`ml-2 text-base flex-1 text-black font-medium`}>
            XV44+7R Thành Phố XXX
          </Text>
          <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderServiceSection = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-lg`}>
      <TouchableOpacity
        style={tw`flex-row items-center mb-4`}
        onPress={() => setShowServiceOverlay(true)}
        activeOpacity={0.8}
      >
        {serviceType === "single" ? (
          <Ionicons
            name="cube-outline"
            size={24}
            color="#3B82F6"
            style={tw`w-6 h-6 rounded-full bg-[#E6F0FE] items-center justify-center`}
          />
        ) : (
          <Ionicons
            name="albums-outline"
            size={24}
            color="#8B5CF6"
            style={tw`w-6 h-6 rounded-full bg-[#F3E8FF] items-center justify-center`}
          />
        )}
        <View style={tw`ml-2 flex-1`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`text-base font-semibold text-black`}>
              {serviceType === "single" ? "Đơn lẻ" : "Đơn ghép"}
            </Text>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color="#6B6B6B"
              style={tw`ml-1`}
            />
          </View>
          <Text style={tw`text-xs text-gray-500`}>
            {serviceType === "single" ? "Nhanh chóng" : "Tiết kiệm"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`flex-row items-center`}
        onPress={() => setShowPickupTimeOverlay(true)}
        activeOpacity={0.8}
      >
        <Ionicons name="calendar-outline" size={22} color="#6B6B6B" />
        <View style={tw`ml-2 flex-1`}>
          <Text style={tw`text-base font-semibold text-black`}>
            Thời gian lấy hàng
          </Text>
          <Text style={tw`text-xs text-gray-500`}>
            {pickupTime === "standard"
              ? "Tiêu chuẩn (Lấy hàng trong ngày)"
              : pickupTime === "express"
              ? "Hoả tốc (Lấy hàng trong 2 giờ)"
              : "Chậm (Lấy hàng trong 24 giờ)"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
      </TouchableOpacity>
    </View>
  );

  const renderGoodsInfoSection = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-lg`}>
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
          {/* Hàng hóa tư nhân */}
          <TouchableOpacity
            style={tw`flex-row items-center mb-4`}
            onPress={() => setShowGoodsTypeOverlay(true)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={
                goodsType === "private" ? "briefcase-outline" : "person-outline"
              }
              size={20}
              color={goodsType === "private" ? "#00A982" : "#3B82F6"}
              style={tw`w-5.5 h-5.5 rounded-full  items-center justify-center`}
            />
            <Text style={tw`ml-2 text-sm text-black`}>
              {goodsType === "private"
                ? "Hàng hóa tư nhân"
                : "Hàng hóa cá nhân"}
            </Text>
            <Ionicons
              name="information-circle-outline"
              size={14}
              color="#6B6B6B"
              style={tw`ml-1`}
            />
            <View style={tw`flex-1`} />
            <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
          </TouchableOpacity>
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
                placeholder="kg"
                placeholderTextColor="#6B6B6B"
                value={
                  weightRaw.length > 0
                    ? `${parseInt(weightRaw, 10).toLocaleString()} kg`
                    : ""
                }
                onChangeText={(text) => {
                  const onlyNumber = text.replace(/[^0-9]/g, "");
                  setWeightRaw(onlyNumber);
                }}
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
          {/* Ghi chú cho tài xế */}
          <TouchableOpacity
            style={tw`flex-row items-center border-t border-gray-200 pt-3`}
            onPress={() => {
              setTempNote(driverNote);
              setShowNoteOverlay(true);
            }}
          >
            <Ionicons name="document-text-outline" size={18} color="#6B6B6B" />
            <Text style={tw`ml-2 text-sm text-black flex-1`}>
              Ghi chú cho tài xế
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
          </TouchableOpacity>
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

  const renderSpecialRequestSection = () => (
    <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4 shadow-lg`}>
      <Text style={tw`text-base font-semibold text-black mb-2`}>
        Yêu cầu đặc biệt
      </Text>
      {specialRequests.map((item) => {
        const isSelected = selectedRequests.includes(item.label);
        return (
          <View
            key={item.label}
            style={tw`flex-row items-center justify-between border border-gray-300 rounded-xl px-3 py-2 mb-2`}
          >
            <View style={tw`flex-col flex-1`}>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-base text-black`}>{item.label}</Text>
                <TouchableOpacity activeOpacity={0.7} style={tw`ml-1`}>
                  <Ionicons
                    name="information-circle-outline"
                    size={14}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              <Text style={tw`text-xs text-gray-500 mt-1`}>{item.value}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleToggleRequest(item)}
            >
              <View
                style={tw`w-6 h-6 ${
                  isSelected ? "bg-red-500" : "bg-[#00A982]"
                } rounded-full items-center justify-center`}
              >
                <Ionicons
                  name={isSelected ? "close" : "add"}
                  size={16}
                  color="white"
                />
              </View>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );

  const renderFooter = () => (
    <View style={tw`bg-white rounded-t-2xl mt-4 px-4 pt-2 pb-4`}>
      <View style={tw`flex-row border-b border-gray-200`}>
        <TouchableOpacity
          style={tw`flex-1 flex-row items-center justify-center py-3`}
        >
          <Ionicons name="pricetag-outline" size={18} color="#00A982" />
          <Text style={tw`ml-2 text-base font-semibold text-black`}>
            KHUYẾN MÃI
          </Text>
        </TouchableOpacity>
        <View style={tw`w-[1px] bg-gray-200`} />
        <TouchableOpacity
          style={tw`flex-1 flex-row items-center justify-center py-3`}
        >
          <Ionicons name="card-outline" size={18} color="#00A982" />
          <Text style={tw`ml-2 text-base font-semibold text-black`}>
            THANH TOÁN
          </Text>
        </TouchableOpacity>
      </View>
      <View style={tw`flex-row items-center justify-between my-4`}>
        <View style={tw`flex-row items-center`}>
          <Text
            style={tw`text-base text-black font-semibold`}
            numberOfLines={1}
          >
            Tổng phí
          </Text>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color="#6B6B6B"
            style={tw`ml-1`}
            onPress={() => setShowPaymentDetail(true)}
          />
        </View>
        <Text style={tw`text-xl text-[#00A982] font-bold`}>
          ₫{totalFee.toLocaleString()}
        </Text>
      </View>
      <View style={tw`flex-row`}>
        <TouchableOpacity style={tw`flex-1 bg-[#00A982] py-3 rounded-xl mr-2`}>
          <Text style={tw`text-white text-center font-bold text-base`}>
            Tạo đơn
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 bg-white border border-[#00A982] py-3 rounded-xl ml-2`}
          onPress={handleMatchRoute}
          activeOpacity={0.8}
        >
          <Text style={tw`text-[#00A982] text-center font-bold text-base`}>
            Tìm chuyến
          </Text>
        </TouchableOpacity>
      </View>
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
        <View style={{ position: "relative", minHeight: 1200 }}>
          {/* <ParticleBackground count={10} height={1500} /> */}
          <View style={{ position: "relative", zIndex: 1 }}>
            {renderRouteSection()}
            {renderServiceSection()}
            {renderGoodsInfoSection()}
            {renderSpecialRequestSection()}
          </View>
        </View>
      </ScrollView>

      <DriverNoteOverlay
        visible={showNoteOverlay}
        value={tempNote}
        onChange={setTempNote}
        onCancel={() => setShowNoteOverlay(false)}
        onOk={() => {
          setDriverNote(tempNote);
          setShowNoteOverlay(false);
        }}
      />

      <ServiceSelectOverlay
        visible={showServiceOverlay}
        selected={serviceType}
        onSelect={(value) => {
          setServiceType(value);
          setShowServiceOverlay(false);
        }}
        onCancel={() => setShowServiceOverlay(false)}
      />

      <GoodsTypeOverlay
        visible={showGoodsTypeOverlay}
        selected={goodsType}
        onSelect={(value) => {
          setGoodsType(value);
          setShowGoodsTypeOverlay(false);
        }}
        onCancel={() => setShowGoodsTypeOverlay(false)}
      />

      <PickupTimeOverlay
        visible={showPickupTimeOverlay}
        selected={pickupTime}
        onSelect={(value) => {
          setPickupTime(value);
          setShowPickupTimeOverlay(false);
        }}
        onCancel={() => setShowPickupTimeOverlay(false)}
      />

      <PaymentDetailOverlay
        visible={showPaymentDetail}
        baseFee={55000}
        specialRequests={specialRequests}
        selectedRequests={selectedRequests}
        totalFee={totalFee}
        onClose={() => setShowPaymentDetail(false)}
      />

      {renderFooter()}
    </SafeAreaView>
  );
}
