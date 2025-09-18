import { useAuth } from "../../../context/AuthContext";
import UserTripScreen from "./UserTripScreen";
import DriverTripScreen from "./DriverTripScreen";

export default function TripScreen() {
  const { role } = useAuth();
  if (role === "user") return <UserTripScreen />;
  if (role === "driver") return <DriverTripScreen />;
  return null;
}
