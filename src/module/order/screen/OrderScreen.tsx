import { useAuth } from "../../../context/AuthContext";
import DriverOrderScreen from "./DriverOrderScreen";
import UserOrderScreen from "./UserOrderScreen";

/**
 * Renders the appropriate order screen based on the current user's role.
 *
 * Reads `role` from the authentication context and returns <UserOrderScreen /> when
 * `role === "user"`. For any other role (including "driver" or unknown values) it
 * returns <DriverOrderScreen />.
 *
 * @returns The JSX element for the selected order screen.
 */
export default function OrderScreen() {
  const { role } = useAuth();
  return role === "user" ? <UserOrderScreen /> : <DriverOrderScreen />;
}
