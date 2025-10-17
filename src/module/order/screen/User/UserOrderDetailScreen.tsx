import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import {
  Entypo,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderMap } from "src/components/OrderMap";
import {
  OrderStatus,
  StatusConfig,
  UserOrderDetailScreenParams,
} from "src/types/order.interface";
import { ShipRequestResponseData } from "src/types";

type UserOrderDetailScreenRouteProp = RouteProp<
  { params: UserOrderDetailScreenParams },
  "params"
>;

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  waiting: {
    header: "Đơn hàng của bạn đang được chờ tài xế",
    icon: "chatbubble-ellipses-outline",
    headerColor: "#00A982",
    showCancel: true,
    showReport: false,
    showReorder: false,
    showChat: true,
    showCall: true,
    statusText: "Đang chờ xác nhận",
    statusColor: "#6B6B6B",
    statusBg: "bg-gray-100",
    buttonText: "HỦY CHUYẾN",
    buttonColor: "#FF3B30",
  },
  delivering: {
    header: "Đơn hàng của bạn đang được giao",
    icon: "chatbubble-ellipses-outline",
    headerColor: "#00A982",
    showCancel: true,
    showReport: false,
    showReorder: false,
    showChat: true,
    showCall: true,
    statusText: "Đang giao",
    statusColor: "#00A982",
    statusBg: "bg-[#E6F7F3]",
    buttonText: "HỦY CHUYẾN",
    buttonColor: "#FF3B30",
  },
  delivered: {
    header: "Đơn hàng của bạn đã được giao thành công",
    icon: "checkmark-circle-outline",
    headerColor: "#00A982",
    showCancel: false,
    showReport: true,
    showReorder: true,
    showChat: false,
    showCall: false,
    statusText: "Đã hoàn thành",
    statusColor: "#00A982",
    statusBg: "bg-[#E6F7F3]",
    buttonText: "ĐẶT LẠI ĐƠN HÀNG",
    buttonColor: "#00A982",
    reportText: "BÁO CÁO ĐƠN HÀNG",
    reportColor: "#FF3B30",
  },
  cancelled: {
    header: "Đơn hàng của bạn đã được huỷ",
    icon: "close-circle-outline",
    headerColor: "#FF3B30",
    showCancel: false,
    showReport: true,
    showReorder: true,
    showChat: false,
    showCall: false,
    statusText: "Đã huỷ",
    statusColor: "#FF3B30",
    statusBg: "bg-gray-100",
    buttonText: "ĐẶT LẠI ĐƠN HÀNG",
    buttonColor: "#00A982",
    reportText: "BÁO CÁO ĐƠN HÀNG",
    reportColor: "#FF3B30",
  },
};

const STATUS_IMAGE = {
  waiting: require("../../../../assets/icons/pending.png"),
  delivering: require("../../../../assets/icons/pending.png"),
  delivered: require("../../../../assets/icons/complete.png"),
  cancelled: require("../../../../assets/icons/cancelled.png"),
};

