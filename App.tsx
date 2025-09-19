import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

/**
 * Root application component that loads custom fonts, hides the splash screen when ready, and renders the app's navigation tree.
 *
 * Uses `useFonts` to load five Roboto font variants. While fonts are loading the component returns `null`. When font loading completes it calls `SplashScreen.hideAsync()` and renders the UI inside `GestureHandlerRootView`, wrapped with `AuthProvider` and `AppNavigator`.
 *
 * @returns The root JSX element for the app, or `null` while fonts are loading.
 */
export default function App() {
  const [fontsLoaded] = useFonts({
    RobotoRegular: require("./src/assets/fonts/Roboto-Regular.ttf"),
    RobotoBold: require("./src/assets/fonts/Roboto-Bold.ttf"),
    RobotoSerifRegular: require("./src/assets/fonts/RobotoSerif-Regular.ttf"),
    RobotoSerifBold: require("./src/assets/fonts/RobotoSerif-Bold.ttf"),
    RobotoSerifBoldItalic: require("./src/assets/fonts/RobotoSerif-BoldItalic.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
