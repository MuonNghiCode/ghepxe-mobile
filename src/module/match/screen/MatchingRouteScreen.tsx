import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MatchingRouteCard from "../components/MatchingRouteCard";

const mockRoutes = [
  {
    id: "1",
    avatar: "https://i.pravatar.cc/100?img=1",
    driverName: "Phạm Minh Quân",
    rating: 5,
    from: "TP. Hồ Chí Minh",
    to: "TP. Vũng Tàu",
    vehicle: "Xe tải",
    goods: "Quần áo · 8kg",
    size: "35x25x15cm",
    discount: 12,
  },
  {
    id: "2",
    avatar: "https://i.pravatar.cc/100?img=1",
    driverName: "Phạm Minh Quân",
    rating: 5,
    from: "TP. Hồ Chí Minh",
    to: "TP. Vũng Tàu",
    vehicle: "Xe tải",
    goods: "Quần áo · 8kg",
    size: "35x25x15cm",
    discount: 12,
  },
  {
    id: "3",
    avatar: "https://i.pravatar.cc/100?img=1",
    driverName: "Phạm Minh Quân",
    rating: 5,
    from: "TP. Hồ Chí Minh",
    to: "TP. Vũng Tàu",
    vehicle: "Xe tải",
    goods: "Quần áo · 8kg",
    size: "35x25x15cm",
    discount: 12,
  },
  // ...thêm các chuyến khác nếu muốn
];

export default function MatchingRouteScreen() {
  const navigation = useNavigation();

  const handleCreateOrder = useCallback(() => {
    navigation.navigate("ConfirmOrder" as never);
  }, [navigation]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100`}
      >
        <TouchableOpacity
          onPress={handleGoBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={tw`w-10 h-10 items-center justify-center`}
        >
          <Ionicons name="chevron-back" size={24} color="#00A982" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-semibold text-black flex-1 text-center`}>
          Tuyến xe phù hợp
        </Text>
        <View style={tw`w-10 h-10`} />
      </View>
      {/* Content */}
      {mockRoutes.length === 0 ? (
        <View style={tw`flex-1 items-center justify-center bg-[#F8FFFE]`}>
          <Image
            source={require("../../../assets/pictures/match/no-matching.png")}
            style={{ width: 180, height: 140, resizeMode: "contain" }}
          />
          <Text style={tw`mt-6 text-base font-bold text-black text-center`}>
            Không có tuyến xe nào phù hợp
          </Text>
          <Text style={tw`mt-2 text-sm text-gray-500 text-center px-8`}>
            Tạo đơn hàng để tài xế có thể nhận đơn hàng của bạn
          </Text>
        </View>
      ) : (
        <FlatList
          data={mockRoutes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={tw`px-4 pt-4 pb-4 bg-[#F8FFFE]`}
          renderItem={({ item }) => (
            <MatchingRouteCard
              route={item}
              onContact={() => {
                /* xử lý liên hệ */
              }}
              onMatch={() => {
                /* xử lý ghép xe */
              }}
            />
          )}
        />
      )}
      {/* Footer Button */}
      <View style={tw`px-4 pb-8`}>
        <TouchableOpacity
          style={tw`bg-[#00A982] rounded-xl py-3 items-center w-full`}
          onPress={handleCreateOrder}
        >
          <Text style={tw`text-white text-base font-bold`}>Tạo đơn</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