export default function UserOrderDetailScreen() {
  const route = useRoute<UserOrderDetailScreenRouteProp>();
  const navigation = useNavigation();

  // Lấy data trực tiếp từ params
  const [orderData, setOrderData] = useState<ShipRequestResponseData | null>(
    route.params?.orderData || null
  );

  const shipRequestId = route.params?.shipRequestId || route.params?.id;

  // Debug log
  useEffect(() => {
    console.log("Route params:", route.params);
    console.log("Order data from params:", route.params?.orderData);
    console.log("ShipRequestId:", shipRequestId);
  }, [route.params, shipRequestId]);

  // Nếu không có data trong params, thử load từ API (optional)
  useEffect(() => {
    if (!orderData && shipRequestId) {
      console.log("No order data in params, need to fetch from API");
      // Bạn có thể implement API call ở đây nếu cần
    }
  }, [orderData, shipRequestId]);

  // Xác định order status
  const getOrderStatus = (): OrderStatus => {
    return (route.params?.orderStatus as OrderStatus) || "waiting";
  };

  const config = STATUS_CONFIG[getOrderStatus()];

  const driver = {
    name: "Phạm Minh Quân",
    phone: "098.xxx.xxxx",
  };

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Tính tổng giá trị đơn hàng
  const calculateTotalPrice = () => {
    if (!orderData?.items) return 0;
    return orderData.items.length * 55000;
  };

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
      <View style={tw`w-10 h-10`} />
    </View>
  );

  const renderOrderMap = () => {
    if (!orderData) return null;

    try {
      const pickupLat = Number(orderData.pickupLatitude);
      const pickupLng = Number(orderData.pickupLongitude);
      const dropoffLat = Number(orderData.dropoffLatitude);
      const dropoffLng = Number(orderData.dropoffLongitude);

      if (
        isNaN(pickupLat) ||
        isNaN(pickupLng) ||
        isNaN(dropoffLat) ||
        isNaN(dropoffLng) ||
        pickupLat === 0 ||
        pickupLng === 0 ||
        dropoffLat === 0 ||
        dropoffLng === 0
      ) {
        return (
          <View style={tw`h-60 bg-gray-200 items-center justify-center`}>
            <Ionicons name="map-outline" size={48} color="#9CA3AF" />
            <Text style={tw`mt-2 text-gray-500 text-sm`}>
              Không có thông tin bản đồ
            </Text>
          </View>
        );
      }

      return (
        <OrderMap
          pickupCoordinates={{
            latitude: pickupLat,
            longitude: pickupLng,
          }}
          deliveryCoordinates={{
            latitude: dropoffLat,
            longitude: dropoffLng,
          }}
          pickupAddress={`${orderData.pickupStreet}, ${orderData.pickupDistrict}, ${orderData.pickupProvince}`}
          deliveryAddress={`${orderData.dropoffStreet}, ${orderData.dropoffDistrict}, ${orderData.dropoffProvince}`}
          orderStatus={getOrderStatus()}
          statusImage={STATUS_IMAGE[getOrderStatus()]}
          enableVietnameseRoute={true}
          orderType="single"
        />
      );
    } catch (error) {
      console.error("Error rendering map:", error);
      return (
        <View style={tw`h-60 bg-gray-200 items-center justify-center`}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
          <Text style={tw`mt-2 text-red-500 text-sm`}>Lỗi hiển thị bản đồ</Text>
        </View>
      );
    }
  };

  const renderStatusSection = () => (
    <View
      style={tw`bg-white px-4 py-4 mb-4 flex-row items-center justify-between border-b border-gray-200`}
    >
      <Text style={tw`text-base font-semibold text-black`} numberOfLines={1}>
        {config.header}
      </Text>
      <Image
        source={STATUS_IMAGE[getOrderStatus()]}
        style={tw`w-10 h-10`}
        resizeMode="contain"
      />
    </View>
  );

  const renderOrderInfoSection = () => {
    if (!orderData) return null;

    return (
      <View style={tw`bg-white px-4 py-4 mb-4 border-b border-gray-200`}>
        <View style={tw`flex-row items-center mb-2`}>
          <Text style={tw`font-semibold text-black text-sm`}>
            Mã đơn hàng: #{orderData.shipRequestId.slice(0, 8).toUpperCase()}
          </Text>
          <TouchableOpacity style={tw`ml-2`}>
            <Ionicons name="copy-outline" size={16} color="#00A982" />
          </TouchableOpacity>
        </View>
        <Text style={tw`text-xs text-gray-500 mb-2`}>
          {new Date(orderData.pickupWindowStart).toLocaleString("vi-VN")}
        </Text>

        {/* Địa chỉ lấy hàng */}
        <View style={tw`flex-row items-start mb-3`}>
          <View
            style={tw`w-6 h-6 rounded-full bg-black items-center justify-center mr-2 mt-1`}
          >
            <MaterialCommunityIcons name="stop" size={16} color="white" />
          </View>
          <View style={tw`flex-1 ml-2`}>
            <Text style={tw`font-semibold text-black`}>
              {orderData.pickupStreet}
            </Text>
            <Text style={tw`text-xs text-gray-500`}>
              {orderData.pickupWard && `${orderData.pickupWard}, `}
              {orderData.pickupDistrict}, {orderData.pickupProvince}
            </Text>
          </View>
        </View>

        {/* Địa chỉ giao hàng */}
        <View style={tw`flex-row items-start`}>
          <View
            style={tw`w-6 h-6 rounded-full bg-[#00A982] items-center justify-center mr-2 mt-1`}
          >
            <Entypo name="arrow-down" size={16} color="#fff" />
          </View>
          <View style={tw`flex-1 ml-2`}>
            <Text style={tw`font-semibold text-black`}>
              {orderData.dropoffStreet}
            </Text>
            <Text style={tw`text-xs text-gray-500`}>
              {orderData.dropoffWard && `${orderData.dropoffWard}, `}
              {orderData.dropoffDistrict}, {orderData.dropoffProvince}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderDriverSection = () => (
    <View
      style={tw`bg-white px-4 py-4 mb-4 flex-row items-center justify-between border-b border-gray-200`}
    >
      <View style={tw`w-8 h-8 rounded-full bg-gray-300 mr-3`} />
      <View style={tw`flex-1`}>
        <Text style={tw`font-semibold text-sm text-black`}>{driver.name}</Text>
        <Text style={tw`text-xs text-gray-500 mt-1`}>{driver.phone}</Text>
      </View>
      <View style={tw`flex-row items-center ml-3`}>
        {config.showCall && (
          <TouchableOpacity style={tw`mr-3`}>
            <Ionicons name="call-outline" size={20} color="#222" />
          </TouchableOpacity>
        )}
        {config.showChat && (
          <TouchableOpacity>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color="#222"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderItemsSection = () => {
    if (!orderData?.items) return null;

    return (
      <View style={tw`bg-white px-4 py-4 mb-4`}>
        {/* Header */}
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <Text style={tw`font-semibold text-black text-base`}>
            Thông tin kiện hàng
          </Text>
          <Text style={tw`text-xs text-gray-500`}>
            Số lượng: {orderData.items.length}
          </Text>
        </View>

        {/* Danh sách kiện hàng */}
        {orderData.items.map((item, idx) => (
          <View
            key={item.itemId}
            style={tw`flex-row items-center py-3 ${
              idx < orderData.items.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <Image
              source={
                item.imageLink
                  ? { uri: item.imageLink }
                  : require("../../../../assets/pictures/home/ad1.png")
              }
              style={tw`w-12 h-12 rounded mr-3`}
              resizeMode="cover"
            />
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm text-black`} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={tw`flex-row items-center mt-1`}>
                <Text style={tw`text-xs text-gray-500 mr-2`}>
                  SL: {item.amount}
                </Text>
                <View style={tw`bg-[#00A982] rounded px-2 py-0.5`}>
                  <Text style={tw`text-xs text-white font-semibold`}>
                    {item.weight}kg
                  </Text>
                </View>
                {item.size && (
                  <View style={tw`bg-blue-100 rounded px-2 py-0.5 ml-2`}>
                    <Text style={tw`text-xs text-blue-600 font-semibold`}>
                      {item.size}
                    </Text>
                  </View>
                )}
              </View>
              {item.description && (
                <Text style={tw`text-xs text-gray-500 mt-1`} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              <View
                style={tw`bg-purple-100 rounded px-2 py-0.5 mt-2 self-start`}
              >
                <Text style={tw`text-xs text-purple-600 font-semibold`}>
                  {item.type}
                </Text>
              </View>
            </View>
          </View>
        ))}

        {/* Tổng cộng */}
        <View
          style={tw`flex-row items-center justify-between py-3 border-t border-gray-200 mt-2`}
        >
          <Text style={tw`text-base font-semibold text-black`}>Tổng cộng</Text>
          <Text style={tw`text-lg text-[#00A982] font-bold`}>
            ₫{calculateTotalPrice().toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  const renderFooterActions = () => (
    <View
      style={tw`absolute bottom-0 left-0 right-0 bg-white px-4 pb-6 pt-3 flex-row justify-center`}
    >
      {config.showCancel && (
        <TouchableOpacity
          style={tw`flex-1 bg-[#FF3B30] rounded-xl py-3 mx-1 shadow items-center`}
          activeOpacity={0.85}
        >
          <Text style={tw`text-white font-bold text-base`}>
            {config.buttonText}
          </Text>
        </TouchableOpacity>
      )}
      {config.showReorder && (
        <TouchableOpacity
          style={tw`flex-1 bg-[#00A982] rounded-xl py-3 mx-1 shadow items-center`}
          activeOpacity={0.85}
        >
          <Text style={tw`text-white font-bold text-base`}>
            {config.buttonText}
          </Text>
        </TouchableOpacity>
      )}
      {config.showReport && (
        <TouchableOpacity
          style={tw`flex-1 bg-[#FF3B30] rounded-xl py-3 mx-1 shadow items-center`}
          activeOpacity={0.85}
        >
          <Text style={tw`text-white font-bold text-base`}>
            {config.reportText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Error state - không có loading vì data đã có từ params
  if (!orderData) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white`}>
        {renderHeader()}
        <View style={tw`flex-1 items-center justify-center px-4`}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text style={tw`mt-4 text-lg font-semibold text-black`}>
            Không tìm thấy đơn hàng
          </Text>
          <Text style={tw`mt-2 text-sm text-gray-500 text-center`}>
            Đơn hàng không tồn tại hoặc chưa được tải
          </Text>
          <TouchableOpacity
            style={tw`mt-6 bg-[#00A982] rounded-xl px-6 py-3`}
            onPress={handleGoBack}
          >
            <Text style={tw`text-white font-bold`}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main render
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {renderHeader()}
      {renderOrderMap()}
      <ScrollView
        style={[tw`bg-gray-200 rounded-t-3xl`, { marginTop: -100 }]}
        contentContainerStyle={tw`pb-20`}
        showsVerticalScrollIndicator={false}
      >
        {renderStatusSection()}
        {renderOrderInfoSection()}
        {renderDriverSection()}
        {renderItemsSection()}
      </ScrollView>
      {renderFooterActions()}
    </SafeAreaView>
  );
}
