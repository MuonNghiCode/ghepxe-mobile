import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserTabParamList } from "src/navigation/type";
import UserOrderCard from "@components/UserOrderCard";
import { Order, OrderStatus, OrderCardStatus } from "src/types/order.interface";
import orders from "src/constants/order";

const TABS = [
  { key: "ongoing", label: "ĐANG DIỄN RA" },
  { key: "completed", label: "ĐÃ HOÀN THÀNH" },
  { key: "cancelled", label: "ĐÃ HUỶ" },
];

const statusMap: Record<OrderCardStatus, OrderStatus> = {
  pending: "waiting",
  picking: "delivering",
  review: "delivered",
  cancelled: "cancelled",
};

type UserOrderScreenNavigationProp = NativeStackNavigationProp<
  UserTabParamList,
  "UserOrder"
>;

export default function UserOrderScreen() {
  const [tab, setTab] = useState("ongoing");
  const navigation = useNavigation<UserOrderScreenNavigationProp>();

  const filteredOrders = orders.filter((order) => {
    if (tab === "ongoing")
      return order.status === "pending" || order.status === "picking";
    if (tab === "completed") return order.status === "review";
    if (tab === "cancelled") return order.status === "cancelled";
    return true;
  });

  const handleCardPress = useCallback(
    (order: Order) => {
      navigation.navigate("UserOrderDetail", {
        ...order,
        orderStatus: statusMap[order.status],
      } as never);
    },
    [navigation]
  );

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      {/* Header */}
      <View style={tw`pt-12 pb-4 bg-white`}>
        <Text style={tw`text-lg font-semibold text-center text-black`}>
          Đơn hàng
        </Text>
      </View>
      {/* Tabs */}
      <View style={tw`flex-row px-4 py-2 bg-white`}>
        {TABS.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={tw`mr-3`}
            onPress={() => setTab(item.key)}
          >
            <Text
              style={tw.style(
                "px-4 py-2 rounded-full text-xs font-semibold",
                tab === item.key
                  ? "bg-[#00A982] text-white"
                  : "bg-gray-100 text-gray-700"
              )}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Content */}
      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pt-2 pb-8 px-4`}>
        {filteredOrders.map((order) => (
          <UserOrderCard
            key={order.id}
            status={order.status}
            productImage={order.productImage}
            productName={order.productName}
            quantity={order.quantity}
            weight={order.weight}
            price={order.price}
            pickupAddress={order.pickupAddress}
            deliveryAddress={order.deliveryAddress}
            headerText={order.time}
            tagText={order.tag}
            showMore={order.quantity > 1}
            onReview={() => {}}
            onPress={() => handleCardPress(order)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
