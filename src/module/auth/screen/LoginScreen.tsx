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
import { useToast } from "../../../hooks/useToast";
import Toast from "@components/Toast";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigation = useNavigation();
  const { toast, showError, showSuccess, hideToast } = useToast();

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      showError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);

    try {
      const result = await login({ email: username, password });

      if (result.success) {
        showSuccess("Đăng nhập thành công!");
        // Navigation sẽ được xử lý tự động khi AuthContext cập nhật isLoggedIn
      } else {
        showError(result.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      showError("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }

  // --- Render functions ---
  const renderHeader = () => (
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
  );

  const renderTitle = () => (
    <>
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
    </>
  );

  const renderInputFields = () => (
    <>
      <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-5`}>
        <Ionicons name="person" size={22} color="#888" />
        <TextInput
          style={tw`flex-1 py-3 pl-3 text-base`}
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#888"
          editable={!loading}
        />
      </View>
      <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-5`}>
        <MaterialIcons name="lock" size={22} color="#888" />
        <TextInput
          style={tw`flex-1 py-3 pl-3 text-base`}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPass}
          placeholderTextColor="#888"
          editable={!loading}
        />
        <Pressable onPress={() => setShowPass((v) => !v)}>
          <Ionicons
            name={showPass ? "eye" : "eye-off"}
            size={22}
            color="#888"
          />
        </Pressable>
      </View>
    </>
  );

  const renderOptions = () => (
    <View style={tw`flex-row items-center justify-between mb-5`}>
      <TouchableOpacity
        style={tw`flex-row items-center`}
        onPress={() => setRemember((v) => !v)}
        disabled={loading}
      >
        <Ionicons
          name={remember ? "checkmark-circle" : "ellipse-outline"}
          size={20}
          color={remember ? "#00A982" : "#888"}
        />
        <Text style={tw`ml-2 text-gray-700`}>Nhớ tài khoản</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgetPassword" as never)}
        disabled={loading}
      >
        <Text style={tw`text-[#00A982]`}>Quên tài khoản ?</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoginButton = () => (
    <TouchableOpacity
      style={[
        tw`rounded-full py-3 mb-6`,
        { backgroundColor: loading ? "#ccc" : "#00A982" },
      ]}
      onPress={handleLogin}
      disabled={loading}
    >
      <Text style={tw`text-white text-center text-base font-bold`}>
        {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
      </Text>
    </TouchableOpacity>
  );

  const renderSocialLogin = () => (
    <>
      <View style={tw`flex-row items-center justify-between my-5`}>
        <View style={tw`w-20 h-0.5 bg-[#6B6B6B]`} />
        <Text style={tw`mx-2 text-[#6B6B6B]`}>Hoặc tiếp tục với</Text>
        <View style={tw`w-20 h-0.5 bg-[#6B6B6B]`} />
      </View>
      <View style={tw`flex-row justify-center mb-6 gap-10`}>
        <TouchableOpacity style={tw`mx-4`} disabled={loading}>
          <Image
            source={require("../../../assets/icons/zalo.png")}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={tw`mx-4`} disabled={loading}>
          <Image
            source={require("../../../assets/icons/google.png")}
            style={{ width: 36, height: 36 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity style={tw`mx-4`} disabled={loading}>
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
    <View style={tw`flex-row justify-center gap-1`}>
      <Text style={[tw`text-[#6B6B6B]`, { fontSize: 16 }]}>
        Chưa có tài khoản?
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Register" as never)}
        disabled={loading}
      >
        <Text
          style={[
            tw`text-[#00A982] font-bold`,
            {
              textDecorationLine: "underline",
              fontSize: 16,
            },
          ]}
        >
          Đăng Kí
        </Text>
      </TouchableOpacity>
    </View>
  );

  // --- Main render ---
  return (
    <View style={tw`flex-1 bg-[#fcfcfc]`}>
      {renderHeader()}
      <View style={tw`px-6 -mt-10`}>
        {renderTitle()}
        {renderInputFields()}
        {renderOptions()}
        {renderLoginButton()}
        {renderSocialLogin()}
        {renderFooter()}
      </View>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
        position="top"
      />
    </View>
  );
}
