import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

interface VoucherCardProps {
  image: any;
  title: string;
  description: string;
  expiredDate: string;
  isSelected?: boolean;
  variant?: "explore" | "owned";
  onPress: () => void;
  onConditionPress?: () => void;
}

export default function VoucherCard({
  image,
  title,
  description,
  expiredDate,
  isSelected = false,
  variant = "explore",
  onPress,
  onConditionPress,
}: VoucherCardProps) {
  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  };

  const buttonText = variant === "explore" ? "LẤY VOUCHER" : "DÙNG NGAY";

  return (
    <View style={tw`mb-3`}>
      <View
        style={[
          tw`bg-white rounded-2xl overflow-hidden`,
          isSelected && tw`ring-2 ring-[#00A982]`,
          shadowStyle,
        ]}
      >
        <View style={tw`flex-row items-center p-4`}>
          {/* Voucher Image with gradient background */}
          <View style={tw`relative mr-4`}>
            <Image
              source={image}
              style={tw`w-12 h-12 rounded-lg`}
              resizeMode="contain"
            />
          </View>

          {/* Content */}
          <View style={tw`flex-1 mr-3`}>
            <Text
              style={tw`font-bold text-gray-900 text-base mb-1`}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              style={tw`text-sm text-gray-600 leading-5 mb-2`}
              numberOfLines={1}
            >
              {description}
            </Text>

            {/* Expiry with icon */}
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-1 h-1 bg-gray-400 rounded-full mr-2`} />
              <Text style={tw`text-xs text-gray-500`}>HSD: {expiredDate}</Text>
            </View>
          </View>

          {/* Right section */}
          <View style={tw`items-end justify-between h-12`}>
            {/* Condition button */}
            <TouchableOpacity
              onPress={onConditionPress}
              style={tw`flex-row items-center`}
            >
              <Text style={tw`text-xs text-[#00A982] mr-1`}>Điều kiện</Text>
              <Ionicons name="information-circle" size={12} color="#00A982" />
            </TouchableOpacity>

            {/* Action button */}
            <TouchableOpacity onPress={onPress}>
              <LinearGradient
                colors={["#00A982", "#00B894"]}
                style={tw`rounded-full px-4 py-1.5`}
              >
                <Text style={tw`text-white text-xs font-bold`}>
                  {buttonText}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom decorative elements */}
        <View style={tw`flex-row justify-between items-center px-4 -mt-1 pb-3`}>
          <View style={tw`w-2 h-2 bg-gray-100 rounded-full -ml-1`} />
          <View
            style={tw`flex-1 h-px border-t border-dashed border-gray-200 mx-2`}
          />
          <View style={tw`w-2 h-2 bg-gray-100 rounded-full -mr-1`} />
        </View>
      </View>

      {/* Selected indicator */}
      {isSelected && (
        <View style={tw`absolute -top-1 -right-1 z-10`}>
          <LinearGradient
            colors={["#00A982", "#00B894"]}
            style={tw`w-6 h-6 rounded-full items-center justify-center`}
          >
            <Ionicons name="checkmark" size={14} color="white" />
          </LinearGradient>
        </View>
      )}
    </View>
  );
}
