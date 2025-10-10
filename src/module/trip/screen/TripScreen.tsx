import { useAuth } from "../../../context/AuthContext";
import DriverTripScreen from "./driver/DriverTripScreen";
import UserTripScreen from "./user/UserTripScreen";

export default function TripScreen() {
  const { role } = useAuth();
  return role === "user" ? <UserTripScreen /> : <DriverTripScreen />;
}
