import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DriverTripScreen() {
  const navigation = useNavigation();

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
              onPress={() => {
                /* Xử lý đăng tuyến */
              }}
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
          <TouchableOpacity style={tw`px-4 py-2 rounded-full bg-gray-100 mr-2`}>
            <Text style={tw`text-xs font-semibold text-gray-700`}>
              ĐƠN HÀNG
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`px-4 py-2 rounded-full bg-[#00A982]`}>
            <Text style={tw`text-xs font-semibold text-white`}>CHUYẾN XE</Text>
          </TouchableOpacity>
        </View>
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
      </ScrollView>
    </SafeAreaView>
  );
}
