import { useAuth } from "../../../context/AuthContext";
import DriverOrderScreen from "./driver/DriverOrderScreen";
import UserOrderScreen from "./user/UserOrderScreen";

export default function OrderScreen() {
  const { role } = useAuth();
  return role === "user" ? <UserOrderScreen /> : <DriverOrderScreen />;
}
