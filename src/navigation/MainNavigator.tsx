import { useAuth } from "../context/AuthContext";
import { UserTabNavigator } from "./UserTabNavigator";
import { DriverTabNavigator } from "./DriverTabNavigator";

export default function MainNavigator() {
  const { role } = useAuth();

  return role === "user" ? <UserTabNavigator /> : <DriverTabNavigator />;
}
