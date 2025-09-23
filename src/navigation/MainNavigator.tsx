import { useAuth } from "@context/AuthContext";
import UserStackNavigator from "./user/UserStackNavigator";
import DriverStackNavigator from "./driver/DriverStackNavigator";

export default function MainNavigator() {
  const { role } = useAuth();

  return role === "user" ? <UserStackNavigator /> : <DriverStackNavigator />;
}
