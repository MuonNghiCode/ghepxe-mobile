import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UserTabNavigator } from "./UserTabNavigator";
import { UserTabParamList } from "../type";
import {
  BillingAddressScreen,
  MapSelectScreen,
  ShippingAddressScreen,
} from "src/module/address";
import {
  ConfirmOrderScreen,
  OrderBillingAddressScreen,
  OrderShippingAddressScreen,
} from "src/module/orders";
import { MatchingRouteScreen } from "src/module/match";
import { UserOrderDetailScreen } from "src/module/order";
import { EditProfileScreen } from "src/module/profile";

const Stack = createNativeStackNavigator<UserTabParamList>();

export default function UserStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserTabs" component={UserTabNavigator} />
      <Stack.Screen name="Billing" component={BillingAddressScreen} />
      <Stack.Screen name="Shipping" component={ShippingAddressScreen} />
      <Stack.Screen name="MapSelect" component={MapSelectScreen} />
      <Stack.Screen name="ConfirmOrder" component={ConfirmOrderScreen} />
      <Stack.Screen name="OrderBilling" component={OrderBillingAddressScreen} />
      <Stack.Screen
        name="OrderShipping"
        component={OrderShippingAddressScreen}
      />
      <Stack.Screen name="Matching" component={MatchingRouteScreen} />
      <Stack.Screen name="UserOrderDetail" component={UserOrderDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
