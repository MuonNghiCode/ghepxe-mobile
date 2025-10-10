import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DriverOrder } from "src/types/driverOrder.interface";
import driverOrders from "src/constants/driverOrder";
import DriverOrderCard from "src/components/DriverOrderCard";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DriverTabParamList } from "src/navigation/type";

const TABS = [
  { key: "ongoing", label: "ĐANG DIỄN RA" },
  { key: "completed", label: "ĐÃ HOÀN THÀNH" },
  { key: "cancelled", label: "ĐÃ HUỶ" },
];

type DriverOrderScreenNavigationProp = NativeStackNavigationProp<
  DriverTabParamList,
  "DriverOrder"
>;

export default function DriverOrderScreen() {
  const [tab, setTab] = useState("ongoing");
  const navigation = useNavigation<DriverOrderScreenNavigationProp>();

  const filteredOrders = driverOrders.filter((order) => {
    if (tab === "ongoing") return order.status === "ongoing";
    if (tab === "completed") return order.status === "completed";
    if (tab === "cancelled") return order.status === "cancelled";
    return true;
  });

  const handleOrderPress = useCallback(
    (order: DriverOrder) => {
      navigation.navigate("DriverOrderDetail", order as never);
    },
    [navigation]
  );

  const handleRate = useCallback((order: DriverOrder) => {
    console.log("Rate order:", order.id);
  }, []);

  const handleReport = useCallback((order: DriverOrder) => {
    console.log("Report order:", order.id);
  }, []);

  const handleUpdate = useCallback((order: DriverOrder) => {
    console.log("Update order:", order.id);
  }, []);

  const handleContact = useCallback((order: DriverOrder) => {
    console.log("Contact customer for order:", order.id);
  }, []);

  return (
    <View style={tw`flex-1 bg-[#F8FFFE]`}>
      {/* Header */}
      <View style={tw`pt-12 pb-4 bg-white`}>
        <Text style={tw`text-lg font-semibold text-center text-black`}>
          Đơn hàng
        </Text>
      </View>

      {/* Tabs */}
      <View style={tw`flex-row px-4 py-2 bg-white border-b border-gray-200`}>
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
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`pt-3 pb-8 px-4`}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <DriverOrderCard
              key={order.id}
              order={order}
              onPress={() => handleOrderPress(order)}
            />
          ))
        ) : (
          <View style={tw`flex-1 items-center justify-center py-20`}>
            <MaterialCommunityIcons
              name="package-variant-closed"
              size={64}
              color="#D1D5DB"
            />
            <Text style={tw`text-gray-500 text-center mt-4 text-base`}>
              Không có đơn hàng nào
            </Text>
            <Text style={tw`text-gray-400 text-center mt-1 text-sm`}>
              Đơn hàng sẽ hiển thị ở đây khi có
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
