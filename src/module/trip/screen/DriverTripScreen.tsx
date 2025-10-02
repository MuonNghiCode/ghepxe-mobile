import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import suggestedOrders from "../../../constants/suggestedOrder";
import OrderStatusCard from "../../../components/OrderStatusCard";

export default function DriverTripScreen() {
  const navigation = useNavigation();
  const [tab, setTab] = useState<"order" | "trip">("order");

  const pendingOrders = suggestedOrders.filter(
    (o) => o.status === "CHỜ XÁC NHẬN"
  );

  const handleCreateRoute = useCallback(() => {
    navigation.navigate("CreateDriverRoute" as never);
  }, [navigation]);
  return (
    <SafeAreaView style={tw`flex-1 bg-[#F8FDFB]`}>
      <ScrollView>
        {/* Header */}
        <View style={tw`bg-[#4CC9A6] py-2`}>
          {/* Banner nội dung */}
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
              source={require("../../../assets/pictures/trip/rest.png")}
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
        {/* CTA Button dưới header */}
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
                ellipsizeMode="tail"
              >
                Đăng tuyến ngay
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Tabs */}
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
        {tab === "order" && (
          <View style={tw`flex-row items-center px-4 mt-4 mb-4`}>
            <Text
              style={tw`text-base font-semibold text-gray-700`}
              numberOfLines={1}
            >
              Đơn hàng đang chờ
            </Text>
            <View style={tw`flex-1`} />
            <View style={tw`bg-[#00A982] rounded-full px-2 py-0.5`}>
              <Text style={tw`text-xs text-white font-bold`}>
                {pendingOrders.length}
              </Text>
            </View>
          </View>
        )}
        {tab === "order" &&
          (pendingOrders.length === 0 ? (
            <View style={tw`flex-1 items-center justify-center `}>
              <Image
                source={require("../../../assets/pictures/home/driver-offline.png")}
                style={{ width: 160, height: 120, resizeMode: "contain" }}
              />
              <Text style={tw`mt-6 text-base font-bold text-black text-center`}>
                Chưa có đơn hàng nào
              </Text>
              <Text style={tw`mt-2 text-sm text-gray-500 text-center px-8`}>
                Hãy chờ khách hàng để có đơn nhé!
              </Text>
            </View>
          ) : (
            <View style={tw`px-4 `}>
              {pendingOrders.map((order) => (
                <OrderStatusCard
                  key={order.id}
                  order={order}
                  variant="suggestion"
                  onAccept={() => {
                    /* xử lý nhận đơn */
                  }}
                  onContact={() => {
                    /* xử lý liên hệ */
                  }}
                />
              ))}
            </View>
          ))}
        {tab === "trip" && (
          <>
            {/* Title */}
            <View style={tw`flex-row items-center px-4 mt-4 mb-10`}>
              <Text style={tw`text-base font-semibold text-gray-700`}>
                Chuyến xe đã tạo
              </Text>
              <View style={tw`flex-1`} />
              <View style={tw`bg-[#00A982] rounded-full px-2 py-0.5`}>
                <Text style={tw`text-xs text-white font-bold`}>0</Text>
              </View>
            </View>
            {/* Empty State */}
            <View style={tw`flex-1 items-center justify-center`}>
              <Image
                source={require("../../../assets/pictures/home/driver-offline.png")}
                style={{ width: 160, height: 120, resizeMode: "contain" }}
              />
              <Text style={tw`mt-6 text-base font-bold text-black text-center`}>
                Bạn chưa có chuyến nào
              </Text>
              <Text style={tw`mt-2 text-sm text-gray-500 text-center px-8`}>
                Hãy tạo đơn để bắt đầu nhận hàng nào
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
