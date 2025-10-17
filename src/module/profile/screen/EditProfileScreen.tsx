import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { useProfile } from "src/hooks/useProfile";
import { useToast } from "src/hooks/useToast";
import Toast from "@components/Toast";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function EditProfileScreen() {
  const { profile, fetchProfile } = useProfile();
  const { toast, showSuccess, hideToast } = useToast();
  const navigation = useNavigation();

  const [editedProfile, setEditedProfile] = useState({
    username: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    } else {
      setEditedProfile({
        username: profile.username || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const handleSave = useCallback(() => {
    // TODO: Implement save profile API call
    showSuccess("Cập nhật thông tin thành công!");
    navigation.goBack();
  }, [navigation, showSuccess]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderHeader = () => (
    <View
      style={tw`flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100`}
    >
      <TouchableOpacity
        onPress={handleGoBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={tw`w-10 h-10 items-center justify-center`}
      >
        <Ionicons name="chevron-back" size={24} color="#00A982" />
      </TouchableOpacity>
      <Text style={tw`text-lg font-semibold text-black flex-1 text-center`}>
        Chỉnh sửa hồ sơ
      </Text>
      <TouchableOpacity
        onPress={handleSave}
        style={tw`px-3 py-1.5 bg-[#00A982] rounded-lg`}
      >
        <Text style={tw`text-white font-medium text-sm`}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAvatar = () => (
    <View style={tw`items-center py-8 bg-white`}>
      <View style={tw`relative`}>
        <View
          style={tw`w-20 h-20 bg-[#00A982] rounded-full items-center justify-center shadow-sm`}
        >
          <Text style={tw`text-white text-2xl font-bold`}>
            {profile?.username?.charAt(0)?.toUpperCase() || "U"}
          </Text>
        </View>
        <TouchableOpacity
          style={tw`absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 border border-gray-200 shadow-sm`}
        >
          <Ionicons name="camera" size={14} color="#00A982" />
        </TouchableOpacity>
      </View>
      <Text style={tw`text-lg font-bold text-gray-900 mt-3`}>
        {profile?.username || "Người dùng"}
      </Text>
    </View>
  );

  const renderFormField = (
    icon: string,
    label: string,
    value: string,
    field: keyof typeof editedProfile,
    placeholder: string = "",
    multiline: boolean = false,
    keyboardType: any = "default"
  ) => (
    <View style={tw`mb-5`}>
      <View style={tw`flex-row items-center mb-3`}>
        <View
          style={tw`w-8 h-8 bg-[#00A982]/10 rounded-full items-center justify-center mr-3`}
        >
          <Ionicons name={icon as any} size={16} color="#00A982" />
        </View>
        <Text style={tw`text-gray-900 font-semibold text-base`}>{label}</Text>
      </View>
      <TextInput
        style={tw`bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 text-base ${
          multiline ? "min-h-24" : ""
        } shadow-sm`}
        value={editedProfile[field]}
        onChangeText={(text) =>
          setEditedProfile({ ...editedProfile, [field]: text })
        }
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {renderHeader()}

        <ScrollView
          style={tw`flex-1`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderAvatar()}

          {/* Phần form với background riêng */}
          <View style={tw`bg-white flex-1 pt-6`}>
            <View style={tw`px-6`}>
              <Text style={tw`text-2xl font-bold text-gray-900 mb-6`}>
                Thông tin cá nhân
              </Text>

              {renderFormField(
                "person-outline",
                "Tên hiển thị",
                editedProfile.username,
                "username",
                "Nhập tên hiển thị của bạn"
              )}

              {renderFormField(
                "call-outline",
                "Số điện thoại",
                editedProfile.phone,
                "phone",
                "Nhập số điện thoại",
                false,
                "phone-pad"
              )}

              {renderFormField(
                "location-outline",
                "Địa chỉ",
                editedProfile.address,
                "address",
                "Nhập địa chỉ của bạn",
                true
              )}

              <TouchableOpacity
                style={tw`bg-[#00A982] rounded-xl py-4 flex-row items-center justify-center mt-4 mb-8 shadow-lg`}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="white"
                />
                <Text style={tw`text-white font-semibold text-base ml-2`}>
                  Cập nhật thông tin
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
        position="top"
      />
    </SafeAreaView>
  );
}
