import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

interface ServiceSelectOverlayProps {
  visible: boolean;
  selected: string;
  onSelect: (value: string) => void;
  onCancel: () => void;
}

const SERVICES = [
  {
    label: "Đơn lẻ",
    value: "single",
    icon: "cube-outline",
    iconColor: "#3B82F6", // xanh dương
  },
  {
    label: "Đơn ghép",
    value: "multi",
    icon: "albums-outline",
    iconColor: "#8B5CF6", // tím
  },
];

const ServiceSelectOverlay: React.FC<ServiceSelectOverlayProps> = ({
  visible,
  selected,
  onSelect,
  onCancel,
}) => {
  if (!visible) return null;

  return (
    <View
      style={[
        tw`absolute top-0 left-0 right-0 bottom-0 bg-black/40 items-center justify-center`,
        { zIndex: 999 },
      ]}
    >
      <View style={tw`bg-white rounded-2xl p-6 w-11/12`}>
        <Text style={tw`text-lg font-bold text-black mb-5 text-center`}>
          Chọn loại dịch vụ
        </Text>

        <View style={tw`flex-row justify-between`}>
          {SERVICES.map((item) => {
            const isSelected = selected === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  tw`flex-1 items-center mx-2 p-5 rounded-xl`,
                  {
                    backgroundColor: isSelected ? "#E6F9F3" : "#F9F9F9",
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? "#00A982" : "#E0E0E0",
                  },
                ]}
                onPress={() => onSelect(item.value)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={item.icon as any}
                  size={40}
                  color={item.iconColor}
                />
                <Text
                  style={tw`mt-3 text-base ${
                    isSelected ? "text-[#00A982] font-semibold" : "text-black"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={tw`flex-row justify-end mt-6`}>
          <TouchableOpacity
            style={tw`px-5 py-2 bg-gray-200 rounded-lg`}
            onPress={onCancel}
          >
            <Text style={tw`text-black font-medium`}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ServiceSelectOverlay;
