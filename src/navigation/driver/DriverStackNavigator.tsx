import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DriverTabNavigator } from "./DriverTabNavigator";
import { DriverTabParamList } from "../type";

const Stack = createNativeStackNavigator<DriverTabParamList>();

export default function UserStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverTabs" component={DriverTabNavigator} />
    </Stack.Navigator>
  );
}
