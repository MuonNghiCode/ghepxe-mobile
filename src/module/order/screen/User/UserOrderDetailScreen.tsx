import React, { useCallback } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
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
  const order = route.params?.order || route.params;
  const config = STATUS_CONFIG[order.orderStatus || "waiting"];
  const navigation = useNavigation();

  const driver = {
    name: "Phạm Minh Quân",
    phone: "098.xxx.xxxx",
  };

  const items = [
    {
      name: "Paracetamol-Ratiopharm 500mg Tabletten 20 ST",
      quantity: 1,
      price: "100.000đ",
      status: "Xem bảo hiểm",
    },
    {
      name: "Gelomyrtol Forte 20 ST",
      quantity: 1,
      price: "100.000đ",
      status: "Xem bảo hiểm",
    },
    {
      name: "Aesop Resurrection",
      quantity: "0.5 kg",
      price: "100.000đ",
      status: "Xem bảo hiểm",
    },
  ];

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
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
          Chi tiết đơn hàng
        </Text>
        <View style={tw`w-10 h-10`} />
      </View>

      {/* Map Component */}
      <OrderMap
        pickupCoordinates={{
          latitude: order.pickupLatitude,
          longitude: order.pickupLongitude,
        }}
        deliveryCoordinates={{
          latitude: order.deliveryLatitude,
          longitude: order.deliveryLongitude,
        }}
        pickupAddress={order.pickupAddress}
        deliveryAddress={order.deliveryAddress}
        orderStatus={order.orderStatus || "waiting"}
        statusImage={STATUS_IMAGE[order.orderStatus || "waiting"]}
        enableVietnameseRoute={true}
        orderType="single"
      />

      {/* ScrollView nội dung */}
      <ScrollView
        style={[tw`bg-gray-200 rounded-t-3xl`, { marginTop: -100 }]}
        contentContainerStyle={tw`pb-20`}
        showsVerticalScrollIndicator={false}
      >
        {/* Trạng thái đơn hàng + icon */}
        <View
          style={tw`bg-white px-4 py-4 mb-4 flex-row items-center justify-between border-b border-gray-200`}
        >
          <Text
            style={tw`text-base font-semibold text-black`}
            numberOfLines={1}
          >
            {config.header}
          </Text>
          <Image
            source={STATUS_IMAGE[order.orderStatus || "waiting"]}
            style={tw`w-10 h-10`}
            resizeMode="contain"
          />
        </View>

        {/* Mã đơn hàng + địa chỉ */}
        <View style={tw`bg-white px-4 py-4 mb-4 border-b border-gray-200`}>
          <View style={tw`flex-row items-center mb-2`}>
            <Text style={tw`font-semibold text-black text-sm`}>
              Mã đơn hàng: #25HS16V3
            </Text>
            <TouchableOpacity style={tw`ml-2`}>
              <Ionicons name="copy-outline" size={16} color="#00A982" />
            </TouchableOpacity>
          </View>
          <Text style={tw`text-xs text-gray-500 mb-2`}>28/06/2025 | 21:54</Text>

          {/* Địa chỉ nhận */}
          <View style={tw`flex-row items-center mb-3`}>
            <View
              style={tw`w-6 h-6 rounded-full bg-black items-center justify-center mr-2`}
            >
              <MaterialCommunityIcons name="stop" size={16} color="white" />
            </View>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`font-semibold text-black`}>
                {order.pickupAddress}
              </Text>
              <Text style={tw`text-xs text-gray-500`}>
                {order.pickupContact} | {order.pickupPhone}
              </Text>
            </View>
          </View>

          {/* Địa chỉ giao */}
          <View style={tw`flex-row items-center`}>
            <View
              style={tw`w-6 h-6 rounded-full bg-[#00A982] items-center justify-center mr-2`}
            >
              <Entypo name="arrow-down" size={16} color="#fff" />
            </View>
            <View style={tw`flex-1 ml-2`}>
              <Text style={tw`font-semibold text-black`}>
                {order.deliveryAddress}
              </Text>
              <Text style={tw`text-xs text-gray-500`}>
                {order.deliveryContact} | {order.deliveryPhone}
              </Text>
            </View>
          </View>
        </View>

        {/* Tài xế */}
        <View
          style={tw`bg-white px-4 py-4 mb-4 flex-row items-center justify-between border-b border-gray-200`}
        >
          <View style={tw`w-8 h-8 rounded-full bg-gray-300 mr-3`} />
          <View style={tw`flex-1`}>
            <Text style={tw`font-semibold text-sm text-black`}>
              {driver.name}
            </Text>
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

        {/* Thông tin kiện hàng */}
        <View style={tw`bg-white px-4 py-4 mb-4`}>
          {/* Header */}
          <View style={tw`flex-row items-center justify-between mb-3`}>
            <Text style={tw`font-semibold text-black text-base`}>
              Thông tin kiện hàng
            </Text>
            <Text style={tw`text-xs text-gray-500`}>
              Số lượng: {items.length}
            </Text>
          </View>

          {/* Danh sách kiện hàng */}
          {items.map((item, idx) => (
            <View
              key={idx}
              style={tw`flex-row items-center py-3 border-b border-gray-100`}
            >
              <Image
                source={require("../../../../assets/pictures/home/ad1.png")}
                style={tw`w-12 h-12 rounded mr-3`}
                resizeMode="cover"
              />
              <View style={tw`flex-1`}>
                <Text style={tw`text-sm text-black`} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={tw`flex-row items-center mt-1`}>
                  <Text style={tw`text-xs text-gray-500 mr-2`}>
                    Số lượng: {item.quantity}
                  </Text>
                  <Text style={tw`text-xs text-gray-500 mr-2`}>100.000đ</Text>
                  <View style={tw`bg-[#00A982] rounded px-2 py-0.5`}>
                    <Text style={tw`text-xs text-white font-semibold`}>
                      10kg
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={tw`bg-[#E6F7F3] rounded px-3 py-1 mt-2 w-28`}
                >
                  <Text
                    style={tw`text-xs text-[#00A982] font-semibold text-center`}
                  >
                    Xem bảo hiểm
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={tw`text-sm text-black font-semibold ml-2`}>
                {item.price}
              </Text>
            </View>
          ))}

          {/* Hàng dễ vỡ */}
          <View style={tw`flex-row items-center py-3`}>
            <Ionicons name="shield" size={20} color="#0066FF" />
            <Text style={tw`ml-2 text-sm text-black`}>Hàng dễ vỡ</Text>
            <Text style={tw`ml-auto text-sm text-[#00A982] font-semibold`}>
              ₫10.000
            </Text>
          </View>

          {/* Phương thức thanh toán */}
          <View style={tw`flex-row items-center py-3 border-t border-gray-100`}>
            <FontAwesome6 name="money-bills" size={15} color="#00A982" />
            <Text style={tw`ml-2 text-sm text-black`}>
              Phương thức thanh toán
            </Text>
            <Text style={tw`ml-auto text-sm text-[#00A982] font-semibold`}>
              ₫110.000
            </Text>
            <TouchableOpacity style={tw`ml-2`}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#6B6B6B"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
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
    </SafeAreaView>
  );
}
