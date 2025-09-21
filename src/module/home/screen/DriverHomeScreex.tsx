import { useState, useCallback, useMemo } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Switch,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import OrderCard from "@components/OrderCard";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");

const suggestedOrders: {
  id: string;
  serviceType: "single" | "shared";
  requestTime: string;
  pickup: { address: string; details: string };
  delivery: { address: string; distance: string };
  price: string;
  co2Reduction: string;
  status: string;
}[] = [
  {
    id: "1",
    serviceType: "single",
    requestTime: "1 giờ trước",
    pickup: {
      address: "TP. Hồ Chí Minh",
      details: "Quần áo • 8kg • 35x25x15cm",
    },
    delivery: {
      address: "TP. Vũng Tàu",
      distance: "100km - 2h",
    },
    price: "+120.000đ",
    co2Reduction: "Giảm 12kg CO₂ với đơn này",
    status: "CHỜ XÁC NHẬN",
  },
  {
    id: "2",
    serviceType: "shared",
    requestTime: "30 phút trước",
    pickup: {
      address: "TP. Hồ Chí Minh",
      details: "Quận 1 • 5kg • 20x15x10cm",
    },
    delivery: {
      address: "TP. Biên Hòa",
      distance: "50km - 1h",
    },
    price: "+85.000đ",
    co2Reduction: "Giảm 8kg CO₂ với đơn này",
    status: "ĐANG GIAO",
  },
  {
    id: "3",
    serviceType: "shared",
    requestTime: "2 giờ trước",
    pickup: {
      address: "TP. Hồ Chí Minh",
      details: "Đồ điện tử • 3kg • 30x20x10cm",
    },
    delivery: {
      address: "TP. Thủ Đức",
      distance: "25km - 45min",
    },
    price: "+60.000đ",
    co2Reduction: "Giảm 5kg CO₂ với đơn này",
    status: "CHỜ XÁC NHẬN",
  },
];

