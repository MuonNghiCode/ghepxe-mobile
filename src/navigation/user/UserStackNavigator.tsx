import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserTabNavigator } from "./UserTabNavigator";
import { UserTabParamList } from "../type";
import {
  BillingAddress,
  MapSelectScreen,
  ShippingAddress,
} from "src/module/address";

const Stack = createNativeStackNavigator<UserTabParamList>();

export default function UserStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserTabs" component={UserTabNavigator} />
      <Stack.Screen name="Billing" component={BillingAddress} />
      <Stack.Screen name="Shipping" component={ShippingAddress} />
      <Stack.Screen name="MapSelect" component={MapSelectScreen} />
    </Stack.Navigator>
  );
}
