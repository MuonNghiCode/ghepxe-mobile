import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../module/home";
import { TripScreen } from "../module/trip";
import { OrderScreen } from "../module/order";
import { StatisticScreen } from "../module/statistic";
import { UserScreen } from "../module/user";

const Tab = createBottomTabNavigator();

export function DriverTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trip" component={TripScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="Statistic" component={StatisticScreen} />
      <Tab.Screen name="User" component={UserScreen} />
    </Tab.Navigator>
  );
}
