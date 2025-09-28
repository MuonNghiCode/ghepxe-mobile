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
    desc: "Hàng hóa doanh nghiệp, thương mại",
    icon: "briefcase-outline",
    color: "#10B981", // Emerald
    bgColor: "#ECFDF5",
    features: ["Hóa đơn VAT", "Kê khai hải quan", "Bảo hiểm cao"],
  },
  {
    label: "Hàng hóa cá nhân",
    value: "personal",
    desc: "Đồ dùng cá nhân, quà tặng",
    icon: "person-outline",
    color: "#3B82F6", // Blue
    bgColor: "#EFF6FF",
    features: ["Thủ tục đơn giản", "Miễn thuế dưới 1M", "Giao tận nhà"],
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
        <View style={tw`p-6 pb-4`}>
          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-xl font-bold text-slate-800 mb-1`}>
                Chọn loại hàng hóa
              </Text>
              <Text style={tw`text-sm text-slate-600`}>
                Phân loại để áp dụng quy định phù hợp
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

        {/* Goods Type Options */}
        <View style={tw`px-6 pb-6`}>
          {GOODS_TYPES.map((item, index) => {
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
                    <View style={tw`flex-row items-center justify-between`}>
                      <Text
                        style={[
                          tw`text-lg font-bold`,
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
                            tw`w-6 h-6 rounded-full items-center justify-center`,
                            {
                              backgroundColor: item.color,
                            },
                          ]}
                        >
                          <Ionicons
                            name="checkmark"
                            size={14}
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
                <View style={tw`flex-row flex-wrap ml-18`}>
                  {item.features.map((feature, featureIndex) => (
                    <View
                      key={featureIndex}
                      style={[
                        tw`px-3 py-1 rounded-full mr-2 mb-2 flex-row items-center`,
                        {
                          backgroundColor: isSelected
                            ? `${item.color}20`
                            : "#F1F5F9",
                        },
                      ]}
                    >
                      <View
                        style={[
                          tw`w-1.5 h-1.5 rounded-full mr-2`,
                          {
                            backgroundColor: isSelected
                              ? item.color
                              : "#64748B",
                          },
                        ]}
                      />
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

                {/* Additional info for selected item */}
                {isSelected && (
                  <View
                    style={[
                      tw`mt-3 p-3 rounded-xl border border-dashed`,
                      {
                        backgroundColor: `${item.color}08`,
                        borderColor: `${item.color}40`,
                      },
                    ]}
                  >
                    <View style={tw`flex-row items-center`}>
                      <Ionicons
                        name="information-circle-outline"
                        size={16}
                        color={item.color}
                      />
                      <Text
                        style={[
                          tw`text-xs font-medium ml-2`,
                          { color: item.color },
                        ]}
                      >
                        {item.value === "private"
                          ? "Yêu cầu giấy tờ doanh nghiệp và hóa đơn"
                          : "Giới hạn giá trị và trọng lượng theo quy định"}
                      </Text>
                    </View>
                  </View>
                )}
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

export default GoodsTypeOverlay;
