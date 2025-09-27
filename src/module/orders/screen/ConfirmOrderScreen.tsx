import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from "react-native";
import tw from "twrnc";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const specialRequests = [
  { label: "Giao hàng về", value: "120,000" },
  { label: "Bốc hàng", value: "50,000" },
  { label: "Hỗ trợ tài xế", value: "30,000" },
  { label: "Nhắn tin SMS", value: "10,000" },
  { label: "Xuất hóa đơn điện tử", value: "5,000" },
];

const allCategory = [
  { label: "Thực phẩm" },
  { label: "Mỹ phẩm" },
  { label: "Khác" },
];

export default function ConfirmOrderScreen() {
  const navigation = useNavigation();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-100`}>
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
          Chi tiết đơn hàng
        </Text>
        {/* Icon save */}
        <View style={tw`w-10 h-10`} />
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-6`}>
        {/* Lộ trình */}
        <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4`}>
          <View style={tw`flex-row items-center mb-2`}>
            <Text style={tw`text-base font-semibold text-black`}>Lộ trình</Text>
            <View style={tw`flex-1`} />
            <Text style={tw`text-base font-semibold text-black`}>Hoán đổi</Text>
          </View>
          <View style={tw`mt-2`}>
            <View style={tw`flex-row items-center mb-4`}>
              <MaterialCommunityIcons
                name="stop"
                size={14}
                color="white"
                style={tw`bg-black rounded-full p-1 `}
              />
              <Text style={tw`ml-2 text-base flex-1 text-black font-medium `}>
                XV44+7R Thành Phố XXX
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
            </View>
            <View style={tw`flex-row items-center`}>
              <Entypo
                name="arrow-down"
                size={14}
                color="#fff"
                style={tw`bg-[#00A982] rounded-full p-1 `}
              />
              <Text style={tw`ml-2 text-base flex-1 text-black font-medium`}>
                XV44+7R Thành Phố XXX
              </Text>
              <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
            </View>
          </View>
        </View>

        {/* Nội thành & Thời gian lấy hàng */}
        <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4`}>
          <View style={tw`flex-row items-center mb-2`}>
            <View style={tw`rounded-full p-3 bg-gray-200`} />
            <Text style={tw`ml-2 text-base flex-1 font-semibold text-black`}>
              Nội thành
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
          </View>
          <View style={tw`flex-row items-center mt-2`}>
            <Ionicons
              name="time-outline"
              size={27}
              color="#00A982"
              // style={tw`p-1 bg-[#00A982] rounded-full`}
            />
            <Text style={tw`ml-2 text-base flex-1 font-semibold text-black`}>
              Thời gian lấy hàng
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#6B6B6B" />
          </View>
        </View>

        {/* Thông tin hàng hóa */}
        <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4`}>
          <View style={tw`flex-row items-center mb-2`}>
            <MaterialCommunityIcons
              name="package-variant"
              size={20}
              color="#00A982"
            />
            <Text style={tw`ml-2 text-base font-semibold text-black`}>
              Thông tin hàng hóa
            </Text>
            <View style={tw`flex-1`} />
            <TouchableOpacity>
              <Text style={tw`text-xs text-[#00A982]`}>Xem hình ảnh</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`flex-row items-center mt-2`}>
            <Text style={tw`text-xs text-gray-500 mr-2`}>Khối lượng:</Text>
            <View style={tw`flex-row`}>
              {["1kg", "2kg", "5kg", "10kg", "20kg"].map((kg, idx) => (
                <TouchableOpacity
                  key={kg}
                  style={tw`px-2 py-1 mx-1 rounded-lg bg-gray-100`}
                >
                  <Text style={tw`text-xs text-black`}>{kg}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={tw`mt-2`}>
            <TextInput
              style={tw`border border-gray-200 rounded-lg px-3 py-2 text-base text-black`}
              placeholder="Nhập khối lượng"
              placeholderTextColor="#6B6B6B"
            />
          </View>
          <View style={tw`mt-2 flex-row`}>
            <Text style={tw`text-xs text-gray-500 mr-2`}>Loại hàng hóa:</Text>
            {allCategory.map((type) => (
              <TouchableOpacity
                key={type.label}
                style={tw`px-2 py-1 mx-1 rounded-lg bg-gray-100`}
              >
                <Text style={tw`text-xs text-black`}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={tw`mt-2`}>
            <TouchableOpacity style={tw`flex-row items-center`}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color="#00A982"
              />
              <Text style={tw`ml-2 text-xs text-[#00A982]`}>
                Chỉ cho chủ xe xử lý
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Yêu cầu đặc biệt */}
        <View style={tw`bg-white rounded-2xl mx-4 mt-4 p-4`}>
          <Text style={tw`text-base font-semibold text-black mb-2`}>
            Yêu cầu đặc biệt
          </Text>
          {specialRequests.map((item, idx) => (
            <View
              key={item.label}
              style={tw`flex-row items-center justify-between py-2`}
            >
              <Text style={tw`text-base text-black`}>{item.label}</Text>
              <Text style={tw`text-xs text-gray-500`}>{item.value}</Text>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#00A982"
              />
            </View>
          ))}
        </View>

        {/* Footer: Khuyến mãi, Thanh toán, Tổng phí, Tạo đơn, Tìm chuyến */}
        <View style={tw`bg-white rounded-t-2xl mt-4 px-4 py-4`}>
          <View style={tw`flex-row items-center justify-between mb-2`}>
            <TouchableOpacity style={tw`flex-row items-center`}>
              <Ionicons name="pricetag-outline" size={18} color="#00A982" />
              <Text style={tw`ml-2 text-base text-[#00A982] font-semibold`}>
                Khuyến mãi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-row items-center`}>
              <Ionicons name="card-outline" size={18} color="#00A982" />
              <Text style={tw`ml-2 text-base text-[#00A982] font-semibold`}>
                Thanh toán
              </Text>
            </TouchableOpacity>
          </View>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text style={tw`text-base text-black font-semibold`}>Tổng phí</Text>
            <Text style={tw`text-xl text-[#00A982] font-bold`}>455,000</Text>
          </View>
          <View style={tw`flex-row items-center justify-between`}>
            <TouchableOpacity
              style={tw`flex-1 bg-[#00A982] py-3 rounded-xl mr-2`}
            >
              <Text style={tw`text-white text-center font-bold text-base`}>
                Tạo đơn
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-1 bg-white border border-[#00A982] py-3 rounded-xl ml-2`}
            >
              <Text style={tw`text-[#00A982] text-center font-bold text-base`}>
                Tìm chuyến
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
