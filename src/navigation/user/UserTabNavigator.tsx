import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTabBar from "@components/CustomTabBar";
import { HomeScreen } from "src/module/home";
import { TripScreen } from "src/module/trip";
import { OrderScreen } from "src/module/order";
import { VoucherScreen } from "src/module/voucher";
import { UserScreen } from "src/module/user";

const Tab = createBottomTabNavigator();

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
