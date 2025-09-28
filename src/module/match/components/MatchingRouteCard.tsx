import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

type Route = {
  avatar: string;
  driverName: string;
  rating: number;
  from: string;
  to: string;
  vehicle: string;
  goods: string;
  size: string;
  discount: number;
};

type MatchingRouteCardProps = {
  route: Route;
  onContact: () => void;
  onMatch: () => void;
};

export default function MatchingRouteCard({
  route,
  onContact,
  onMatch,
}: MatchingRouteCardProps) {
  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  };

  return (
    <View style={[tw`bg-white rounded-xl p-4 mb-3`, shadowStyle]}>
      {/* Header: Avatar + Name + Rating ngang hàng */}
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <Image
          source={{ uri: route.avatar }}
          style={tw`w-10 h-10 rounded-full mr-3`}
        />
        <View style={tw`flex-1 flex-row items-center justify-between`}>
          <Text style={tw`font-semibold text-gray-800 text-base`}>
            {route.driverName}
          </Text>
          <View style={tw`ml-2 flex-row flex-1 items-center`}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={tw`ml-1 text-[#FFB800] text-sm font-medium`}>
              {route.rating}
            </Text>
          </View>
        </View>
      </View>

      {/* Route: From → To */}
      <View style={tw`flex-row items-center mb-3 bg-gray-50 p-3 rounded-lg`}>
        <View style={tw`flex-1`}>
          <Text
            style={tw`font-semibold text-gray-800 text-sm`}
            numberOfLines={1}
          >
            {route.from}
          </Text>
        </View>
        <View style={tw`items-center mx-3`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-2 h-2 bg-[#00A982] rounded-full`} />
            <View style={tw`w-6 h-px bg-[#00A982] mx-1`} />
            <Ionicons name="arrow-forward" size={12} color="#00A982" />
          </View>
        </View>
        <View style={tw`flex-1`}>
          <Text
            style={tw`font-semibold text-gray-800 text-sm`}
            numberOfLines={1}
          >
            {route.to}
          </Text>
        </View>
      </View>

      {/* Vehicle & Goods Info */}
      <View style={tw`flex-row items-center mb-3`}>
        <Ionicons
          name="car-outline"
          size={16}
          color="#00A982"
          style={tw`mr-1`}
        />
        <Text style={tw`text-xs text-gray-600`}>
          {route.vehicle} · {route.goods} · {route.size}
        </Text>
      </View>

      {/* CO₂ Reduction */}
      <View style={tw`flex-row items-center mb-3`}>
        <Ionicons name="sync-outline" size={14} color="#00A982" />
        <Text style={tw`text-xs text-[#00A982] ml-1 font-medium`}>
          Giảm {route.discount}kg CO₂ với đơn này
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={tw`flex-row gap-2`}>
        <TouchableOpacity
          style={tw`flex-1 bg-[#00A982] rounded-lg py-3`}
          onPress={onMatch}
        >
          <Text style={tw`text-white text-center font-semibold text-sm`}>
            Ghép xe
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 border border-[#00A982] rounded-lg py-3`}
          onPress={onContact}
        >
          <Text style={tw`text-[#00A982] text-center font-semibold text-sm`}>
            Liên hệ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
