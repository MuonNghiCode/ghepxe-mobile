import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import tw from "twrnc";
import { useState } from "react";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [checked, setChecked] = useState(false);

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
          tw`text-5xl text-center mb-2 text-[#00A982]`,
          { fontFamily: "RobotoSerifBold", lineHeight: 70 },
        ]}
      >
        Đăng Ký
      </Text>
      <Text style={tw`text-center text-gray-500 mb-10`}>
        Đăng ký tài khoản của bạn
      </Text>
    </>
  );

  const renderInputFields = () => (
    <>
      <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-5`}>
        <Ionicons name="person" size={22} color="#888" />
        <TextInput
          style={tw`flex-1 py-3 pl-3 text-base`}
          placeholder="Họ và Tên"
          placeholderTextColor="#888"
        />
      </View>
      <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-5`}>
        <MaterialIcons name="email" size={22} color="#888" />
        <TextInput
          style={tw`flex-1 py-3 pl-3 text-base`}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
      </View>
      <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-5`}>
        <MaterialIcons name="lock" size={22} color="#888" />
        <TextInput
          style={tw`flex-1 py-3 pl-3 text-base`}
          placeholder="Mật khẩu"
          secureTextEntry={!showPass}
          placeholderTextColor="#888"
        />
        <Pressable onPress={() => setShowPass((v) => !v)}>
          <Ionicons
            name={showPass ? "eye" : "eye-off"}
            size={22}
            color="#888"
          />
        </Pressable>
      </View>
      <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-5`}>
        <MaterialIcons name="lock" size={22} color="#888" />
        <TextInput
          style={tw`flex-1 py-3 pl-3 text-base`}
          placeholder="Xác nhận mật khẩu"
          secureTextEntry={!showConfirmPass}
          placeholderTextColor="#888"
        />
        <Pressable onPress={() => setShowConfirmPass((v) => !v)}>
          <Ionicons
            name={showConfirmPass ? "eye" : "eye-off"}
            size={22}
            color="#888"
          />
        </Pressable>
      </View>
    </>
  );

  const renderPolicyCheckbox = () => (
    <View style={tw`flex-row items-center mb-4`}>
      <TouchableOpacity onPress={() => setChecked((v) => !v)}>
        <Ionicons
          name={checked ? "checkmark-circle" : "ellipse-outline"}
          size={20}
          color={checked ? "#00A982" : "#888"}
        />
      </TouchableOpacity>
      <Text style={tw`ml-2 text-gray-700`}>
        Chấp nhận với{" "}
        <Text style={tw`text-[#00A982] underline`}>Chính Sách Điều Khoản</Text>
      </Text>
    </View>
  );

  const renderRegisterButton = () => (
    <TouchableOpacity style={tw`bg-[#00A982] rounded-full py-3 mb-4`}>
      <Text style={tw`text-white text-center text-base font-bold`}>
        Đăng Ký
      </Text>
    </TouchableOpacity>
  );

  const renderSocialLogin = () => (
    <>
      <View style={tw`flex-row items-center justify-between my-8`}>
        <View style={tw`w-20 h-0.5 bg-[#6B6B6B]`} />
        <Text style={tw`mx-2 text-[#6B6B6B]`}>Hoặc tiếp tục với</Text>
        <View style={tw`w-20 h-0.5 bg-[#6B6B6B]`} />
      </View>
      <View style={tw`flex-row justify-center mb-6 gap-10`}>
        <TouchableOpacity style={tw`mx-4`}>
          <Image
            source={require("../../../assets/icons/zalo.png")}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={tw`mx-4`}>
          <Image
            source={require("../../../assets/icons/google.png")}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={tw`mx-4`}>
          <Image
            source={require("../../../assets/icons/facebook.png")}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderFooter = () => (
    <View style={tw`flex-row justify-center`}>
      <Text style={tw`text-gray-500 text-[16px]`}>Đã có tài khoản ? </Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}>
        <Text style={tw`text-[#00A982] text-[16px] font-bold underline`}>
          Đăng Nhập
        </Text>
      </TouchableOpacity>
    </View>
  );

  // --- Main render ---
  return (
    <View style={tw`flex-1 bg-white`}>
      {renderBackButton()}
      <View style={tw`px-6 pt-24`}>
        {renderTitle()}
        {renderInputFields()}
        {renderPolicyCheckbox()}
        {renderRegisterButton()}
        {renderSocialLogin()}
        {renderFooter()}
      </View>
    </View>
  );
}
