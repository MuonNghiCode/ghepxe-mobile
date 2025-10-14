import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../hooks/useToast";
import { useForm } from "../../../hooks/useForm";
import { useFormValidation } from "../../../hooks/useFormValidation";
import { registerSchema, RegisterFormData } from "../../../schemas/authSchemas";
import Toast from "@components/Toast";

const initialFormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptPolicy: false,
};

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { values, setValue } = useForm(initialFormValues);
  const { fieldErrors, validate, clearFieldError, hasError, getError } =
    useFormValidation(registerSchema);
  const { register } = useAuth();
  const { toast, showError, showSuccess, hideToast } = useToast();

  const handleFieldChange = (field: keyof typeof values, value: any) => {
    setValue(field, value);
    if (hasError(field)) {
      clearFieldError(field);
    }
  };

  const handleRegister = async () => {
    const validationResult = validate(values);

    if (!validationResult.isValid) {
      if (validationResult.firstError) {
        showError(validationResult.firstError);
      }
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        username: values.username.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
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

  const renderInputField = (
    field: keyof typeof values,
    placeholder: string,
    icon: React.ReactNode,
    options?: {
      keyboardType?: any;
      autoCapitalize?: any;
      secureTextEntry?: boolean;
      showPasswordToggle?: boolean;
      onTogglePassword?: () => void;
    }
  ) => (
    <View style={tw`mb-4`}>
      <View
        style={[
          tw`flex-row items-center bg-gray-100 rounded-xl px-4`,
          hasError(field) && tw`border border-red-500`,
        ]}
      >
        {icon}
        <TextInput
          style={tw`flex-1 py-3 pl-3 text-base`}
          placeholder={placeholder}
          placeholderTextColor="#888"
          value={values[field] as string}
          onChangeText={(value) => handleFieldChange(field, value)}
          editable={!loading}
          keyboardType={options?.keyboardType}
          autoCapitalize={options?.autoCapitalize || "none"}
          secureTextEntry={options?.secureTextEntry}
        />
        {options?.showPasswordToggle && (
          <Pressable onPress={options.onTogglePassword} disabled={loading}>
            <Ionicons
              name={options.secureTextEntry ? "eye-off" : "eye"}
              size={22}
              color="#888"
            />
          </Pressable>
        )}
      </View>
      {hasError(field) && (
        <Text style={tw`text-red-500 text-sm mt-1 ml-2`}>
          {getError(field)}
        </Text>
      )}
    </View>
  );

  const renderInputFields = () => (
    <>
      {renderInputField(
        "username",
        "Tên đăng nhập",
        <Ionicons name="person" size={22} color="#888" />
      )}

      {renderInputField(
        "email",
        "Email",
        <MaterialIcons name="email" size={22} color="#888" />,
        { keyboardType: "email-address" }
      )}

      {renderInputField(
        "password",
        "Mật khẩu",
        <MaterialIcons name="lock" size={22} color="#888" />,
        {
          secureTextEntry: !showPass,
          showPasswordToggle: true,
          onTogglePassword: () => setShowPass((v) => !v),
        }
      )}

      {renderInputField(
        "confirmPassword",
        "Xác nhận mật khẩu",
        <MaterialIcons name="lock" size={22} color="#888" />,
        {
          secureTextEntry: !showConfirmPass,
          showPasswordToggle: true,
          onTogglePassword: () => setShowConfirmPass((v) => !v),
        }
      )}
    </>
  );

  const renderPolicyCheckbox = () => (
    <View style={tw`mb-4`}>
      <View style={tw`flex-row items-center`}>
        <TouchableOpacity
          onPress={() =>
            handleFieldChange("acceptPolicy", !values.acceptPolicy)
          }
          disabled={loading}
        >
          <Ionicons
            name={values.acceptPolicy ? "checkmark-circle" : "ellipse-outline"}
            size={20}
            color={
              values.acceptPolicy
                ? "#00A982"
                : hasError("acceptPolicy")
                ? "#FF0000"
                : "#888"
            }
          />
        </TouchableOpacity>
        <Text style={tw`ml-2 text-gray-700`}>
          Chấp nhận với{" "}
          <Text style={tw`text-[#00A982] underline`}>
            Chính Sách Điều Khoản
          </Text>
        </Text>
      </View>
      {hasError("acceptPolicy") && (
        <Text style={tw`text-red-500 text-sm mt-1 ml-2`}>
          {getError("acceptPolicy")}
        </Text>
      )}
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
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-6 pt-24 pb-8`}
        showsVerticalScrollIndicator={false}
      >
        {renderTitle()}
        {renderInputFields()}
        {renderPolicyCheckbox()}
        {renderRegisterButton()}
        {renderSocialLogin()}
        {renderFooter()}
      </ScrollView>
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
