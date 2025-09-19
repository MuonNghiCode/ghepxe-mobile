import { useAuth } from "../../../context/AuthContext";
import DriverOrderScreen from "./DriverOrderScreen";
import UserOrderScreen from "./UserOrderScreen";

export default function OrderScreen() {
  const { role } = useAuth();
  return role === "user" ? <UserOrderScreen /> : <DriverOrderScreen />;
}
