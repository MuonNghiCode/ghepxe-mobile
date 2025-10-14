import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DriverTabNavigator } from "./DriverTabNavigator";
import { DriverTabParamList } from "../type";
import { CreateDriverRouteScreen, MapSelectScreen } from "src/module/address";
import {
  ConfirmRouteScreen,
  RouteBillingAddressScreen,
  RouteShippingAddressScreen,
} from "src/module/router";
import { DriverOrderDetailScreen } from "src/module/order";
import { EditProfileScreen } from "src/module/profile";

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
      <Stack.Screen name="ConfirmRoute" component={ConfirmRouteScreen} />
      <Stack.Screen name="RouteBilling" component={RouteBillingAddressScreen} />
      <Stack.Screen
        name="RouteShipping"
        component={RouteShippingAddressScreen}
      />
      <Stack.Screen
        name="DriverOrderDetail"
        component={DriverOrderDetailScreen}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}
