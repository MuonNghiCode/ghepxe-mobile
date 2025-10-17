import React, { useCallback, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import tw from "twrnc";
import {
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome6,
} from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/core";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderMap } from "src/components/OrderMap";
import {
  DriverOrder,
  DriverOrderStatus,
} from "src/types/driverOrder.interface";

// Thêm STATUS_IMAGE
const STATUS_IMAGE = {
  ongoing: require("../../../../assets/icons/pending.png"),
  completed: require("../../../../assets/icons/complete.png"),
  cancelled: require("../../../../assets/icons/cancelled.png"),
};

const STATUS_CONFIG = {
  ongoing: {
    header: "Đơn hàng đang trong quá trình giao",
    icon: "hourglass",
    headerColor: "#00A982",
    showUpdate: true,
    showContact: true,
    statusText: "Đang giao hàng",
    statusColor: "#00A982",
    statusBg: "#E6F7F3",
    primaryButton: "CẬP NHẬT TRẠNG THÁI",
    primaryColor: "#00A982",
    secondaryButton: "LIÊN HỆ KHÁCH HÀNG",
    secondaryColor: "#6B7280",
  },
  completed: {
    header: "Đơn hàng đã hoàn thành thành công",
    icon: "checkmark-circle",
    headerColor: "#00A982",
    showUpdate: false,
    showContact: false,
    statusText: "Đã hoàn thành",
    statusColor: "#FFFFFF",
    statusBg: "#00A982",
    primaryButton: "XEM BÁO CÁO",
    primaryColor: "#00A982",
    secondaryButton: null,
    secondaryColor: null,
  },
  cancelled: {
    header: "Đơn hàng đã bị hủy",
    icon: "return-up-back",
    headerColor: "#FF3B30",
    showUpdate: false,
    showContact: false,
    statusText: "Đã hủy",
    statusColor: "#6B7280",
    statusBg: "#F3F4F6",
    primaryButton: "XEM CHI TIẾT",
    primaryColor: "#6B7280",
    secondaryButton: null,
    secondaryColor: null,
  },
};

type DriverOrderDetailScreenRouteProp = RouteProp<
  { params: DriverOrder },
  "params"
>;

export default function DriverOrderDetailScreen() {
  const route = useRoute<DriverOrderDetailScreenRouteProp>();
  const order = route.params;
  const config = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
  const navigation = useNavigation();

  // State cho expanded customers
  const [expandedCustomers, setExpandedCustomers] = useState<
    Record<string, boolean>
  >({});
  // Mock data cho distance và duration
  const [distance] = useState("15.2 km");
  const [duration] = useState("45 phút");
  // Tổng số items
  const totalItems = order.customers.reduce(
    (total, customer) => total + customer.orders.length,
    0
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Toggle expand customer
  const toggleCustomerExpand = (customerId: string) => {
    setExpandedCustomers((prev) => ({
      ...prev,
      [customerId]: !prev[customerId],
    }));
  };

  // Mở tất cả customers mặc định
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    order.customers.forEach((customer) => {
      initialExpanded[customer.id] = true;
    });
    setExpandedCustomers(initialExpanded);
  }, [order.customers]);

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

  const renderOrderMap = () => (
    <OrderMap
      pickupCoordinates={order.pickupCoordinates}
      deliveryCoordinates={order.deliveryCoordinates}
      pickupAddress={order.pickupAddress}
      deliveryAddress={order.deliveryAddress}
      customers={order.customers}
      orderStatus={order.status}
      statusImage={STATUS_IMAGE[order.status as keyof typeof STATUS_IMAGE]}
      enableVietnameseRoute={false}
      orderType={order.type}
    />
  );

  const renderStatusSection = () => (
    <View
      style={tw`bg-white px-4 py-4 mb-4 flex-row items-center justify-between border-b border-gray-200`}
    >
      <Text
        style={tw`text-base font-semibold text-black flex-1`}
        numberOfLines={2}
      >
        {config.header}
      </Text>
      <Image
        source={STATUS_IMAGE[order.status as keyof typeof STATUS_IMAGE]}
        style={tw`w-10 h-10`}
        resizeMode="contain"
      />
    </View>
  );

  const renderOrderInfoSection = () => (
    <View style={tw`bg-white px-4 py-4 mb-4 border-b border-gray-200`}>
      <View style={tw`flex-row items-center mb-2`}>
        <Text style={tw`font-semibold text-black text-sm`}>
          Mã đơn hàng: #{order.id}DRV
        </Text>
        <TouchableOpacity style={tw`ml-2`}>
          <Ionicons name="copy-outline" size={16} color="#00A982" />
        </TouchableOpacity>
      </View>
      <Text style={tw`text-xs text-gray-500 mb-2`}>
        {order.date} {order.time && `- ${order.time}`}
      </Text>
      <Text style={tw`text-xs text-gray-500 mb-2`}>
        {order.type === "single" ? "Đơn lẻ" : "Đơn ghép"} • {distance} •{" "}
        {duration}
      </Text>
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
          <Text style={tw`text-xs text-gray-500`}>Điểm lấy hàng</Text>
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
            {order.type === "single"
              ? `${order.customers[0]?.name} | ${order.customers[0]?.phone}`
              : `${order.customers.length} điểm giao hàng`}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderOrderTypeSection = () => (
    <View style={tw`bg-white px-4 py-4 mb-4`}>
      <View style={tw`flex-row items-center`}>
        <View
          style={[
            tw`w-8 h-8 rounded-full mr-3 items-center justify-center`,
            { backgroundColor: "#E5E7EB" },
          ]}
        >
          <MaterialCommunityIcons
            name={order.type === "single" ? "package" : "package-variant"}
            size={20}
            color="#6B7280"
          />
        </View>
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center`}>
            <Text style={tw`font-semibold text-black text-base`}>
              {order.type === "single" ? "Đơn lẻ" : "Đơn ghép"}
            </Text>
            <View
              style={[
                tw`px-2 py-0.5 rounded-lg ml-2`,
                { backgroundColor: config.statusBg },
              ]}
            >
              <Text
                style={[
                  tw`text-xs font-semibold`,
                  { color: config.statusColor },
                ]}
              >
                {config.statusText}
              </Text>
            </View>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#6B6B6B"
              style={tw`ml-2`}
            />
          </View>
          <Text style={tw`text-xs text-gray-500 mt-1`}>
            {order.status === "completed" ? "đã hoàn thành" : "đang xử lý"}
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItemsSection = () => (
    <View style={tw`bg-white px-4 py-4 mb-4`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <Text style={tw`font-semibold text-black text-base`}>
          Thông tin kiện hàng
        </Text>
        <Text style={tw`text-xs text-gray-500`}>Số lượng: {totalItems}</Text>
      </View>
      {/* Danh sách theo từng khách hàng */}
      {order.customers.map((customer, customerIndex) => (
        <View key={customer.id} style={tw`mb-4`}>
          {/* Header khách hàng */}
          <TouchableOpacity
            style={tw`flex-row items-center py-3 ${
              customerIndex === 0 ? "" : "border-t border-gray-100"
            }`}
            onPress={() => toggleCustomerExpand(customer.id)}
          >
            {/* Avatar khách hàng */}
            <View
              style={[
                tw`w-8 h-8 rounded-full mr-3 items-center justify-center`,
                {
                  backgroundColor: `hsl(${customerIndex * 137.5}, 60%, 85%)`,
                },
              ]}
            >
              <Text style={tw`text-sm font-bold text-gray-700`}>
                {customer.name.charAt(0)}
              </Text>
            </View>
            {/* Thông tin khách hàng */}
            <View style={tw`flex-1`}>
              <Text style={tw`font-semibold text-black text-sm`}>
                {customer.name}
              </Text>
              <Text style={tw`text-xs text-gray-500 mt-1`}>
                {customer.phone}
              </Text>
            </View>
            {/* Icon call & chat */}
            <View style={tw`flex-row items-center mr-3`}>
              {config.showContact && (
                <>
                  <TouchableOpacity style={tw`mr-3`}>
                    <Ionicons name="call-outline" size={20} color="#222" />
                  </TouchableOpacity>
                  <TouchableOpacity style={tw`mr-3`}>
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={20}
                      color="#222"
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
            {/* Chevron */}
            <TouchableOpacity>
              <Ionicons
                name={
                  expandedCustomers[customer.id] ? "chevron-up" : "chevron-down"
                }
                size={18}
                color="#6B6B6B"
              />
            </TouchableOpacity>
          </TouchableOpacity>
          {/* Danh sách hàng hóa của khách hàng */}
          {expandedCustomers[customer.id] && (
            <View style={tw`ml-11`}>
              {customer.orders.map((item, itemIndex) => (
                <View
                  key={item.id}
                  style={tw`flex-row items-center py-3 ${
                    itemIndex !== customer.orders.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  {/* Ảnh sản phẩm */}
                  <Image
                    source={item.image}
                    style={tw`w-12 h-12 rounded mr-3`}
                    resizeMode="cover"
                  />
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-sm text-black`} numberOfLines={1}>
                      {item.productName}
                    </Text>
                    <View style={tw`flex-row items-center mt-1`}>
                      <Text style={tw`text-xs text-gray-500 mr-2`}>
                        Số lượng: {item.quantity}
                      </Text>
                      <Text style={tw`text-xs text-gray-500 mr-2`}>
                        {item.price}
                      </Text>
                      <View style={tw`bg-[#00A982] rounded px-2 py-0.5`}>
                        <Text style={tw`text-xs text-white font-semibold`}>
                          {item.weight}
                        </Text>
                      </View>
                    </View>
                    {/* Nút xem bảo hiểm */}
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
              {/* Tổng tiền của khách hàng này */}
              <View
                style={tw`flex-row items-center py-3 border-t border-gray-100`}
              >
                <FontAwesome6 name="money-bills" size={15} color="#00A982" />
                <Text style={tw`ml-2 text-sm text-black`}>
                  Phương thức thanh toán
                </Text>
                <Text style={tw`ml-auto text-sm text-[#00A982] font-semibold`}>
                  {customer.price}
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
          )}
        </View>
      ))}
      {/* Hàng dễ vỡ */}
      <View style={tw`flex-row items-center py-3 border-t border-gray-100`}>
        <Ionicons name="shield" size={20} color="#0066FF" />
        <Text style={tw`ml-2 text-sm text-black`}>Hàng dễ vỡ</Text>
        <Text style={tw`ml-auto text-sm text-[#00A982] font-semibold`}>
          ₫10.000
        </Text>
      </View>
      {/* Tổng thu nhập */}
      <View style={tw`flex-row items-center py-3 border-t border-gray-100`}>
        <FontAwesome6 name="money-bills" size={15} color="#00A982" />
        <Text style={tw`ml-2 text-sm text-black font-semibold`}>
          Tổng thu nhập
        </Text>
        <Text style={tw`ml-auto text-lg text-[#00A982] font-bold`}>
          {order.totalPrice}
        </Text>
      </View>
    </View>
  );

  const renderFooterActions = () => (
    <View style={tw`absolute bottom-0 left-0 right-0 bg-white px-4 pb-6 pt-3`}>
      {config.showUpdate || config.showContact ? (
        <View style={tw`flex-row gap-2`}>
          {config.showUpdate && (
            <TouchableOpacity
              style={tw`flex-1 bg-[#00A982] rounded-lg py-2.5 items-center`}
              activeOpacity={0.85}
            >
              <Text style={tw`text-white font-semibold text-sm`}>
                {config.primaryButton}
              </Text>
            </TouchableOpacity>
          )}
          {config.showContact && (
            <TouchableOpacity
              style={tw`flex-1 border border-gray-300 rounded-lg py-2.5 items-center`}
              activeOpacity={0.85}
            >
              <Text style={tw`text-gray-700 font-semibold text-sm`}>
                {config.secondaryButton}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        config.primaryButton && (
          <TouchableOpacity
            style={[
              tw`rounded-lg py-2.5 items-center`,
              { backgroundColor: config.primaryColor },
            ]}
            activeOpacity={0.85}
          >
            <Text style={tw`text-white font-semibold text-sm`}>
              {config.primaryButton}
            </Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );

  // --- Main render ---
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
        {renderOrderTypeSection()}
        {renderItemsSection()}
      </ScrollView>
      {renderFooterActions()}
    </SafeAreaView>
  );
}
