import React from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

interface CategorySelectOverlayProps {
  visible: boolean;
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
  onCancel: () => void;
}

export default function CategorySelectOverlay({
  visible,
  categories,
  selected,
  onSelect,
  onCancel,
}: CategorySelectOverlayProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={tw`flex-1 justify-end bg-black/50`}>
        <View style={tw`bg-white rounded-t-3xl pb-8`}>
          {/* Header */}
          <View
            style={tw`flex-row items-center justify-between px-5 py-4 border-b border-gray-200`}
          >
            <Text style={tw`text-lg font-bold text-black`}>
              Chọn loại hàng hóa
            </Text>
            <TouchableOpacity onPress={onCancel} style={tw`p-2`}>
              <Ionicons name="close" size={24} color="#6B6B6B" />
            </TouchableOpacity>
          </View>

          {/* Categories List - Không có icon */}
          <ScrollView style={tw`max-h-96 px-5 py-4`}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={tw`flex-row items-center justify-between py-4 border-b border-gray-100`}
                onPress={() => {
                  onSelect(category);
                  onCancel();
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={tw`text-base flex-1 ${
                    selected === category
                      ? "text-[#00A982] font-semibold"
                      : "text-black"
                  }`}
                >
                  {category}
                </Text>
                {selected === category && (
                  <Ionicons name="checkmark-circle" size={24} color="#00A982" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
