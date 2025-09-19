import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../module/home";
import { TripScreen } from "../module/trip";
import { OrderScreen } from "../module/order";
import { VoucherScreen } from "../module/voucher";
import { UserScreen } from "../module/user";
import CustomTabBar from "../components/CustomTabBar";

const Tab = createBottomTabNavigator();

/**
 * Bottom tab navigator component that wires the app's five main screens to a custom tab bar.
 *
 * Renders a configured Tab.Navigator with the routes: Home, Trip, Order, Voucher, and User.
 * The navigator hides the header for all tabs and applies a rounded-top tab bar style.
 * The tab bar is rendered by the CustomTabBar component.
 *
 * @returns A React element containing the configured bottom tab navigator.
 */
export function UserTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "hidden",
          elevation: 0,
          borderTopWidth: 0,
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trip" component={TripScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="Voucher" component={VoucherScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
}
