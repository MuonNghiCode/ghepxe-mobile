import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import DriverRouteCard from "../../components/DriverRouterCard";
import { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import mockDriverRoutes from "src/constants/driver";

export default function UserTripScreen() {
  const navigation = useNavigation();
  const [driverRoutes, setDriverRoutes] = useState(mockDriverRoutes);

  const handleJoinTrip = useCallback((routeId: string) => {
    // Logic để ghép xe - có thể navigate đến trang đặt hàng
    console.log("Joining trip:", routeId);
    // navigation.navigate("BookingScreen", { routeId });
  }, []);

  const handleContactDriver = useCallback((routeId: string) => {
    // Logic để liên hệ tài xế - có thể mở chat hoặc gọi điện
    console.log("Contacting driver for route:", routeId);
    // navigation.navigate("ChatScreen", { routeId });
  }, []);

  const renderHeader = () => (
    <View style={tw`bg-[#4CC9A6] py-2`}>
      <View style={tw`flex-row items-center`}>
        <View style={tw`flex-1 pl-6 pt-2`}>
          <Text style={tw`text-white text-xl font-bold mb-2 leading-snug`}>
            Tài xế đang {"\n"}rảnh bạn có muốn gửi hàng
          </Text>
          <Text style={tw`text-white text-sm mb-3`} numberOfLines={2}>
            Xem các chuyến đi khả dụng bên dưới
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

  const renderEmptyState = (
    title: string,
    subtitle: string,
    imagePath: any
  ) => (
    <View style={tw`flex-1 items-center justify-center px-8 py-12`}>
      <Image source={imagePath} style={tw`w-40 h-30`} resizeMode="contain" />
      <Text style={tw`mt-6 text-base font-bold text-black text-center`}>
        {title}
      </Text>
      <Text style={tw`mt-2 text-sm text-gray-500 text-center`}>{subtitle}</Text>
    </View>
  );

  const renderRoutesList = () => (
    <View style={tw`px-4 py-4`}>
      {driverRoutes.map((route) => (
        <DriverRouteCard
          key={route.id}
          route={route}
          variant="user"
          onJoinTrip={() => handleJoinTrip(route.id)}
          onContact={() => handleContactDriver(route.id)}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F8FDFB]`}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {/* Nội dung chuyến xe */}
        {driverRoutes.length === 0
          ? renderEmptyState(
              "Chưa có chuyến nào",
              "Chưa có tài xế nào đăng chuyến đi",
              require("../../../../assets/pictures/home/driveroffline.png")
            )
          : renderRoutesList()}
      </ScrollView>
    </SafeAreaView>
  );
}
