import React, { useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useAuth } from "src/context/AuthContext";
import { useToast } from "src/hooks/useToast";
import ConfirmDialog from "./ConfirmDialog";
import Toast from "./Toast";

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
  const [showDialog, setShowDialog] = useState(false);
  const { logout } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handleLogout = () => {
    if (showConfirm) {
      setShowDialog(true);
    } else {
      performLogout();
    }
  };

  const performLogout = async () => {
    setShowDialog(false);
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
    <>
      <TouchableOpacity
        style={[tw`flex-row items-center`, style]}
        onPress={handleLogout}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Ionicons
          name="log-out-outline"
          size={20}
          color={loading ? "#ccc" : iconColor}
        />
        <Text
          style={[
            tw`ml-2 text-red-500`,
            textStyle,
            loading && tw`text-gray-400`,
          ]}
        >
          {loading ? "Đang đăng xuất..." : "Đăng xuất"}
        </Text>
      </TouchableOpacity>

      <ConfirmDialog
        visible={showDialog}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?"
        type="warning"
        confirmText="Đăng xuất"
        cancelText="Hủy"
        onConfirm={performLogout}
        onCancel={() => setShowDialog(false)}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
        position="top"
        duration={2000}
      />
    </>
  );
}
