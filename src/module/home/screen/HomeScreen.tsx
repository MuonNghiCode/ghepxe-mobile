import { useAuth } from "../../../context/AuthContext";
import DriverHomeScreen from "./DriverHomeScreex";
import UserHomeScreen from "./UserHomeScreen";

/**
 * Selects and renders the appropriate home screen based on the authenticated user's role.
 *
 * Reads `role` from the auth context (via `useAuth`) and renders `UserHomeScreen` when
 * the role is exactly `"user"`. For any other role value, `DriverHomeScreen` is rendered.
 *
 * @returns The JSX element for the matched home screen component.
 */
export default function HomeScreen() {
  const { role } = useAuth();
  return role === "user" ? <UserHomeScreen /> : <DriverHomeScreen />;
}
