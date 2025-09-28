import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import tw from "twrnc";
import { useRoute, RouteProp } from "@react-navigation/native";

type Order = {
  productImage: any;
  productName: string;
  quantity: number;
  weight: string | number;
  price: string | number;
  pickupAddress: string;
  deliveryAddress: string;
  // Add other fields if needed
};

type OrderDetailScreenRouteProp = RouteProp<
  { params: { order: Order } },
  "params"
>;

export default function OrderDetailScreen() {
  const route = useRoute<OrderDetailScreenRouteProp>();
  const { order } = route.params;

  return (
    <ScrollView style={tw`flex-1 bg-white`}>
      <View style={tw`p-6`}>
        <Text style={tw`text-xl font-bold mb-4`}>Chi tiết đơn hàng</Text>
        <Image
          source={order.productImage}
          style={tw`w-20 h-20 rounded mb-4`}
          resizeMode="cover"
        />
        <Text style={tw`text-base font-semibold mb-2`}>
          {order.productName}
        </Text>
        <Text style={tw`text-sm text-gray-700 mb-2`}>
          Số lượng: {order.quantity}
        </Text>
        <Text style={tw`text-sm text-gray-700 mb-2`}>
          Khối lượng: {order.weight}
        </Text>
        <Text style={tw`text-sm text-gray-700 mb-2`}>Giá: {order.price}</Text>
        <Text style={tw`text-sm text-gray-700 mb-2`}>
          Địa chỉ lấy hàng: {order.pickupAddress}
        </Text>
        <Text style={tw`text-sm text-gray-700 mb-2`}>
          Địa chỉ giao hàng: {order.deliveryAddress}
        </Text>
        {/* Thêm các thông tin khác nếu cần */}
      </View>
    </ScrollView>
  );
}
