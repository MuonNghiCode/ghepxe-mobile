import CustomTabBar from "@components/CustomTabBar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "src/module/home";
import { OrderScreen } from "src/module/order";
import { StatisticScreen } from "src/module/statistic";
import { TripScreen } from "src/module/trip";
import { UserScreen } from "src/module/user";

const Tab = createBottomTabNavigator();

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
