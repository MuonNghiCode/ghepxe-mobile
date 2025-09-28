import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
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
    color: "#3B82F6", // Blue
    bgColor: "#EFF6FF",
  },
  {
    label: "Hoả tốc",
    value: "express",
    desc: "Lấy hàng trong 2 giờ",
    icon: "flash-outline",
    color: "#F59E0B", // Amber
    bgColor: "#FFFBEB",
  },
  {
    label: "Chậm",
    value: "slow",
    desc: "Lấy hàng trong 24 giờ",
    icon: "hourglass-outline",
    color: "#10B981", // Emerald
    bgColor: "#ECFDF5",
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
        tw`absolute top-0 left-0 right-0 bottom-0 items-center justify-center`,
        {
          zIndex: 999,
          backgroundColor: "rgba(0, 0, 0, 0.6)",
        },
      ]}
    >
      {/* Backdrop blur effect */}
      <View
        style={[
          tw`absolute top-0 left-0 right-0 bottom-0`,
          {
            backgroundColor: "rgba(15, 23, 42, 0.4)",
          },
        ]}
      />

      {/* Main content */}
      <View
        style={[
          tw`bg-white rounded-3xl mx-4 shadow-2xl overflow-hidden`,
          {
            width: "90%",
            maxWidth: 400,
            elevation: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
          },
        ]}
      >
        {/* Header */}
        <View
          style={[
            tw`p-6 pb-4`,
            {
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            },
          ]}
        >
          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-xl font-bold text-slate-800 mb-1`}>
                Chọn thời gian lấy hàng
              </Text>
              <Text style={tw`text-sm text-slate-600`}>
                Vui lòng chọn thời gian phù hợp
              </Text>
            </View>
            <TouchableOpacity
              style={[
                tw`p-2 rounded-full`,
                {
                  backgroundColor: "rgba(148, 163, 184, 0.1)",
                },
              ]}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Options */}
        <View style={tw`p-6 pt-8`}>
          {PICKUP_TIMES.map((item, index) => {
            const isSelected = selected === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  tw`flex-row items-center p-4 rounded-2xl mb-3`,
                  {
                    backgroundColor: isSelected ? item.bgColor : "#F8FAFC",
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? item.color : "#E2E8F0",
                    shadowColor: isSelected ? item.color : "#000",
                    shadowOffset: { width: 0, height: isSelected ? 4 : 1 },
                    shadowOpacity: isSelected ? 0.15 : 0.05,
                    shadowRadius: isSelected ? 8 : 2,
                    elevation: isSelected ? 4 : 1,
                    transform: [{ scale: isSelected ? 1.02 : 1 }],
                  },
                ]}
                onPress={() => onSelect(item.value)}
                activeOpacity={0.8}
              >
                {/* Icon container */}
                <View
                  style={[
                    tw`w-12 h-12 rounded-full items-center justify-center mr-4`,
                    {
                      backgroundColor: isSelected
                        ? item.color
                        : `${item.color}20`,
                    },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={isSelected ? "#FFFFFF" : item.color}
                  />
                </View>

                {/* Content */}
                <View style={tw`flex-1`}>
                  <Text
                    style={[
                      tw`text-lg mb-1`,
                      {
                        color: isSelected ? item.color : "#1E293B",
                        fontWeight: isSelected ? "700" : "600",
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text style={tw`text-sm text-slate-500`}>{item.desc}</Text>
                </View>

                {/* Selection indicator */}
                {isSelected && (
                  <View
                    style={[
                      tw`w-6 h-6 rounded-full items-center justify-center ml-2`,
                      {
                        backgroundColor: item.color,
                      },
                    ]}
                  >
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer */}
        <View
          style={[
            tw`p-6 pt-0 flex-row justify-center`,
            {
              borderTopWidth: 1,
              borderTopColor: "#F1F5F9",
            },
          ]}
        >
          <TouchableOpacity
            style={[
              tw`px-8 py-3 rounded-xl flex-row items-center`,
              {
                backgroundColor: "#F1F5F9",
              },
            ]}
            onPress={onCancel}
            activeOpacity={0.8}
          >
            <Ionicons
              name="close-outline"
              size={16}
              color="#64748B"
              style={tw`mr-2`}
            />
            <Text style={tw`text-slate-600 font-semibold`}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PickupTimeOverlay;
