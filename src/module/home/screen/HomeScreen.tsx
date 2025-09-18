import { useAuth } from "../../../context/AuthContext";
import DriverHomeScreen from "./DriverHomeScreex";
import UserHomeScreen from "./UserHomeScreen";

export default function HomeScreen() {
  const { role } = useAuth();
  return role === "user" ? <UserHomeScreen /> : <DriverHomeScreen />;
}
