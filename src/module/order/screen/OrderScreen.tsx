import { useAuth } from "../../../context/AuthContext";
import DriverOrderScreen from "./DriverOrderScreen";
import UserOrderScreen from "./UserOrderScreen";

export default function OrderScreen() {
  const { role } = useAuth();
  if (role === "user") return <UserOrderScreen />;
  if (role === "driver") return <DriverOrderScreen />;
  return null;
}
