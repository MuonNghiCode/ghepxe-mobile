import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import tw from "twrnc";

interface DriverNoteOverlayProps {
  visible: boolean;
  value: string;
  onChange: (text: string) => void;
  onCancel: () => void;
  onOk: () => void;
}

const DriverNoteOverlay: React.FC<DriverNoteOverlayProps> = ({
  visible,
  value,
  onChange,
  onCancel,
  onOk,
}) => {
  if (!visible) return null;
  return (
    <View
      style={[
        tw`absolute top-0 left-0 right-0 bottom-0 bg-black/40 items-center justify-center`,
        { zIndex: 999 },
      ]}
    >
      <View style={tw`bg-white rounded-3xl p-6 w-11/12 shadow-xl`}>
        {/* Tiêu đề */}
        <Text style={tw`text-lg font-bold text-black mb-4 text-center`}>
          Nhập ghi chú cho tài xế
        </Text>

        {/* Ô nhập */}
        <TextInput
          style={tw`bg-gray-100 border border-gray-300 rounded-2xl px-4 py-3 text-base text-black mb-6`}
          placeholder="Nhập ghi chú..."
          placeholderTextColor="#6B6B6B"
          value={value}
          onChangeText={onChange}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />

        {/* Nút hành động */}
        <View style={tw`flex-row justify-between`}>
          <TouchableOpacity
            style={tw`flex-1 border border-gray-300 rounded-xl py-3 mr-2`}
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={tw`text-center text-gray-700 font-semibold`}>Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`flex-1 bg-[#00A982] rounded-xl py-3 ml-2`}
            onPress={onOk}
            activeOpacity={0.7}
          >
            <Text style={tw`text-center text-white font-semibold`}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DriverNoteOverlay;
