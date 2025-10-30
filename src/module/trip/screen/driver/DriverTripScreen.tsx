import React, { useCallback, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import suggestedOrders from "../../../../constants/suggestedOrder";
import OrderStatusCard from "../../../../components/OrderStatusCard";
import DriverRouteCard from "../../components/DriverRouterCard";
import { useRouteRequest } from "src/hooks/useRouteRequest";
import { useAuth } from "src/context/AuthContext";

type TabType = "order" | "trip";

export default function DriverTripScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState<TabType>("order");

  // Hook lấy route requests từ backend
  const { routeRequests, getAllRouteRequests, loading } = useRouteRequest();
  const { user } = useAuth();

  useEffect(() => {
    getAllRouteRequests();
  }, []);

  const pendingOrders = suggestedOrders.filter(
    (order) => order.status === "CHỜ XÁC NHẬN"
  );

  const handleCreateRoute = useCallback(() => {
    navigation.navigate("CreateDriverRoute" as never);
  }, [navigation]);

  const handleAcceptOrder = useCallback(() => {
    // xử lý nhận đơn
  }, []);

  const handleContactCustomer = useCallback(() => {
    // xử lý liên hệ
  }, []);

  const handleCancelRoute = useCallback(
    (routeId: string) => {
      // Nếu muốn xóa khỏi backend thì gọi API, nếu chỉ muốn xóa khỏi UI thì filter lại
      // Ví dụ: gọi API hủy chuyến, sau đó gọi getAllRouteRequests lại
      // getAllRouteRequests();
    },
    [
      /* getAllRouteRequests */
    ]
  );

  const renderHeader = () => (
    <View style={tw`bg-[#4CC9A6] py-2`}>
      <View style={tw`flex-row items-center`}>
        <View style={tw`flex-1 pl-6 pt-2`}>
          <Text style={tw`text-white text-xl font-bold mb-2 leading-snug`}>
            Bạn đang rảnh{"\n"}bạn có muốn ghép đơn
          </Text>
          <Text style={tw`text-white text-sm mb-3`} numberOfLines={2}>
            Xem các chuyến hàng khả dụng bên dưới
          </Text>
        </View>
        <Image
          source={require("../../../../assets/pictures/trip/rest.png")}
          style={{
            width: 210,
            height: 180,
            resizeMode: "contain",
            marginRight: 0,
            top: 10,
          }}
        />
      </View>
    </View>
  );

  const renderCTAButton = () => (
    <View style={tw`px-4 mt-4`}>
      <View style={tw`bg-[#00A982] rounded-xl flex-row items-center p-4`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-white font-bold text-base`}>
            Đăng tin chuyến về
          </Text>
          <Text style={tw`text-white text-xs mt-1`}>
            Tạo tuyến đường và nhận đơn hàng ghép
          </Text>
        </View>
        <TouchableOpacity
          style={tw`bg-white rounded-full px-5 py-2 ml-2`}
          onPress={handleCreateRoute}
        >
          <Text
            style={tw`text-[#00A982] font-semibold text-base`}
            numberOfLines={1}
          >
            Đăng tuyến ngay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={tw`flex-row px-4 mt-4`}>
      <TouchableOpacity
        style={tw.style(
          "px-4 py-2 rounded-full mr-2",
          tab === "order" ? "bg-[#00A982]" : "bg-gray-100"
        )}
        onPress={() => setTab("order")}
      >
        <Text
          style={tw.style(
            "text-xs font-semibold",
            tab === "order" ? "text-white" : "text-gray-700"
          )}
        >
          ĐƠN HÀNG
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw.style(
          "px-4 py-2 rounded-full",
          tab === "trip" ? "bg-[#00A982]" : "bg-gray-100"
        )}
        onPress={() => setTab("trip")}
      >
        <Text
          style={tw.style(
            "text-xs font-semibold",
            tab === "trip" ? "text-white" : "text-gray-700"
          )}
        >
          CHUYẾN XE
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSectionTitle = (title: string, count: number) => (
    <View style={tw`flex-row items-center px-4 mt-4 mb-4`}>
      <Text style={tw`text-base font-semibold text-gray-700`} numberOfLines={1}>
        {title}
      </Text>
      <View style={tw`flex-1`} />
      <View style={tw`bg-[#00A982] rounded-full px-2 py-0.5`}>
        <Text style={tw`text-xs text-white font-bold`}>{count}</Text>
      </View>
    </View>
  );

  const renderEmptyState = (
    title: string,
    subtitle: string,
    imagePath: any
  ) => (
    <View style={tw`flex-1 items-center justify-center px-8`}>
      <Image source={imagePath} style={tw`w-40 h-30`} resizeMode="contain" />
      <Text style={tw`mt-6 text-base font-bold text-black text-center`}>
        {title}
      </Text>
      <Text style={tw`mt-2 text-sm text-gray-500 text-center`}>{subtitle}</Text>
    </View>
  );

  const renderOrdersList = () => (
    <View style={tw`px-4`}>
      {pendingOrders.map((order) => (
        <OrderStatusCard
          key={order.id}
          order={order}
          variant="suggestion"
          onAccept={handleAcceptOrder}
          onContact={handleContactCustomer}
        />
      ))}
    </View>
  );

  // Sử dụng dữ liệu từ backend, map đúng field cho DriverRouteCard
  const renderRoutesList = () => (
    <View style={tw`px-4`}>
      {routeRequests.map((route) => (
        <DriverRouteCard
          key={route.routeRequestId}
          route={{
            id: route.routeRequestId,
            avatar: user?.avatarUrl || "https://i.imgur.com/1bX5QH6.png", // Lấy avatar từ user
            driverName:
              user?.username ||
              route.vehicle?.brand + " " + route.vehicle?.model,
            rating: 5,
            from: route.pickupAddress,
            to: route.dropoffAddress,
            vehicle: route.vehicle?.vehicleType || "",
            goods: route.supportedCommodities,
            size: route.availableVolume + " m³",
            discount: Math.round(route.availableWeight / 10),
            estimatedPrice: route.estimatedRouteCost
              ? `₫${route.estimatedRouteCost.toLocaleString()}`
              : "₫0",
            distance: "",
            duration: "",
          }}
          variant="driver"
          onCancel={() => handleCancelRoute(route.routeRequestId)}
        />
      ))}
    </View>
  );

  const renderOrdersTab = () => (
    <>
      {renderSectionTitle("Đơn hàng đang chờ", pendingOrders.length)}
      {pendingOrders.length === 0
        ? renderEmptyState(
            "Chưa có đơn hàng nào",
            "Hãy chờ khách hàng để có đơn nhé!",
            require("../../../../assets/pictures/home/driveroffline.png")
          )
        : renderOrdersList()}
    </>
  );

  const renderTripsTab = () => (
    <>
      {renderSectionTitle("Chuyến xe đã tạo", routeRequests.length)}
      {loading ? (
        <View style={tw`items-center justify-center py-8`}>
          <Text style={tw`text-gray-500`}>Đang tải chuyến xe...</Text>
        </View>
      ) : routeRequests.length === 0 ? (
        renderEmptyState(
          "Bạn chưa có chuyến nào",
          "Hãy tạo đơn để bắt đầu nhận hàng nào",
          require("../../../../assets/pictures/home/driveroffline.png")
        )
      ) : (
        renderRoutesList()
      )}
    </>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F8FDFB]`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderCTAButton()}
        {renderTabs()}
        {tab === "order" && renderOrdersTab()}
        {tab === "trip" && renderTripsTab()}
      </ScrollView>
    </SafeAreaView>
  );
}
