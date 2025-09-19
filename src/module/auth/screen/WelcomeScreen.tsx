import {
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/type";

/**
 * Full-screen welcome screen with a background image, hero title, and actions to navigate to auth flows.
 *
 * Displays a two-line branded message and two touchable actions: "Đăng Nhập" navigates to the `Login` screen
 * and "Tạo tài khoản" navigates to the `Register` screen.
 */
export default function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <ImageBackground
      source={require("../../../assets/pictures/auth/background.png")}
      style={tw`flex-1 justify-center items-center`}
      resizeMode="cover"
    >
      <View
        style={[tw`flex-1 w-full justify-between items-center`, { zIndex: 3 }]}
      >
        <View style={tw`mt-60 items-center`}>
          <Text
            style={[
              tw`text-white text-center text-3xl font-medium mb-2 max-w-[180px] font-bold`,
            ]}
          >
            Trải nghiệm giao hàng tối ưu cùng
          </Text>
          <Text
            style={[
              tw`text-white text-center text-5xl mb-8`,
              { fontFamily: "RobotoSerifBoldItalic" },
            ]}
          >
            GHEPXE
          </Text>
        </View>
        <View style={tw`mb-45 w-full items-center`}>
          <TouchableOpacity
            style={tw`bg-white/40 rounded-2xl w-70 py-3 mb-3`}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={tw`text-center text-base text-white font-semibold`}>
              Đăng Nhập
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={tw`text-center text-white text-base`}>
              Tạo tài khoản
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}
