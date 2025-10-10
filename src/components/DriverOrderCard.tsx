import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DriverOrder,
  DriverOrderStatus,
} from "src/types/driverOrder.interface";

interface DriverOrderCardProps {
  order: DriverOrder;
  onPress: () => void;
}

const getStatusConfig = (status: DriverOrderStatus) => {
  switch (status) {
    case "cancelled":
      return {
        icon: "return-up-back",
        tag: "Đã hủy",
        tagColor: "#6B7280",
        tagBg: "#F3F4F6",
      };
    case "completed":
      return {
        icon: "checkmark-circle",
        tag: "Đã hoàn thành",
        tagColor: "#FFFFFF",
        tagBg: "#00A982",
      };
    case "ongoing":
      return {
        icon: "hourglass",
        tag: "Đang giao hàng",
        tagColor: "#00A982",
        tagBg: "#E6F7F3",
      };
    default:
      return {
        icon: "help-circle",
        tag: "Không xác định",
        tagColor: "#6B7280",
        tagBg: "#F9FAFB",
      };
  }
};

const DriverOrderCard: React.FC<DriverOrderCardProps> = ({
  order,
  onPress,
}) => {
  const config = getStatusConfig(order.status);

  return (
    <TouchableOpacity
      activeOpacity={0.93}
      onPress={onPress}
      style={[
        tw`bg-white rounded-2xl mb-3`,
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 2,
        },
      ]}
    >
      {/* Header với thời gian */}
      <View style={tw`flex-row items-center justify-between px-4 pt-4 pb-2`}>
        <View style={tw`flex-row items-center flex-1 mr-2`}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text
            style={tw`ml-2 text-sm text-gray-600 flex-1`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {order.date} {order.time && `- ${order.time}`}
          </Text>
        </View>
        <View
          style={[
            tw`px-3 py-1 rounded-full flex-shrink-0`,
            { backgroundColor: config.tagBg },
          ]}
        >
          <Text style={[tw`text-xs font-semibold`, { color: config.tagColor }]}>
            {config.tag}
          </Text>
        </View>
      </View>

      {/* Thông tin đơn hàng */}
      <View style={tw`px-4 pt-3 pb-2`}>
        {/* Loại đơn hàng */}
        <View style={tw`flex-row items-center mb-2`}>
          <View
            style={[
              tw`w-12 h-12 rounded mr-3 items-center justify-center`,
              {
                backgroundColor:
                  order.type === "single" ? "#FEF3C7" : "#DBEAFE",
              },
            ]}
          >
            <MaterialCommunityIcons
              name={order.type === "single" ? "package" : "package-variant"}
              size={24}
              color={order.type === "single" ? "#F59E0B" : "#3B82F6"}
            />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`font-semibold text-black text-base`}>
              {order.type === "single" ? "Đơn lẻ" : "Đơn ghép"}
            </Text>
            <View style={tw`flex-row items-center mt-1`}>
              <Text
                style={tw`text-xs text-gray-500 flex-1`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {order.type === "single"
                  ? `Sản phẩm: ${order.productName}`
                  : `${order.customers.length} khách hàng`}
              </Text>
            </View>
          </View>
          <Text style={tw`text-base text-gray-700 font-semibold`}>
            {order.totalPrice}
          </Text>
        </View>

        {/* Thông tin chi tiết */}
        {order.type === "single" ? (
          // Đơn lẻ - hiển thị thông tin sản phẩm
          <View style={tw`ml-15 bg-orange-50 rounded-lg p-2`}>
            <View style={tw`flex-row items-center`}>
              <MaterialCommunityIcons
                name="food-variant"
                size={16}
                color="#F59E0B"
                style={tw`mr-2`}
              />
              <Text
                style={tw`text-sm font-medium text-gray-900 flex-1`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {order.productName}
              </Text>
              <View style={tw`bg-[#00A982] rounded px-2 py-0.5 ml-2`}>
                <Text style={tw`text-xs text-white`}>{order.totalWeight}</Text>
              </View>
            </View>
            <Text style={tw`text-xs text-gray-500 ml-5 mt-1`}>
              Số lượng: {order.totalQuantity}
            </Text>
          </View>
        ) : (
          // Đơn ghép - hiển thị danh sách khách hàng
          <View style={tw`ml-15`}>
            {order.customers.slice(0, 2).map((customer, index) => (
              <View key={customer.id} style={tw`flex-row items-center py-1`}>
                <View
                  style={[
                    tw`w-6 h-6 rounded-full mr-2 items-center justify-center`,
                    { backgroundColor: `hsl(${index * 120}, 40%, 85%)` },
                  ]}
                >
                  <Text style={tw`text-xs font-bold text-gray-700`}>
                    {customer.name.charAt(0)}
                  </Text>
                </View>
                <Text
                  style={tw`text-sm text-gray-900 flex-1`}
                  numberOfLines={1}
                >
                  {customer.name}
                </Text>
                <Text style={tw`text-xs font-semibold text-green-600`}>
                  {customer.price}
                </Text>
              </View>
            ))}
            {order.customers.length > 2 && (
              <Text style={tw`text-xs text-gray-500 ml-8`}>
                +{order.customers.length - 2} khách hàng khác
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Separator giống UserOrderCard */}
      <View style={tw`border-b border-gray-100 mx-4`} />

      {/* Địa chỉ giống UserOrderCard */}
      <View style={tw`px-4 py-2`}>
        <View style={tw`flex-row items-center mb-1`}>
          <View
            style={tw`w-4 h-4 rounded-full bg-black items-center justify-center`}
          >
            <MaterialCommunityIcons
              name="stop"
              size={12}
              color="white"
              style={tw`bg-black rounded-full`}
            />
          </View>
          <Text style={tw`ml-2 text-sm text-gray-800 flex-1`} numberOfLines={1}>
            {order.pickupAddress}
          </Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <View
            style={tw`w-4 h-4 rounded-full bg-[#00A982] items-center justify-center`}
          >
            <Entypo
              name="arrow-down"
              size={12}
              color="#fff"
              style={tw`bg-[#00A982] rounded-full`}
            />
          </View>
          <Text style={tw`ml-2 text-sm text-gray-800 flex-1`} numberOfLines={1}>
            {order.deliveryAddress}
          </Text>
        </View>
      </View>

      {/* Footer giống UserOrderCard */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-2 border-t border-gray-100`}
      >
        <Text style={tw`text-xs text-gray-500`}>
          Số lượng: {order.totalQuantity} | {order.totalWeight} |{" "}
          {order.totalPrice}
        </Text>
        <Ionicons name="chevron-forward" size={18} color="#C4C4C4" />
      </View>
    </TouchableOpacity>
  );
};

export default DriverOrderCard;
