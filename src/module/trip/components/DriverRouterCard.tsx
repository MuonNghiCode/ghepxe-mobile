import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

type Route = {
  id: string;
  avatar: string;
  driverName: string;
  rating: number;
  from: string;
  to: string;
  vehicle: string;
  goods: string;
  size: string;
  discount: number;
  estimatedPrice: string;
  distance?: string; // Thêm khoảng cách
  duration?: string; // Thêm thời gian
};

type DriverRouteCardProps = {
  route: Route;
  variant?: "user" | "driver";
  onJoinTrip?: () => void;
  onContact?: () => void;
  onCancel?: () => void;
};

export default function DriverRouteCard({
  route,
  variant = "driver",
  onJoinTrip,
  onContact,
  onCancel,
}: DriverRouteCardProps) {
  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  };

  return (
    <View style={[tw`bg-white rounded-xl p-4 mb-3`, shadowStyle]}>
      {/* Header: Avatar + Name + Rating */}
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

      {/* Route: From → To với khoảng cách và thời gian */}
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
          {/* Hiển thị khoảng cách và thời gian trên 1 dòng */}
          {(route.distance || route.duration) && (
            <Text style={tw`text-xs text-gray-500 mb-1 text-center`}>
              {route.distance}
              {route.distance && route.duration && " - "}
              {route.duration}
            </Text>
          )}
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

      {/* Chi phí dự kiến - hiển thị cho cả user và driver */}
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <Text style={tw`text-sm text-gray-600`}>Chi phí dự kiến:</Text>
        <Text style={tw`text-lg font-bold text-[#00A982]`}>
          {route.estimatedPrice}
        </Text>
      </View>

      {/* CO₂ Reduction */}
      <View style={tw`flex-row items-center mb-4`}>
        <Ionicons name="sync-outline" size={14} color="#00A982" />
        <Text style={tw`text-xs text-[#00A982] ml-1 font-medium`}>
          Giảm {route.discount}kg CO₂ với đơn này
        </Text>
      </View>

      {/* Action Buttons */}
      {variant === "user" ? (
        // User: 2 buttons - Ghép xe và Liên hệ
        <View style={tw`flex-row gap-2`}>
          <TouchableOpacity
            style={tw`flex-1 bg-[#00A982] rounded-lg py-2.5`}
            onPress={onJoinTrip}
          >
            <Text style={tw`text-white text-center font-semibold text-sm`}>
              Ghép xe
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`flex-1 border border-gray-300 rounded-lg py-2.5`}
            onPress={onContact}
          >
            <Text style={tw`text-gray-700 text-center font-semibold text-sm`}>
              Liên hệ
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Driver: 1 button - Hủy chuyến
        <View style={tw`flex-row`}>
          <TouchableOpacity
            style={tw`flex-1 bg-[#FF3B30] rounded-lg py-2.5`}
            onPress={onCancel}
          >
            <Text style={tw`text-white text-center font-semibold text-sm`}>
              Hủy chuyến
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