export default function DriverHomeScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const [orders, setOrders] = useState(suggestedOrders);
  const navigation = useNavigation();
  const shadowStyle = useMemo(
    () => ({
      shadowColor: "#00A982",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    }),
    []
  );

  const overlayStyle = useMemo(
    () => ({
      backgroundColor: "rgba(0,0,0,0.2)",
    }),
    []
  );

  const toggleOnlineStatus = useCallback(() => {
    setIsOnline((prev) => !prev);
  }, []);

  const handleAcceptOrder = useCallback((orderId: string) => {
    console.log(`Accept order: ${orderId}`);
  }, []);

  const handleContactCustomer = useCallback((orderId: string) => {
    console.log(`Contact customer for order: ${orderId}`);
  }, []);

  const currentOrders = orders.filter((order) => order.status === "ĐANG GIAO");
  const suggestedOrdersOnly = orders.filter(
    (order) => order.status === "CHỜ XÁC NHẬN"
  );

  return (
    <View style={tw`flex-1 bg-[#fcfcfc]`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        <View style={tw`relative`}>
          <Image
            source={require("../../../assets/pictures/home/background.png")}
            style={[tw`h-75`, { width: screenWidth }]}
            resizeMode="cover"
          />
          <View style={[tw`absolute inset-0`, overlayStyle]} />
          <TouchableOpacity
            style={tw`absolute top-12 right-6`}
            onPress={() => navigation.navigate("User" as never)}
          >
            <View
              style={tw`w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-[#00A982] items-center justify-center`}
            >
              <Text style={tw`text-white font-bold text-lg`}>P</Text>
            </View>
          </TouchableOpacity>

          <View style={tw`absolute bottom-30 left-6`}>
            <Text
              style={[
                tw`text-white text-3xl max-w-[160px]`,
                { fontFamily: "RobotoSerifSemiBold", lineHeight: 32 },
              ]}
            >
              Bạn đã có{"\n"}đơn chưa?
            </Text>
          </View>
        </View>

        <View style={tw`bg-white rounded-t-[3rem] -mt-10 pt-4 w-full`}>
          <View style={tw`px-5`}>
            <View
              style={[tw`-mt-15 mb-6 bg-white rounded-2xl p-4`, shadowStyle]}
            >
              <View style={tw`flex-row items-center justify-between`}>
                <View style={tw`flex-row items-center`}>
                  <View
                    style={tw`w-3 h-3 rounded-full mr-3 ${
                      isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                  <Text style={tw`text-base font-medium text-black`}>
                    {isOnline ? "Đang online" : "Đang offline"}
                  </Text>
                </View>
                <Switch
                  value={isOnline}
                  onValueChange={toggleOnlineStatus}
                  trackColor={{ false: "#D1D5DB", true: "#00A982" }}
                  thumbColor={isOnline ? "#ffffff" : "#ffffff"}
                />
              </View>
            </View>

            {!isOnline && (
              <View style={tw`items-center mt-20 mb-20`}>
                <View style={tw`mb-6`}>
                  <Image
                    source={require("../../../assets/pictures/home/driver-offline.png")}
                    style={tw`w-40 h-32`}
                    resizeMode="contain"
                  />
                </View>
                <Text
                  style={[
                    tw`text-xl font-bold text-center mb-2 text-gray-800`,
                    { fontFamily: "RobotoSerifBold" },
                  ]}
                >
                  Bạn đang nghỉ ngơi
                </Text>
                <Text style={tw`text-gray-500 text-center max-w-[250px]`}>
                  Bật online để bắt đầu nhận đơn
                </Text>
              </View>
            )}

            {isOnline && (
              <>
                <View style={tw`mb-6`}>
                  <View style={tw`flex-row items-center justify-between mb-3`}>
                    <Text style={tw`text-base font-semibold text-gray-700`}>
                      Đơn Đang Giao
                    </Text>
                    <View
                      style={tw`bg-[#00A982] rounded-full w-6 h-6 items-center justify-center`}
                    >
                      <Text style={tw`text-white text-xs font-bold`}>
                        {currentOrders.length}
                      </Text>
                    </View>
                  </View>

                  {currentOrders.length === 0 ? (
                    <View style={tw`items-center py-8 bg-gray-50 rounded-xl`}>
                      <Ionicons name="cube-outline" size={48} color="#D1D5DB" />
                      <Text style={tw`text-gray-500 mt-2`}>
                        Bạn chưa có đơn nào
                      </Text>
                    </View>
                  ) : (
                    currentOrders.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onAccept={handleAcceptOrder}
                        onContact={handleContactCustomer}
                        showCustomerInfo={false}
                        variant="current"
                      />
                    ))
                  )}
                </View>

                <View style={tw`mb-6`}>
                  <View style={tw`flex-row items-center justify-between mb-3`}>
                    <Text style={tw`text-base font-semibold text-gray-700`}>
                      Đơn Ghép Gợi Ý
                    </Text>
                    <View
                      style={tw`bg-[#00A982] rounded-full w-6 h-6 items-center justify-center`}
                    >
                      <Text style={tw`text-white text-xs font-bold`}>
                        {suggestedOrdersOnly.length}
                      </Text>
                    </View>
                  </View>

                  {suggestedOrdersOnly.length === 0 ? (
                    <View style={tw`items-center py-8 bg-gray-50 rounded-xl`}>
                      <Ionicons
                        name="search-outline"
                        size={48}
                        color="#D1D5DB"
                      />
                      <Text style={tw`text-gray-500 mt-2`}>
                        Không có đơn gợi ý
                      </Text>
                    </View>
                  ) : (
                    suggestedOrdersOnly.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        onAccept={handleAcceptOrder}
                        onContact={handleContactCustomer}
                        showCustomerInfo={false}
                        variant="suggestion"
                      />
                    ))
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
