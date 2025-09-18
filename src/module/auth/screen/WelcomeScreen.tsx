import { Text, View, Button } from "react-native";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/type";

export default function WelcomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <Text>WelcomeScreen</Text>
      <View style={tw`mt-4 w-40`}>
        <Button
          title="Đăng nhập"
          onPress={() => navigation.navigate("Login")}
        />
      </View>
      <View style={tw`mt-2 w-40`}>
        <Button
          title="Đăng ký"
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
}
