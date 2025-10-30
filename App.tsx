import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { OrderProvider } from "src/context/OrderContext";
import { RouteProvider } from "@context/RouteContext";

export default function App() {
  const [fontsLoaded] = useFonts({
    RobotoRegular: require("./src/assets/fonts/Roboto-Regular.ttf"),
    RobotoBold: require("./src/assets/fonts/Roboto-Bold.ttf"),
    RobotoSerifRegular: require("./src/assets/fonts/RobotoSerif-Regular.ttf"),
    RobotoSerifBold: require("./src/assets/fonts/RobotoSerif-Bold.ttf"),
    RobotoSerifBoldItalic: require("./src/assets/fonts/RobotoSerif-BoldItalic.ttf"),
    RobotoSerifSemiBold: require("./src/assets/fonts/RobotoSerif-SemiBold.ttf"),
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
        <OrderProvider>
          <RouteProvider>
            <AppNavigator />
          </RouteProvider>
        </OrderProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
