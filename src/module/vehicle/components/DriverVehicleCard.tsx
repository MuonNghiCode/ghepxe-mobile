import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

type DriverVehicleCardProps = {
  vehicle: {
    id: string;
    name: string;
    plate: string;
    type: string;
    image: any;
    status: string;
  };
  onPress: (vehicleId: string) => void;
};

export default function DriverVehicleCard({
  vehicle,
  onPress,
}: DriverVehicleCardProps) {
  return (
    <TouchableOpacity
      style={tw`bg-white rounded-2xl mx-4 mb-4 px-5 py-4 flex-row items-center border border-gray-200 shadow-sm`}
      onPress={() => onPress(vehicle.id)}
      activeOpacity={0.85}
    >
      <Image
        source={vehicle.image}
        style={tw`w-16 h-16 rounded-lg mr-4`}
        resizeMode="contain"
      />
      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-bold text-gray-800`} numberOfLines={1}>
          {vehicle.name}
        </Text>
        <Text style={tw`text-xs text-gray-500 mt-1`}>
          Biển số:{" "}
          <Text style={tw`font-semibold text-black`}>{vehicle.plate}</Text>
        </Text>
        <View style={tw`flex-row items-center mt-2`}>
          <View style={tw`bg-blue-100 rounded-full px-2 py-0.5 mr-2`}>
            <Text style={tw`text-xs text-blue-600`}>{vehicle.type}</Text>
          </View>
          <View style={tw`bg-green-100 rounded-full px-2 py-0.5`}>
            <Text style={tw`text-xs text-green-600`}>{vehicle.status}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#00A982" />
    </TouchableOpacity>
  );
}
