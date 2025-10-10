import React, { useEffect, useRef } from "react";
import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  visible: boolean;
  onHide: () => void;
  duration?: number;
  position?: "top" | "bottom";
}

const { width } = Dimensions.get("window");

export default function Toast({
  message,
  type = "info",
  visible,
  onHide,
  duration = 3000,
  position = "top",
}: ToastProps) {
  const translateY = useRef(
    new Animated.Value(position === "top" ? -100 : 100)
  ).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#10B981",
          icon: "checkmark-circle",
          textColor: "#fff",
        };
      case "error":
        return {
          backgroundColor: "#EF4444",
          icon: "close-circle",
          textColor: "#fff",
        };
      case "warning":
        return {
          backgroundColor: "#F59E0B",
          icon: "warning",
          textColor: "#fff",
        };
      default:
        return {
          backgroundColor: "#3B82F6",
          icon: "information-circle",
          textColor: "#fff",
        };
    }
  };

  const config = getToastConfig();

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === "top" ? -100 : 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        tw`absolute left-4 right-4 z-50`,
        {
          [position]: 60,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View
        style={[
          tw`rounded-xl px-4 py-3 flex-row items-center shadow-lg`,
          {
            backgroundColor: config.backgroundColor,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
        ]}
      >
        <Ionicons
          name={config.icon as any}
          size={20}
          color={config.textColor}
          style={tw`mr-3`}
        />
        <Text
          style={[tw`flex-1 text-sm font-medium`, { color: config.textColor }]}
          numberOfLines={2}
        >
          {message}
        </Text>
        <TouchableOpacity onPress={hideToast} style={tw`ml-2`}>
          <Ionicons name="close" size={18} color={config.textColor} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
