import { useAuth } from "../../../context/AuthContext";
import DriverProfileScreen from "./DriverProfileScreen";
import UserProfileScreen from "./UserProfileScreen";

export default function UserScreen() {
  const { role } = useAuth();

  if (role === "user") return <UserProfileScreen />;
  if (role === "driver") return <DriverProfileScreen />;
  return null;
}
