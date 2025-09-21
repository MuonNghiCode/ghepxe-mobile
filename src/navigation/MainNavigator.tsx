import { useAuth } from "@context/AuthContext";
import { UserTabNavigator } from "./UserTabNavigator";
import { DriverTabNavigator } from "./DriverTabNavigator";
import UserStackNavigator from "./UserStackNavigator";

export default function MainNavigator() {
  const { role } = useAuth();

  return role === "user" ? <UserStackNavigator /> : <DriverTabNavigator />;
}
