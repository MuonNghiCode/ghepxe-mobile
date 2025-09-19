import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import tw from "twrnc";
import { useAuth } from "../../../context/AuthContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const { login } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={tw`flex-1 bg-[#fcfcfc]`}>
      {/* Header image + Back button */}
      <View style={tw`overflow-hidden relative`}>
        <Image
          source={require("../../../assets/pictures/auth/Vector.png")}
          style={tw`w-full h-70`}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={tw`absolute top-10 left-5 bg-white/80 rounded-full p-2`}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#00A982" />
        </TouchableOpacity>
      </View>
      {/* Form content */}
      <View style={tw`px-6 -mt-10`}>
        {/* Title */}
        <Text
          style={[
            tw`text-5xl text-center mb-3 text-[#00A982]`,
            { fontFamily: "RobotoSerifBold", lineHeight: 70 },
          ]}
        >
          Đăng Nhập
        </Text>
        <Text style={tw`text-center text-gray-500 mb-10`}>
          Đăng nhập vào tài khoản của bạn
        </Text>

        {/* Username */}
        <View
          style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-5`}
        >
          <Ionicons name="person" size={22} color="#888" />
          <TextInput
            style={tw`flex-1 py-3 pl-3 text-base`}
            placeholder="Họ và Tên"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            placeholderTextColor="#888"
          />
        </View>

        {/* Password */}
        <View
          style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-5`}
        >
          <MaterialIcons name="lock" size={22} color="#888" />
          <TextInput
            style={tw`flex-1 py-3 pl-3 text-base`}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
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

        {/* Options */}
        <View style={tw`flex-row items-center justify-between mb-5`}>
          <TouchableOpacity
            style={tw`flex-row items-center`}
            onPress={() => setRemember((v) => !v)}
          >
            <Ionicons
              name={remember ? "checkmark-circle" : "ellipse-outline"}
              size={20}
              color={remember ? "#00A982" : "#888"}
            />
            <Text style={tw`ml-2 text-gray-700`}>Nhớ tài khoản</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={tw`text-[#00A982]`}>Quên tài khoản ?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[tw`rounded-full py-3 mb-6`, { backgroundColor: "#00A982" }]}
          onPress={() => login("user")}
        >
          <Text style={tw`text-white text-center text-base font-bold`}>
            Đăng Nhập
          </Text>
        </TouchableOpacity>

        <View style={tw`flex-row items-center justify-between my-5`}>
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

        {/* Register link */}
        <View style={tw`flex-row justify-center`}>
          <Text style={tw`text-gray-500`}>Chưa có tài khoản? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register" as never)}
          >
            <Text
              style={[
                tw`text-[#00A982] font-bold`,
                {
                  textDecorationLine: "underline",
                  fontSize: 16,
                  lineHeight: 20,
                },
              ]}
            >
              Đăng Kí
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
