import { useState, useCallback, useMemo, useRef, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";
import OrderStatusCard from "@components/OrderStatusCard";
import UserAvatar, { useUserInfo } from "src/components/UserAvatar";
import { useAuth } from "src/context/AuthContext";
import { useProfile } from "src/hooks/useProfile";
import suggestedOrders from "src/constants/suggestedOrder";

const { width: screenWidth } = Dimensions.get("window");

export default function DriverHomeScreen() {
  const [isOnline, setIsOnline] = useState(false);
  const [orders, setOrders] = useState(suggestedOrders);

  const navigation = useNavigation();
  const { user } = useAuth();
  const { profile, fetchProfile } = useProfile();
  const { displayName } = useUserInfo();

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

  // Lấy thông tin user khi component mount
  useEffect(() => {
    if (!profile && user) {
      fetchProfile();
    }
  }, [user, profile, fetchProfile]);

  const toggleOnlineStatus = useCallback(() => {
    setIsOnline((prev) => !prev);
    // TODO: Gọi API để cập nhật trạng thái online/offline
  }, []);

  const handleAcceptOrder = useCallback((orderId: string) => {
    console.log(`Accept order: ${orderId}`);
    // TODO: Gọi API để accept order
  }, []);

  const handleContactCustomer = useCallback((orderId: string) => {
    console.log(`Contact customer for order: ${orderId}`);
    // TODO: Mở chức năng liên hệ khách hàng
  }, []);

  const handleAvatarPress = useCallback(() => {
    navigation.navigate("User" as never);
  }, [navigation]);

  const currentOrders = orders.filter((order) => order.status === "ĐANG GIAO");
  const suggestedOrdersOnly = orders.filter(
    (order) => order.status === "CHỜ XÁC NHẬN"
  );

  // --- Render functions ---
  const renderHeader = () => (
    <View style={tw`relative`}>
      <Image
        source={require("../../../assets/pictures/home/background.png")}
        style={[tw`h-75`, { width: screenWidth }]}
        resizeMode="cover"
      />
      <View style={[tw`absolute inset-0`, overlayStyle]} />

      {/* User Avatar */}
      <View style={tw`absolute top-12 right-6`}>
        <UserAvatar
          size="medium"
          onPress={handleAvatarPress}
          style={tw`shadow-lg`}
        />
      </View>

      {/* Welcome Message */}
      <View style={tw`absolute bottom-30 left-6`}>
        <Text style={tw`text-white/80 text-sm mb-1`}>
          Xin chào, {displayName}!
        </Text>
        <Text
          style={[
            tw`text-white text-3xl max-w-[200px]`,
            { fontFamily: "RobotoSerifSemiBold", lineHeight: 32 },
          ]}
        >
          Bạn đã có{"\n"}đơn chưa?
        </Text>
      </View>
    </View>
  );

  const renderOnlineSwitch = () => (
    <View style={[tw`-mt-15 mb-6 bg-white rounded-2xl p-4`, shadowStyle]}>
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
          ios_backgroundColor="#D1D5DB"
        />
      </View>
    </View>
  );

  const renderOfflineSection = () => (
    <View style={tw`items-center mt-10 mb-20`}>
      <View style={tw`mb-6`}>
        <Image
          source={require("../../../assets/pictures/home/driveroffline.png")}
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
      <Text style={tw`text-gray-500 text-center max-w-[250px] mb-4`}>
        Bật online để bắt đầu nhận đơn và kiếm tiền
      </Text>

      {/* Quick actions when offline */}
      <View style={tw`flex-row gap-4`}>
        <TouchableOpacity
          style={tw`bg-[#00A982] rounded-xl px-6 py-3`}
          onPress={toggleOnlineStatus}
        >
          <Text style={tw`text-white font-semibold`}>Bắt đầu làm việc</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-gray-100 rounded-xl px-6 py-3`}
          onPress={() => navigation.navigate("Profile" as never)}
        >
          <Text style={tw`text-gray-700 font-semibold`}>Xem thống kê</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCurrentOrders = () => (
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
          <Text style={tw`text-gray-500 mt-2 font-medium`}>
            Bạn chưa có đơn nào đang giao
          </Text>
          <Text style={tw`text-gray-400 text-sm mt-1`}>
            Chấp nhận đơn từ danh sách gợi ý bên dưới
          </Text>
        </View>
      ) : (
        currentOrders.map((order) => (
          <OrderStatusCard
            key={order.id}
            order={order}
            onAccept={handleAcceptOrder}
            onContact={handleContactCustomer}
            showCustomerInfo={true}
            variant="current"
          />
        ))
      )}
    </View>
  );

  const renderSuggestedOrders = () => (
    <View style={tw`mb-6`}>
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <Text style={tw`text-base font-semibold text-gray-700`}>
          Đơn Ghép Gợi Ý
        </Text>
        <View style={tw`flex-row items-center gap-2`}>
          <TouchableOpacity
            style={tw`bg-blue-500 rounded-full px-3 py-1`}
            onPress={() => {
              // TODO: Refresh suggested orders
              console.log("Refresh suggested orders");
            }}
          >
            <Ionicons name="refresh" size={12} color="white" />
          </TouchableOpacity>
          <View
            style={tw`bg-[#00A982] rounded-full w-6 h-6 items-center justify-center`}
          >
            <Text style={tw`text-white text-xs font-bold`}>
              {suggestedOrdersOnly.length}
            </Text>
          </View>
        </View>
      </View>
      {suggestedOrdersOnly.length === 0 ? (
        <View style={tw`items-center py-8 bg-gray-50 rounded-xl`}>
          <Ionicons name="search-outline" size={48} color="#D1D5DB" />
          <Text style={tw`text-gray-500 mt-2 font-medium`}>
            Không có đơn gợi ý
          </Text>
          <Text style={tw`text-gray-400 text-sm mt-1 text-center`}>
            Hệ thống sẽ gợi ý đơn phù hợp với vị trí của bạn
          </Text>
        </View>
      ) : (
        suggestedOrdersOnly.map((order) => (
          <OrderStatusCard
            key={order.id}
            order={order}
            onAccept={handleAcceptOrder}
            onContact={handleContactCustomer}
            showCustomerInfo={true}
            variant="suggestion"
          />
        ))
      )}
    </View>
  );

  // --- Main render ---
  return (
    <View style={tw`flex-1 bg-[#fcfcfc]`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      >
        {renderHeader()}
        <View style={tw`bg-white rounded-t-[3rem] -mt-10 pt-4 w-full`}>
          <View style={tw`px-5`}>
            {renderOnlineSwitch()}
            {!isOnline && renderOfflineSection()}
            {isOnline && (
              <>
                {renderCurrentOrders()}
                {renderSuggestedOrders()}
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
