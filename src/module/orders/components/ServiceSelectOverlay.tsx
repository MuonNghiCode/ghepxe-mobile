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
    desc: "Giao hàng riêng biệt cho từng đơn",
    icon: "cube-outline",
    color: "#3B82F6", // Blue
    bgColor: "#EFF6FF",
    features: ["Ưu tiên giao"],
  },
  {
    label: "Đơn ghép",
    value: "multi",
    desc: "Gộp nhiều đơn hàng cùng tuyến",
    icon: "albums-outline",
    color: "#8B5CF6", // Purple
    bgColor: "#F3E8FF",
    features: ["Tiết kiệm chi phí"],
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
            width: "92%",
            maxWidth: 420,
            elevation: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
          },
        ]}
      >
        {/* Header */}
        <View style={tw`p-6 pb-4`}>
          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-xl font-bold text-slate-800 mb-1`}>
                Chọn loại dịch vụ
              </Text>
              <Text style={tw`text-sm text-slate-600`}>
                Lựa chọn phương thức giao hàng phù hợp
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

        {/* Service Options */}
        <View style={tw`px-6 pb-6`}>
          {SERVICES.map((item, index) => {
            const isSelected = selected === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[
                  tw`p-5 rounded-2xl mb-4 border-2`,
                  {
                    backgroundColor: isSelected ? item.bgColor : "#F8FAFC",
                    borderColor: isSelected ? item.color : "#E2E8F0",
                    shadowColor: isSelected ? item.color : "#000",
                    shadowOffset: { width: 0, height: isSelected ? 6 : 2 },
                    shadowOpacity: isSelected ? 0.15 : 0.05,
                    shadowRadius: isSelected ? 10 : 4,
                    elevation: isSelected ? 6 : 2,
                    transform: [{ scale: isSelected ? 1.02 : 1 }],
                  },
                ]}
                onPress={() => onSelect(item.value)}
                activeOpacity={0.8}
              >
                {/* Header row */}
                <View style={tw`flex-row items-center mb-3`}>
                  {/* Icon container */}
                  <View
                    style={[
                      tw`w-14 h-14 rounded-full items-center justify-center mr-4`,
                      {
                        backgroundColor: isSelected
                          ? item.color
                          : `${item.color}15`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={28}
                      color={isSelected ? "#FFFFFF" : item.color}
                    />
                  </View>

                  {/* Title and description */}
                  <View style={tw`flex-1`}>
                    <View style={tw`flex-row items-center`}>
                      <Text
                        style={[
                          tw`text-lg font-bold mr-2`,
                          {
                            color: isSelected ? item.color : "#1E293B",
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {isSelected && (
                        <View
                          style={[
                            tw`w-5 h-5 rounded-full items-center justify-center`,
                            {
                              backgroundColor: item.color,
                            },
                          ]}
                        >
                          <Ionicons
                            name="checkmark"
                            size={12}
                            color="#FFFFFF"
                          />
                        </View>
                      )}
                    </View>
                    <Text style={tw`text-sm text-slate-600 mt-1`}>
                      {item.desc}
                    </Text>
                  </View>
                </View>

                {/* Features */}
                <View style={tw`flex-row flex-wrap`}>
                  {item.features.map((feature, featureIndex) => (
                    <View
                      key={featureIndex}
                      style={[
                        tw`px-3 py-1 rounded-full mr-2 mb-2`,
                        {
                          backgroundColor: isSelected
                            ? `${item.color}20`
                            : "#F1F5F9",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          tw`text-xs font-medium`,
                          {
                            color: isSelected ? item.color : "#64748B",
                          },
                        ]}
                      >
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer */}
        <View
          style={[
            tw`px-6 pb-6 flex-row justify-center`,
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

export default ServiceSelectOverlay;
