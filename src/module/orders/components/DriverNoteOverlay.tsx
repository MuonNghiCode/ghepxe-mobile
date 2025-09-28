import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

interface DriverNoteOverlayProps {
  visible: boolean;
  value: string;
  onChange: (text: string) => void;
  onCancel: () => void;
  onOk: () => void;
}

const SUGGESTED_NOTES = [
  "Gọi điện trước khi giao",
  "Giao tại sảnh tòa nhà",
  "Hàng dễ vỡ, xin nhẹ tay",
  "Liên hệ người nhận trước",
  "Giao vào giờ hành chính",
];

const DriverNoteOverlay: React.FC<DriverNoteOverlayProps> = ({
  visible,
  value,
  onChange,
  onCancel,
  onOk,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const maxLength = 200;

  useEffect(() => {
    setCharacterCount(value.length);
  }, [value]);

  if (!visible) return null;

  const handleSuggestionPress = (suggestion: string) => {
    if (value.trim()) {
      onChange(value + ", " + suggestion);
    } else {
      onChange(suggestion);
    }
  };

  const clearNote = () => {
    onChange("");
  };

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
                Ghi chú cho tài xế
              </Text>
              <Text style={tw`text-sm text-slate-600`}>
                Thêm thông tin quan trọng để giao hàng thuận tiện
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

        {/* Content */}
        <View style={tw`px-6 pb-6`}>
          {/* Text Input Container */}
          <View
            style={[
              tw`rounded-2xl border-2 p-4 mb-4`,
              {
                backgroundColor: isFocused ? "#F8FAFC" : "#F1F5F9",
                borderColor: isFocused ? "#3B82F6" : "#E2E8F0",
              },
            ]}
          >
            {/* Input header */}
            <View style={tw`flex-row items-center justify-between mb-2`}>
              <View style={tw`flex-row items-center`}>
                <Ionicons
                  name="chatbox-outline"
                  size={16}
                  color={isFocused ? "#3B82F6" : "#64748B"}
                />
                <Text
                  style={[
                    tw`ml-2 text-sm font-medium`,
                    {
                      color: isFocused ? "#3B82F6" : "#64748B",
                    },
                  ]}
                >
                  Nội dung ghi chú
                </Text>
              </View>
              {value.length > 0 && (
                <TouchableOpacity
                  onPress={clearNote}
                  style={tw`p-1`}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close-circle" size={18} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>

            {/* Text Input */}
            <TextInput
              style={[
                tw`text-base text-slate-800 min-h-24`,
                {
                  textAlignVertical: "top",
                },
              ]}
              placeholder="Ví dụ: Gọi điện trước khi giao, giao tại sảnh tòa nhà..."
              placeholderTextColor="#94A3B8"
              value={value}
              onChangeText={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              multiline
              maxLength={maxLength}
              numberOfLines={4}
            />

            {/* Character counter */}
            <View style={tw`flex-row justify-between items-center mt-2`}>
              <View style={tw`flex-row items-center`}>
                <View
                  style={[
                    tw`w-2 h-2 rounded-full mr-2`,
                    {
                      backgroundColor:
                        characterCount > maxLength * 0.8
                          ? "#F59E0B"
                          : characterCount > maxLength * 0.9
                          ? "#EF4444"
                          : "#10B981",
                    },
                  ]}
                />
                <Text style={tw`text-xs text-slate-500`}>
                  {characterCount > 0
                    ? `${characterCount} ký tự`
                    : "Chưa nhập ghi chú"}
                </Text>
              </View>
              <Text
                style={[
                  tw`text-xs`,
                  {
                    color:
                      characterCount > maxLength * 0.8 ? "#F59E0B" : "#94A3B8",
                  },
                ]}
              >
                {characterCount}/{maxLength}
              </Text>
            </View>
          </View>

          {/* Suggested Notes */}
          <View style={tw`mb-6`}>
            <View style={tw`flex-row items-center mb-3`}>
              <Ionicons name="bulb-outline" size={16} color="#64748B" />
              <Text style={tw`text-sm font-medium text-slate-600 ml-2`}>
                Gợi ý nhanh
              </Text>
            </View>
            <View style={tw`flex-row flex-wrap -mx-1`}>
              {SUGGESTED_NOTES.slice(0, 3).map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    tw`px-3 py-1.5 rounded-full mx-1 mb-2 border`,
                    {
                      backgroundColor: "#F8FAFC",
                      borderColor: "#E2E8F0",
                      flex: 1,
                      minWidth: 0,
                    },
                  ]}
                  onPress={() => handleSuggestionPress(suggestion)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={tw`text-xs text-slate-600 font-medium text-center`}
                    numberOfLines={1}
                  >
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={tw`flex-row flex-wrap -mx-1`}>
              {SUGGESTED_NOTES.slice(3).map((suggestion, index) => (
                <TouchableOpacity
                  key={index + 3}
                  style={[
                    tw`px-3 py-1.5 rounded-full mx-1 mb-2 border`,
                    {
                      backgroundColor: "#F8FAFC",
                      borderColor: "#E2E8F0",
                      flex: 1,
                      minWidth: 0,
                    },
                  ]}
                  onPress={() => handleSuggestionPress(suggestion)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={tw`text-xs text-slate-600 font-medium text-center`}
                    numberOfLines={1}
                  >
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={tw`flex-row gap-3`}>
            <TouchableOpacity
              style={[
                tw`flex-1 py-4 rounded-xl border-2 flex-row items-center justify-center`,
                {
                  borderColor: "#E2E8F0",
                  backgroundColor: "#F8FAFC",
                },
              ]}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Ionicons name="close-outline" size={18} color="#64748B" />
              <Text style={tw`ml-2 text-slate-600 font-semibold text-base`}>
                Hủy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                tw`flex-1 py-4 rounded-xl flex-row items-center justify-center`,
                {
                  backgroundColor: "#10B981",
                  shadowColor: "#10B981",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 4,
                },
              ]}
              onPress={onOk}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-outline" size={18} color="#FFFFFF" />
              <Text style={tw`ml-2 text-white font-semibold text-base`}>
                Xác nhận
              </Text>
            </TouchableOpacity>
          </View>

          {/* Helpful tip */}
          <View
            style={[
              tw`mt-4 p-3 rounded-xl flex-row`,
              {
                backgroundColor: "#EFF6FF",
                borderLeftWidth: 3,
                borderLeftColor: "#3B82F6",
              },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#3B82F6"
            />
            <Text style={tw`text-xs text-blue-700 ml-2 flex-1`}>
              Ghi chú chi tiết giúp tài xế giao hàng nhanh chóng và chính xác
              hơn
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DriverNoteOverlay;
