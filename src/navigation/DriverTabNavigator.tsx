import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../module/home";
import { TripScreen } from "../module/trip";
import { OrderScreen } from "../module/order";
import { StatisticScreen } from "../module/statistic";
import { UserScreen } from "../module/user";
import CustomTabBar from "../components/CustomTabBar";

const Tab = createBottomTabNavigator();

/**
 * Bottom tab navigator for the driver app.
 *
 * Renders a Tab.Navigator configured with a custom tab bar and five tabs:
 * Home (initial), Trip, Order, Statistic, and User. The navigator hides the
 * header for all screens and applies a rounded top-corner style to the tab bar.
 *
 * @returns A React element containing the configured bottom tab navigator.
 */
export function DriverTabNavigator() {
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
      <Tab.Screen name="Statistic" component={StatisticScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
}
