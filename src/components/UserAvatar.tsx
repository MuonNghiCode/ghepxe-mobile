import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useAuth } from "src/context/AuthContext";
import { useProfile } from "src/hooks/useProfile";

interface UserAvatarProps {
  size?: "small" | "medium" | "large";
  onPress?: () => void;
  showBorder?: boolean;
  style?: any;
}

export default function UserAvatar({
  size = "medium",
  onPress,
  showBorder = true,
  style,
}: UserAvatarProps) {
  const { user } = useAuth();
  const { profile } = useProfile();

  const sizeStyles = {
    small: tw`w-8 h-8`,
    medium: tw`w-12 h-12`,
    large: tw`w-16 h-16`,
  };

  const textSizes = {
    small: tw`text-sm`,
    medium: tw`text-lg`,
    large: tw`text-2xl`,
  };

  const getUserInitials = () => {
    const userInfo = profile || user;
    if (userInfo?.username) {
      return userInfo.username.charAt(0).toUpperCase();
    } else if (userInfo?.email) {
      return userInfo.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const avatarContent = (
    <View
      style={[
        sizeStyles[size],
        tw`rounded-full bg-[#00A982] items-center justify-center`,
        showBorder && tw`border-2 border-white`,
        style,
      ]}
    >
      <Text style={[tw`text-white font-bold`, textSizes[size]]}>
        {getUserInitials()}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {avatarContent}
      </TouchableOpacity>
    );
  }

  return avatarContent;
}

// Export cả hook để dễ sử dụng
export const useUserInfo = () => {
  const { user } = useAuth();
  const { profile } = useProfile();

  // Ưu tiên profile (có đầy đủ thông tin) trước user (chỉ có thông tin cơ bản)
  const userInfo = profile || user;

  return {
    userInfo,
    username: userInfo?.username,
    email: userInfo?.email,
    phone: userInfo?.phone || null, // Có thể null nếu chưa có profile
    address: userInfo?.address || null,
    status: userInfo?.status || null,
    displayName: userInfo?.username || userInfo?.email?.split("@")[0] || "User",
    initials:
      userInfo?.username?.charAt(0).toUpperCase() ||
      userInfo?.email?.charAt(0).toUpperCase() ||
      "U",
    hasFullProfile: !!profile, // Biết được có profile đầy đủ chưa
  };
};
