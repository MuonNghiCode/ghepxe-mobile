import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { RootStackParamList } from "./type";
import { useAuth } from "../context/AuthContext";

const RootStack = createNativeStackNavigator<RootStackParamList>();

/**
 * Root navigation container that selects between the authentication and main app flows.
 *
 * Uses the authentication state from `useAuth()` to register either the `Auth` stack (when
 * not logged in) or the `Main` stack (when logged in). The navigator hides native headers
 * for all screens via `screenOptions: { headerShown: false }`.
 *
 * @returns The app's top-level React navigation element (`NavigationContainer`) containing the root stack.
 */
export default function AppNavigator() {
  const { isLoggedIn } = useAuth();

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
