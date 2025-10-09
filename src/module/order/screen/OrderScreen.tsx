import { useAuth } from "../../../context/AuthContext";
import DriverOrderScreen from "./DriverOrderScreen";
import UserOrderScreen from "./User/UserOrderScreen";

export default function OrderScreen() {
  const { role } = useAuth();
  return role === "user" ? <UserOrderScreen /> : <DriverOrderScreen />;
}
