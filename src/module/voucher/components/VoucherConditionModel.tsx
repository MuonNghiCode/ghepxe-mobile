import React from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import tw from "twrnc";

interface VoucherConditionModalProps {
  visible: boolean;
  onClose: () => void;
  conditions?: string[];
  voucherTitle?: string;
}

export default function VoucherConditionModal({
  visible,
  onClose,
  conditions = [
    "Áp dụng cho đơn hàng từ 200.000đ",
    "Không áp dụng cùng với khuyến mãi khác",
    "Có hiệu lực đến 01/01/2026",
    "Chỉ sử dụng 1 lần/tài khoản",
  ],
  voucherTitle = "Voucher",
}: VoucherConditionModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={tw`flex-1 bg-black bg-opacity-60 justify-end`}
        onPress={onClose}
      >
        <Pressable
          style={tw`bg-white rounded-t-3xl max-h-3/4`}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Top indicator */}
          <View style={tw`items-center pt-2 pb-4`}>
            <View style={tw`w-12 h-1 bg-gray-300 rounded-full`} />
          </View>

          {/* Header */}
          <View style={tw`px-6 pb-4 border-b border-gray-100`}>
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xl font-bold text-gray-900 mb-1`}>
                  Điều kiện sử dụng
                </Text>
                <Text style={tw`text-sm text-gray-500`}>{voucherTitle}</Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                style={tw`w-10 h-10 bg-gray-100 rounded-full items-center justify-center`}
              >
                <Ionicons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content */}
          <ScrollView
            style={tw`px-6 py-4`}
            showsVerticalScrollIndicator={false}
          >
            {conditions.map((condition, index) => (
              <View
                key={index}
                style={tw`flex-row items-start mb-4 ${
                  index === conditions.length - 1 ? "mb-6" : ""
                }`}
              >
                {/* Icon */}
                <View
                  style={tw`w-6 h-6 bg-[#E6F7F3] rounded-full items-center justify-center mr-3 mt-0.5`}
                >
                  <Ionicons name="checkmark" size={14} color="#00A982" />
                </View>

                {/* Text */}
                <Text style={tw`flex-1 text-sm text-gray-700 leading-6`}>
                  {condition}
                </Text>
              </View>
            ))}

            {/* Info box */}
            <View
              style={tw`bg-blue-50 rounded-xl p-4 mb-4 flex-row items-start`}
            >
              <Ionicons
                name="information-circle"
                size={20}
                color="#3B82F6"
                style={tw`mr-2 mt-0.5`}
              />
              <Text style={tw`flex-1 text-sm text-blue-800 leading-5`}>
                Vui lòng đọc kỹ điều kiện trước khi sử dụng voucher
              </Text>
            </View>
          </ScrollView>

          {/* Footer button */}
          <View style={tw`px-6 py-4 border-t border-gray-100`}>
            <TouchableOpacity onPress={onClose}>
              <LinearGradient
                colors={["#00A982", "#00B894"]}
                style={tw`rounded-xl py-4`}
              >
                <Text
                  style={tw`text-white text-center font-semibold text-base`}
                >
                  Đã hiểu
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
