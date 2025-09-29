import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import OrderCard from "../../../components/OrderCard";
import { UserTabParamList } from "src/navigation/type";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const TABS = [
  { key: "ongoing", label: "ĐANG DIỄN RA" },
  { key: "completed", label: "ĐÃ HOÀN THÀNH" },
  { key: "cancelled", label: "ĐÃ HUỶ" },
];

const orders: Order[] = [
  {
    id: "1",
    status: "pending",
    productImage: require("../../../assets/pictures/auth/background.png"),
    productName: "Rau củ tươi",
    quantity: 3,
    weight: "20kg",
    price: "250.000đ",
    pickupAddress: "Đường X, Phường Y, Quận XY, Thành Phố XXX, ...",
    deliveryAddress: "Đường X, Phường Y, Quận XY, Thành Phố XXX, ...",
    time: "Đơn hàng của bạn đang chờ xác nhận",
    tag: "Chờ xác nhận",
  },
  {
    id: "2",
    status: "picking",
    productImage: require("../../../assets/pictures/auth/background.png"),
    productName: "Rau củ tươi",
    quantity: 1,
    weight: "10kg",
    price: "250.000đ",
    pickupAddress: "Đường X, Phường Y, Quận XY, Thành Phố XXX, ...",
    deliveryAddress: "Đường X, Phường Y, Quận XY, Thành Phố XXX, ...",
    time: "Thời gian lấy hàng ước tính 1 ngày",
    tag: "Đang lấy hàng",
  },
  {
    id: "3",
    status: "picking",
    productImage: require("../../../assets/pictures/auth/background.png"),
    productName: "Rau củ tươi",
    quantity: 1,
    weight: "25kg",
    price: "200.000đ",
    pickupAddress: "Đường X, Phường Y, Quận XY, Thành Phố XXX, ...",
    deliveryAddress: "Đường X, Phường Y, Quận XY, Thành Phố XXX, ...",
    time: "Thời gian lấy hàng ước tính 1 ngày",
    tag: "Đang lấy hàng",
  },
  {
    id: "4",
    status: "picking",
    productImage: require("../../../assets/pictures/auth/background.png"),
    productName: "Rau củ tươi",
    quantity: 10,
    weight: "10kg",
    price: "250.000đ",
    pickupAddress: "Đường X, Phường Y, Quận XY, Thành Phố XXX, ...",
    deliveryAddress: "Đường X, Phường Y, Quận XY, Thành Phố XXX, ...",
    time: "Thời gian giao hàng ước tính 1 ngày",
    tag: "Đang giao hàng",
  },
  {
    id: "5",
    status: "review",
    productImage: require("../../../assets/pictures/auth/background.png"),
    productName: "Rau củ tươi",
    quantity: 1,
    weight: "20kg",
    price: "200.000đ",
    pickupAddress: "Đường X, Phường Y, Quận XY, Thành Phố XXX, ...",
    deliveryAddress: "Đường X, Phường Y, Quận XY, Thành Phố XXX, ...",
    time: "",
    tag: "",
  },
  {
    id: "6",
    status: "cancelled",
    productImage: require("../../../assets/pictures/auth/background.png"),
    productName: "Rau củ tươi",
    quantity: 1,
    weight: "20kg",
    price: "200.000đ",
    pickupAddress: "Đường X, Phường Y, Quận XY, Thành Phố XXX, ...",
    deliveryAddress: "Đường X, Phường Y, Quận XY, Thành Phố XXX, ...",
    time: "Hoàn tiền thành công",
    tag: "Đã huỷ",
  },
];

interface Order {
  id: string;
  status: "pending" | "picking" | "review" | "cancelled";
  productImage: any;
  productName: string;
  quantity: number;
  weight: string;
  price: string;
  pickupAddress: string;
  deliveryAddress: string;
  time: string;
  tag: string;
}

type UserOrderScreenNavigationProp = NativeStackNavigationProp<
  UserTabParamList,
  "UserOrder"
>;

const statusMap = {
  pending: "waiting",
  picking: "delivering",
  review: "delivered",
  cancelled: "cancelled",
};

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
      navigation.navigate("OrderDetail", {
        ...order,
        orderStatus: statusMap[order.status], // luôn có orderStatus
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
          <OrderCard
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
