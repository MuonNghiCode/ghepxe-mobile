import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DriverTabNavigator } from "./DriverTabNavigator";
import { DriverTabParamList } from "../type";
import { CreateDriverRouteScreen, MapSelectScreen } from "src/module/address";

const Stack = createNativeStackNavigator<DriverTabParamList>();

export default function UserStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverTabs" component={DriverTabNavigator} />
      <Stack.Screen
        name="CreateDriverRoute"
        component={CreateDriverRouteScreen}
      />
      <Stack.Screen name="MapSelect" component={MapSelectScreen} />
    </Stack.Navigator>
  );
}
