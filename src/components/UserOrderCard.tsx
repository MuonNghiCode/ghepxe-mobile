import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type OrderCardProps = {
  productImage: any;
  productName: string;
  quantity: number;
  weight: string;
  price: string | number;
  pickupAddress: string;
  deliveryAddress: string;
  status: "pending" | "picking" | "review" | "cancelled";
  headerText?: string;
  tagText?: string;
  onReview?: () => void;
  showMore?: boolean;
  onPress?: () => void;
};

const STATUS_CONFIG = {
  pending: {
    icon: "hourglass",
    header: "Đơn hàng của bạn đang chờ xác nhận",
    tag: "Chờ xác nhận",
    tagColor: "#FFB800",
    tagBg: "#FFF7E6",
    showButton: false,
  },
  picking: {
    icon: "hourglass",
    header: "Thời gian lấy hàng ước tính 1 ngày",
    tag: "Đang lấy hàng",
    tagColor: "#00A982",
    tagBg: "#E6F7F3",
    showButton: false,
  },
  review: {
    icon: "cash-outline",
    header: "Đánh giá dịch vụ để nhận 200 xu",
    tag: "Chờ đánh giá",
    tagColor: "#00A982",
    tagBg: "#E6F7F3",
    showButton: true,
  },
  cancelled: {
    icon: "return-up-back",
    header: "Hoàn tiền thành công",
    tag: "Đã huỷ",
    tagColor: "#6B7280",
    tagBg: "#F3F4F6",
    showButton: false,
  },
};

export default function UserOrderCard({
  productImage,
  productName,
  quantity,
  weight,
  price,
  pickupAddress,
  deliveryAddress,
  status,
  headerText,
  tagText,
  onReview,
  showMore,
  onPress,
}: OrderCardProps) {
  const config = STATUS_CONFIG[status];

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
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 pt-4 pb-2`}>
        <View style={tw`flex-row items-center flex-1 mr-2`}>
          <Ionicons name={config.icon as any} size={18} color="#6B6B6B" />
          <Text
            style={tw`ml-2 text-xs text-gray-700 flex-1`}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {headerText || config.header}
          </Text>
        </View>
        {config.showButton ? (
          <TouchableOpacity
            style={tw`bg-[#00A982] rounded-full px-3 py-1 flex-shrink-0`}
            onPress={onReview}
          >
            <Text style={tw`text-white text-xs font-semibold`}>
              Đánh giá ngay
            </Text>
          </TouchableOpacity>
        ) : (
          (tagText || config.tag) && (
            <View
              style={[
                tw`px-3 py-1 rounded-full flex-shrink-0`,
                { backgroundColor: config.tagBg },
              ]}
            >
              <Text
                style={[tw`text-xs font-semibold`, { color: config.tagColor }]}
              >
                {tagText || config.tag}
              </Text>
            </View>
          )
        )}
      </View>

      {/* Sản phẩm */}
      <View style={tw`flex-row items-center px-4 pt-3 pb-2`}>
        <Image
          source={productImage}
          style={tw`w-12 h-12 rounded mr-3`}
          resizeMode="cover"
        />
        <View style={tw`flex-1`}>
          <Text
            style={tw`font-semibold text-black text-base`}
            numberOfLines={1}
          >
            {productName}
          </Text>
          <View style={tw`flex-row items-center mt-1`}>
            <Text style={tw`text-xs text-gray-500`}>Số lượng: {quantity}</Text>
            <View style={tw`bg-[#00A982] rounded px-2 py-0.5 ml-2`}>
              <Text style={tw`text-xs text-white`}>{weight}</Text>
            </View>
          </View>
        </View>
        <Text style={tw`text-base text-gray-700 font-semibold`}>{price}</Text>
      </View>

      <View style={tw`border-b border-gray-100 mx-4`} />

      {/* Địa chỉ */}
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
            {pickupAddress}
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
            {deliveryAddress}
          </Text>
        </View>
      </View>

      {/* Footer: tổng kết */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-2 border-t border-gray-100`}
      >
        <Text style={tw`text-xs text-gray-500`}>
          Số lượng: {quantity} | {weight} | {price}
        </Text>
        <Ionicons name="chevron-forward" size={18} color="#C4C4C4" />
      </View>
    </TouchableOpacity>
  );
}
