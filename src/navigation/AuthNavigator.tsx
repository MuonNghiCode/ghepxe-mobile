import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./type";
import {
  ForgetPasswordScreen,
  LoginScreen,
  RegisterScreen,
} from "../module/auth";

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
    </Stack.Navigator>
  );
}
