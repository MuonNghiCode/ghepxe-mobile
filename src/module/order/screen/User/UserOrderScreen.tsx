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
      console.log("Fetching ship requests for user:", user.userId);
      getAllShipRequests(user.userId);
    }
  }, [user?.userId]);

  // Refresh khi quay lại màn hình này
  useFocusEffect(
    useCallback(() => {
      if (user?.userId) {
        console.log("Refreshing ship requests");
        getAllShipRequests(user.userId);
      }
    }, [user?.userId])
  );

  // Hàm xác định status của đơn hàng theo backend status
  const getOrderStatus = (
    shipRequest: ShipRequestResponseData
  ): OrderCardStatus => {
    const status = shipRequest.status?.toLowerCase();

    switch (status) {
      case "pending":
        return "pending";
      case "accepted":
      case "picking":
      case "delivering":
        return "picking";
      case "delivered":
      case "completed":
        return "review";
      case "cancelled":
        return "cancelled";
      default:
        return "pending";
    }
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
      console.log("Navigating with shipRequest:", {
        id: shipRequest.shipRequestId,
        status: shipRequest.status,
      });

      // Map backend status sang UI status
      let orderStatus: "waiting" | "delivering" | "delivered" | "cancelled" =
        "waiting";
      const status = shipRequest.status?.toLowerCase();

      if (status === "pending") {
        orderStatus = "waiting";
      } else if (
        status === "accepted" ||
        status === "picking" ||
        status === "delivering"
      ) {
        orderStatus = "delivering";
      } else if (status === "delivered" || status === "completed") {
        orderStatus = "delivered";
      } else if (status === "cancelled") {
        orderStatus = "cancelled";
      }

      navigation.navigate("UserOrderDetail", {
        shipRequestId: shipRequest.shipRequestId,
        orderStatus: orderStatus,
        orderData: shipRequest,
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
        <View style={tw`flex-1 items-center justify-center px-4`}>
          <Text style={tw`text-gray-500 text-base text-center`}>
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
          const firstItem = shipRequest.items?.[0];
          const totalWeight =
            shipRequest.items?.reduce(
              (sum, item) => sum + (item.weight || 0),
              0
            ) || 0;

          return (
            <UserOrderCard
              key={shipRequest.shipRequestId}
              status={getOrderStatus(shipRequest)}
              productImage={firstItem?.imageUrl || ""}
              productName={firstItem?.name || "Không có tên"}
              quantity={shipRequest.items?.length || 0}
              weight={totalWeight.toString()}
              // Format currency cho giá
              price={Number(55000).toLocaleString("vi-VN")}
              pickupAddress={shipRequest.pickupAddress || "Không có địa chỉ"}
              deliveryAddress={shipRequest.dropoffAddress || "Không có địa chỉ"}
              // Không truyền headerText để dùng config.header mặc định
              // headerText={...} <-- XÓA DÒNG NÀY
              showMore={(shipRequest.items?.length || 0) > 1}
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
