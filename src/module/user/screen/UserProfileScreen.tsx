import { Text, View, Button } from "react-native";
import tw from "twrnc";
import { useAuth } from "../../../context/AuthContext";

export default function UserProfileScreen() {
  const { logout } = useAuth();

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Thêm các thành phần UI theo ảnh user */}
      <Text style={tw`text-xl font-bold m-4`}>Xin chào, người dùng!</Text>
      {/* ...Các thành phần khác... */}
      <Button title="Đăng xuất" onPress={logout} />
    </View>
  );
}
