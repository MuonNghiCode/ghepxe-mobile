import { useState } from "react";
import { Text, View, TextInput, Button, Alert } from "react-native";
import tw from "twrnc";
import { useAuth } from "../../../context/AuthContext";

type Role = "user" | "driver";
interface FakeUser {
  username: string;
  password: string;
  role: Role;
}

const fakeUsers: FakeUser[] = [
  { username: "user1", password: "123456", role: "user" },
  { username: "driver1", password: "abcdef", role: "driver" },
];

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = () => {
    const found = fakeUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      login(found.role);
    } else {
      Alert.alert("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <View style={tw`flex-1 items-center justify-center bg-white px-8`}>
      <Text style={tw`text-xl font-bold mb-6`}>Đăng nhập</Text>
      <TextInput
        style={tw`border rounded px-4 py-2 w-full mb-4`}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={tw`border rounded px-4 py-2 w-full mb-6`}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Đăng nhập" onPress={handleLogin} />
    </View>
  );
}
