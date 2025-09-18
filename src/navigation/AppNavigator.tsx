import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { RootStackParamList } from "./type";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
