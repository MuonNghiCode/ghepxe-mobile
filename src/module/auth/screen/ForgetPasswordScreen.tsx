import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View, TextInput } from "react-native";
import tw from "twrnc";
import { useState } from "react";

export default function ForgetPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  // --- Render functions ---
  const renderBackButton = () => (
    <TouchableOpacity
      style={tw`absolute top-10 left-5 bg-white/80 rounded-full p-2 z-10`}
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="arrow-back" size={22} color="#00A982" />
    </TouchableOpacity>
  );

  const renderTitle = () => (
    <>
      <Text
        style={[
          tw`text-4xl text-center mb-2 text-[#00A982]`,
          { fontFamily: "RobotoSerifBold", lineHeight: 70 },
        ]}
      >
        Quên Mật Khẩu
      </Text>
      <Text style={tw`text-center text-gray-500 mb-8`}>
        Nhập email để lấy lại mật khẩu
      </Text>
    </>
  );

  const renderInputField = () => (
    <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-6`}>
      <MaterialIcons name="email" size={22} color="#888" />
      <TextInput
        style={tw`flex-1 py-3 pl-3 text-base`}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
      />
    </View>
  );

  const renderSubmitButton = () => (
    <TouchableOpacity style={tw`bg-[#00A982] rounded-full py-3 mb-4`}>
      <Text style={tw`text-white text-center text-base font-bold`}>
        Gửi Yêu Cầu
      </Text>
    </TouchableOpacity>
  );

  // --- Main render ---
  return (
    <View style={tw`flex-1 bg-white`}>
      {renderBackButton()}
      <View style={tw`px-6 pt-24`}>
        {renderTitle()}
        {renderInputField()}
        {renderSubmitButton()}
      </View>
    </View>
  );
}
