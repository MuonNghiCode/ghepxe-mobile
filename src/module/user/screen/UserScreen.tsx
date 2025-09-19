import { useAuth } from "../../../context/AuthContext";
import DriverProfileScreen from "./DriverProfileScreen";
import UserProfileScreen from "./UserProfileScreen";

/**
 * Root screen selector that renders a profile screen based on the current auth role.
 *
 * Renders UserProfileScreen when the authenticated user's `role` is exactly `"user"`;
 * for any other value (including undefined) it renders DriverProfileScreen.
 *
 * Relies on `useAuth()` for the current role.
 */
export default function UserScreen() {
  const { role } = useAuth();
  return role === "user" ? <UserProfileScreen /> : <DriverProfileScreen />;
}
