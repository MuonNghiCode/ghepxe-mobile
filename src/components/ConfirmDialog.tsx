import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  type?: "info" | "warning" | "error" | "success";
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const { width } = Dimensions.get("window");

export default function ConfirmDialog({
  visible,
  title,
  message,
  type = "info",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }).start();
    } else {
      scaleValue.setValue(0);
    }
  }, [visible]);

  const getIconConfig = () => {
    switch (type) {
      case "success":
        return { name: "checkmark-circle", color: "#10B981" };
      case "error":
        return { name: "close-circle", color: "#EF4444" };
      case "warning":
        return { name: "warning", color: "#F59E0B" };
      default:
        return { name: "information-circle", color: "#3B82F6" };
    }
  };

  const iconConfig = getIconConfig();

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={tw`flex-1 bg-black/50 items-center justify-center px-6`}>
        <Animated.View
          style={[
            tw`bg-white rounded-2xl p-6 w-full`,
            {
              maxWidth: width - 48,
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          {/* Icon */}
          <View style={tw`items-center mb-4`}>
            <View
              style={[
                tw`w-16 h-16 rounded-full items-center justify-center`,
                { backgroundColor: `${iconConfig.color}20` },
              ]}
            >
              <Ionicons
                name={iconConfig.name as any}
                size={40}
                color={iconConfig.color}
              />
            </View>
          </View>

          {/* Title */}
          <Text style={tw`text-xl font-bold text-center text-black mb-2`}>
            {title}
          </Text>

          {/* Message */}
          <Text style={tw`text-sm text-center text-gray-600 mb-6`}>
            {message}
          </Text>

          {/* Buttons */}
          <View style={tw`flex-row gap-3`}>
            <TouchableOpacity
              style={tw`flex-1 bg-gray-200 py-3 rounded-xl`}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={tw`text-center font-semibold text-gray-700`}>
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                tw`flex-1 py-3 rounded-xl`,
                { backgroundColor: iconConfig.color },
              ]}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={tw`text-center font-semibold text-white`}>
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
