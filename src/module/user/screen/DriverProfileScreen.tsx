import { Text, View, Button } from "react-native";
import tw from "twrnc";
import { useAuth } from "../../../context/AuthContext";

export default function DriverProfileScreen() {
  const { logout } = useAuth();

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Thêm các thành phần UI theo ảnh driver */}
      <Text style={tw`text-xl font-bold m-4`}>Xin chào, tài xế!</Text>
      {/* ...Các thành phần khác... */}
      <Button title="Đăng xuất" onPress={logout} />
    </View>
  );
}
