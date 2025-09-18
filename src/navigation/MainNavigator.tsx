import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainTabParamList } from "./type";
import { HomeScreen } from "../module/home";

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
    </Tab.Navigator>
  );
}
