import React, { useState } from "react";
import { TouchableOpacity, Text, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useAuth } from "src/context/AuthContext";
import { useToast } from "src/hooks/useToast";

interface LogoutButtonProps {
  style?: any;
  textStyle?: any;
  iconColor?: string;
  showConfirm?: boolean;
}

export default function LogoutButton({
  style,
  textStyle,
  iconColor = "#FF4444",
  showConfirm = true,
}: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleLogout = async () => {
    if (showConfirm) {
      Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng xuất", style: "destructive", onPress: performLogout },
      ]);
    } else {
      await performLogout();
    }
  };

  const performLogout = async () => {
    setLoading(true);
    try {
      const result = await logout();
      if (result.success) {
        showSuccess(result.message || "Đăng xuất thành công");
      } else {
        showError(result.message || "Đăng xuất thất bại");
      }
    } catch (error) {
      showError("Có lỗi xảy ra khi đăng xuất");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[tw`flex-row items-center`, style]}
      onPress={handleLogout}
      disabled={loading}
    >
      <Ionicons
        name="log-out-outline"
        size={20}
        color={loading ? "#ccc" : iconColor}
      />
      <Text
        style={[tw`ml-2 text-red-500`, textStyle, loading && tw`text-gray-400`]}
      >
        {loading ? "Đang đăng xuất..." : "Đăng xuất"}
      </Text>
    </TouchableOpacity>
  );
}
