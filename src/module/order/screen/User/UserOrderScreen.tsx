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
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { Dimensions } from "react-native";

const TABS = [
  { key: "ongoing", label: "ĐANG DIỄN RA" },
  { key: "completed", label: "ĐÃ HOÀN THÀNH" },
  { key: "cancelled", label: "ĐÃ HUỶ" },
];

type UserOrderScreenNavigationProp = NativeStackNavigationProp<
  UserTabParamList,
  "UserOrder"
>;

const CARD_WIDTH = Dimensions.get("window").width - 32;

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

  const renderSkeletonList = () => (
    <View style={tw`flex-1 px-4 pt-2`}>
      {[...Array(3)].map((_, idx) => (
        <View
          key={idx}
          style={[
            tw`mb-3 bg-white rounded-2xl`,
            { width: CARD_WIDTH, padding: 16, borderRadius: 16 },
          ]}
        >
          {/* Hàng trên: ảnh + thông tin */}
          <View style={tw`flex-row items-center mb-3`}>
            <View style={tw`w-16 h-16 rounded-lg bg-gray-200 mr-3`} />
            <View style={tw`flex-1`}>
              <View style={tw`h-4 bg-gray-200 rounded w-2/3 mb-2`} />
              <View style={tw`h-3 bg-gray-100 rounded w-1/2 mb-2`} />
              <View style={tw`h-3 bg-gray-100 rounded w-1/3`} />
            </View>
          </View>
          {/* Đường phân cách */}
          <View style={tw`h-1 bg-gray-100 my-2 rounded`} />
          {/* Hàng dưới: mô tả ngắn */}
          <View style={tw`h-3 bg-gray-100 rounded w-full mb-2`} />
          <View style={tw`h-3 bg-gray-100 rounded w-3/4`} />
        </View>
      ))}
    </View>
  );

  const renderOrderList = () => {
    if (loading && !refreshing && shipRequests.length === 0) {
      // Hiển thị skeleton thay cho spinner
      return renderSkeletonList();
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
              productImage={firstItem?.imageUrl ?? undefined}
              productImageFileId={firstItem?.imageFileId ?? undefined} // Thêm fileId
              productName={firstItem?.name || "Không có tên"}
              quantity={shipRequest.items?.length || 0}
              weight={totalWeight.toString()}
              price={Number(55000).toLocaleString("vi-VN")}
              pickupAddress={shipRequest.pickupAddress || "Không có địa chỉ"}
              deliveryAddress={shipRequest.dropoffAddress || "Không có địa chỉ"}
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
