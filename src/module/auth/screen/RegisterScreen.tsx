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
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../hooks/useToast";
import Toast from "@components/Toast";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form fields - cập nhật theo API
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const { register } = useAuth();
  const { toast, showError, showSuccess, hideToast } = useToast();

  const validateForm = () => {
    if (!username.trim()) {
      showError("Vui lòng nhập tên đăng nhập!");
      return false;
    }
    if (!email.trim()) {
      showError("Vui lòng nhập email!");
      return false;
    }
    if (!email.includes("@")) {
      showError("Email không hợp lệ!");
      return false;
    }
    if (!password.trim()) {
      showError("Vui lòng nhập mật khẩu!");
      return false;
    }
    if (password.length < 6) {
      showError("Mật khẩu phải có ít nhất 6 ký tự!");
      return false;
    }
    if (password !== confirmPassword) {
      showError("Mật khẩu xác nhận không khớp!");
      return false;
    }
    if (!phone.trim()) {
      showError("Vui lòng nhập số điện thoại!");
      return false;
    }
    if (!address.trim()) {
      showError("Vui lòng nhập địa chỉ!");
      return false;
    }
    if (!checked) {
      showError("Vui lòng chấp nhận chính sách điều khoản!");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await register({
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim(),
        address: address.trim(),
      });

      if (result.success) {
        showSuccess("Đăng ký thành công! Vui lòng đăng nhập.");
        setTimeout(() => {
          navigation.navigate("Login" as never);
        }, 2000);
      } else {
        showError(result.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      showError("Có lỗi xảy ra. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // --- Render functions ---
  const renderBackButton = () => (
    <TouchableOpacity
      style={tw`absolute top-10 left-5 bg-white/80 rounded-full p-2 z-10`}
      onPress={() => navigation.goBack()}
      disabled={loading}
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
      <Text style={tw`text-center text-gray-500 mb-8`}>
        Đăng ký tài khoản của bạn
      </Text>
    </>
  );

  const renderInputFields = () => (
    <>
      <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-4`}>
        <Ionicons name="person" size={22} color="#888" />
        <TextInput
          style={tw`flex-1 py-3 pl-3 text-base`}
          placeholder="Tên đăng nhập"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading}
        />
      </View>
      <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-4`}>
        <MaterialIcons name="email" size={22} color="#888" />
        <TextInput
          style={tw`flex-1 py-3 pl-3 text-base`}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
      </View>
      <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-4`}>
        <Ionicons name="call" size={22} color="#888" />
        <TextInput
          style={tw`flex-1 py-3 pl-3 text-base`}
          placeholder="Số điện thoại"
          keyboardType="phone-pad"
          placeholderTextColor="#888"
          value={phone}
          onChangeText={setPhone}
          editable={!loading}
        />
      </View>
      <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-4`}>
        <Ionicons name="location" size={22} color="#888" />
        <TextInput
          style={tw`flex-1 py-3 pl-3 text-base`}
          placeholder="Địa chỉ"
          placeholderTextColor="#888"
          value={address}
          onChangeText={setAddress}
          editable={!loading}
        />
      </View>
      <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-4`}>
        <MaterialIcons name="lock" size={22} color="#888" />
        <TextInput
          style={tw`flex-1 py-3 pl-3 text-base`}
          placeholder="Mật khẩu"
          secureTextEntry={!showPass}
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
        <Pressable onPress={() => setShowPass((v) => !v)} disabled={loading}>
          <Ionicons
            name={showPass ? "eye" : "eye-off"}
            size={22}
            color="#888"
          />
        </Pressable>
      </View>
      <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-4`}>
        <MaterialIcons name="lock" size={22} color="#888" />
        <TextInput
          style={tw`flex-1 py-3 pl-3 text-base`}
          placeholder="Xác nhận mật khẩu"
          secureTextEntry={!showConfirmPass}
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
        />
        <Pressable
          onPress={() => setShowConfirmPass((v) => !v)}
          disabled={loading}
        >
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
      <TouchableOpacity
        onPress={() => setChecked((v) => !v)}
        disabled={loading}
      >
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
    <TouchableOpacity
      style={[
        tw`rounded-full py-3 mb-4`,
        { backgroundColor: loading ? "#ccc" : "#00A982" },
      ]}
      onPress={handleRegister}
      disabled={loading}
    >
      <Text style={tw`text-white text-center text-base font-bold`}>
        {loading ? "Đang đăng ký..." : "Đăng Ký"}
      </Text>
    </TouchableOpacity>
  );

  const renderSocialLogin = () => (
    <>
      <View style={tw`flex-row items-center justify-between my-6`}>
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
    <View style={tw`flex-row justify-center`}>
      <Text style={tw`text-gray-500 text-[16px]`}>Đã có tài khoản ? </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login" as never)}
        disabled={loading}
      >
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
