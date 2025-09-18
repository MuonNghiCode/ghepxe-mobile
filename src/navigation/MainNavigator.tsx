import { useContext } from "react";
import { DriverTabNavigator } from "./DriverTabNavigator";
import { UserTabNavigator } from "./UserTabNavigator";
import { AuthContext } from "../context/AuthContext";

export default function MainNavigator() {
  const { role } = useContext(AuthContext);

  return role === "driver" ? <DriverTabNavigator /> : <UserTabNavigator />;
}
