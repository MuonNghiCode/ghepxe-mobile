import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { UserTabParamList } from "src/navigation/type";
import UserOrderCard from "@components/UserOrderCard";
import { OrderCardStatus } from "src/types/order.interface";
import { useShipRequest } from "src/hooks/useShipRequest";
import { useAuth } from "src/context/AuthContext";
import { ShipRequestResponseData } from "src/types";

const TABS = [
  { key: "ongoing", label: "ĐANG DIỄN RA" },
  { key: "completed", label: "ĐÃ HOÀN THÀNH" },
  { key: "cancelled", label: "ĐÃ HUỶ" },
];

type UserOrderScreenNavigationProp = NativeStackNavigationProp<
  UserTabParamList,
  "UserOrder"
>;

export default function UserOrderScreen() {
  const [tab, setTab] = useState("ongoing");
  const navigation = useNavigation<UserOrderScreenNavigationProp>();
  const { user } = useAuth();
  const { shipRequests, loading, getAllShipRequests, refreshShipRequests } =
    useShipRequest();
  const [refreshing, setRefreshing] = useState(false);

  // Lấy danh sách ship requests khi component mount
  useEffect(() => {
    if (user?.userId) {
      getAllShipRequests(user.userId);
    }
  }, [user?.userId]);

  // Refresh khi quay lại màn hình này
  useFocusEffect(
    useCallback(() => {
      if (user?.userId) {
        getAllShipRequests(user.userId);
      }
    }, [user?.userId])
  );

  // Hàm xác định status của đơn hàng (tạm thời, sau này sẽ có từ backend)
  const getOrderStatus = (
    shipRequest: ShipRequestResponseData
  ): OrderCardStatus => {
    // Logic tạm thời - sau này sẽ có status từ backend
    // Bạn có thể thêm trường status vào ShipRequestResponseData
    return "pending"; // Mặc định là pending
  };

  // Filter orders theo tab
  const filteredOrders = shipRequests.filter((order) => {
    const status = getOrderStatus(order);
    if (tab === "ongoing") return status === "pending" || status === "picking";
    if (tab === "completed") return status === "review";
    if (tab === "cancelled") return status === "cancelled";
    return true;
  });

  // Hàm refresh
  const handleRefresh = async () => {
    if (user?.userId) {
      setRefreshing(true);
      await refreshShipRequests(user.userId);
      setRefreshing(false);
    }
  };

  const handleCardPress = useCallback(
    (shipRequest: ShipRequestResponseData) => {
      console.log("Navigating with shipRequestId:", shipRequest.shipRequestId);

      // Truyền cả data luôn, không chỉ ID
      navigation.navigate("UserOrderDetail", {
        shipRequestId: shipRequest.shipRequestId,
        orderStatus: "waiting",
        orderData: shipRequest, // Thêm này
      });
    },
    [navigation]
  );

  const renderHeader = () => (
    <View style={tw`pt-12 pb-4 bg-white`}>
      <Text style={tw`text-lg font-semibold text-center text-black`}>
        Đơn hàng
      </Text>
    </View>
  );

  const renderTabs = () => (
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
  );

  const renderOrderList = () => {
    if (loading && !refreshing && shipRequests.length === 0) {
      return (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#00A982" />
          <Text style={tw`mt-2 text-gray-500`}>Đang tải...</Text>
        </View>
      );
    }

    if (filteredOrders.length === 0) {
      return (
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-gray-500 text-base`}>
            {tab === "ongoing" && "Chưa có đơn hàng đang diễn ra"}
            {tab === "completed" && "Chưa có đơn hàng hoàn thành"}
            {tab === "cancelled" && "Chưa có đơn hàng bị hủy"}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`pt-2 pb-8 px-4`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#00A982"]}
            tintColor="#00A982"
          />
        }
      >
        {filteredOrders.map((shipRequest) => {
          const firstItem = shipRequest.items[0];
          return (
            <UserOrderCard
              key={shipRequest.shipRequestId}
              status={getOrderStatus(shipRequest)}
              productImage={firstItem?.imageLink || ""}
              productName={firstItem?.name || "Không có tên"}
              quantity={shipRequest.items.length}
              weight={shipRequest.items
                .reduce((sum, item) => sum + item.weight, 0)
                .toString()}
              price={55000} // Giá tạm thời
              pickupAddress={`${shipRequest.pickupStreet}, ${shipRequest.pickupDistrict}, ${shipRequest.pickupProvince}`}
              deliveryAddress={`${shipRequest.dropoffStreet}, ${shipRequest.dropoffDistrict}, ${shipRequest.dropoffProvince}`}
              headerText={new Date(
                shipRequest.pickupWindowStart
              ).toLocaleString("vi-VN")}
              tagText={firstItem?.type || ""}
              showMore={shipRequest.items.length > 1}
              onReview={() => {}}
              onPress={() => handleCardPress(shipRequest)}
            />
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={tw`flex-1 bg-[#F8FFFE]`}>
      {renderHeader()}
      {renderTabs()}
      {renderOrderList()}
    </View>
  );
}
