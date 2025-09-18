import { useAuth } from "../../../context/AuthContext";
import DriverProfileScreen from "./DriverProfileScreen";
import UserProfileScreen from "./UserProfileScreen";

export default function UserScreen() {
  const { role } = useAuth();
  return role === "user" ? <UserProfileScreen /> : <DriverProfileScreen />;
}
