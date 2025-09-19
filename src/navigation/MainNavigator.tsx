import { useAuth } from "../context/AuthContext";
import { UserTabNavigator } from "./UserTabNavigator";
import { DriverTabNavigator } from "./DriverTabNavigator";

/**
 * Chooses and renders the appropriate tab navigator based on the current user's role.
 *
 * Renders <UserTabNavigator /> when the authenticated role is exactly `"user"`. For any other role (including undefined), renders <DriverTabNavigator /> as the fallback.
 *
 * @returns The selected navigator component for the current role.
 */
export default function MainNavigator() {
  const { role } = useAuth();

  return role === "user" ? <UserTabNavigator /> : <DriverTabNavigator />;
}
