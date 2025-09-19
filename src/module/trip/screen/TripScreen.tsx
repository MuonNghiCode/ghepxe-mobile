import { useAuth } from "../../../context/AuthContext";
import UserTripScreen from "./UserTripScreen";
import DriverTripScreen from "./DriverTripScreen";

/**
 * Renders the trip screen appropriate for the current authenticated role.
 *
 * If the authenticated role is exactly `"user"`, this returns `<UserTripScreen />`; for any other role it returns `<DriverTripScreen />`.
 *
 * @returns The JSX element for the corresponding trip screen.
 */
export default function TripScreen() {
  const { role } = useAuth();
  return role === "user" ? <UserTripScreen /> : <DriverTripScreen />;
}
