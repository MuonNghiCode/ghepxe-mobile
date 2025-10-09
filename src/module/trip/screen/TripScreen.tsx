import { useAuth } from "../../../context/AuthContext";
import UserTripScreen from "./UserTripScreen";
import DriverTripScreen from "./driver/DriverTripScreen";

export default function TripScreen() {
  const { role } = useAuth();
  return role === "user" ? <UserTripScreen /> : <DriverTripScreen />;
}
