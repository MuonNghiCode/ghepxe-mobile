import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

interface PickupTimeOverlayProps {
  visible: boolean;
  selected: string;
  onSelect: (value: string) => void;
  onCancel: () => void;
}

const PICKUP_TIMES = [
  {
    label: "Tiêu chuẩn",
    value: "standard",
    desc: "Lấy hàng trong ngày",
    icon: "time-outline",
  },
  {
    label: "Hoả tốc",
    value: "express",
    desc: "Lấy hàng trong 2 giờ",
    icon: "flash-outline",
  },
  {
    label: "Chậm",
    value: "slow",
    desc: "Lấy hàng trong 24 giờ",
    icon: "hourglass-outline",
  },
];

const PickupTimeOverlay: React.FC<PickupTimeOverlayProps> = ({
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
      <View style={tw`bg-white rounded-3xl p-6 w-11/12 shadow-lg`}>
        <Text style={tw`text-lg font-bold text-black mb-6 text-center`}>
          Chọn thời gian lấy hàng
        </Text>

        <View style={tw`flex-row justify-between`}>
          {PICKUP_TIMES.map((item) => {
            const isSelected = selected === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  tw`w-[30%] items-center p-4 rounded-2xl shadow-md`,
                  {
                    backgroundColor: isSelected ? "#E6F9F3" : "#F9F9F9",
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? "#00A982" : "#E5E7EB",
                  },
                ]}
                onPress={() => onSelect(item.value)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={item.icon as any}
                  size={28}
                  color={isSelected ? "#00A982" : "#6B7280"}
                />
                <Text
                  style={[
                    tw`mt-2 text-base text-center`,
                    {
                      color: isSelected ? "#00A982" : "#111827",
                      fontWeight: isSelected ? "700" : "500",
                    },
                  ]}
                >
                  {item.label}
                </Text>
                <Text style={tw`mt-1 text-xs text-gray-500 text-center`}>
                  {item.desc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={tw`flex-row justify-center mt-8`}>
          <TouchableOpacity
            style={tw`px-6 py-2 border border-gray-400 rounded-xl`}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={tw`text-gray-700 font-medium`}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PickupTimeOverlay;
