import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

interface GoodsTypeOverlayProps {
  visible: boolean;
  selected: string;
  onSelect: (value: string) => void;
  onCancel: () => void;
}

const GOODS_TYPES = [
  {
    label: "Hàng hóa tư nhân",
    value: "private",
    icon: "briefcase-outline",
    color: "#00A982",
  },
  {
    label: "Hàng hóa cá nhân",
    value: "personal",
    icon: "person-outline",
    color: "#3B82F6",
  },
];

const GoodsTypeOverlay: React.FC<GoodsTypeOverlayProps> = ({
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
      <View style={tw`bg-white rounded-2xl p-6 w-10/12`}>
        <Text style={tw`text-base font-semibold text-black mb-4`}>
          Chọn loại hàng hóa
        </Text>

        <View style={tw`flex-row justify-between`}>
          {GOODS_TYPES.map((item) => {
            const isSelected = selected === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  tw`w-[48%] items-center p-5 rounded-xl`,
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
                  color={item.color}
                />
                <Text
                  style={[
                    tw`mt-3 text-base text-center flex-wrap`,
                    {
                      color: isSelected ? "#00A982" : "#000",
                      fontWeight: isSelected ? "600" : "400",
                      maxWidth: "100%", // ép text không bị cắt
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={tw`flex-row justify-end mt-6`}>
          <TouchableOpacity
            style={tw`px-4 py-2 bg-gray-200 rounded-lg`}
            onPress={onCancel}
          >
            <Text style={tw`text-black`}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GoodsTypeOverlay;
