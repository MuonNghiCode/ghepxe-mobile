import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

export default function RegisterScreen() {
  const navigation = useNavigation();
  return (
    <View style={tw`flex-1 items-center justify-center`}>
      <TouchableOpacity
        style={tw`absolute top-10 left-5 p-2`}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={22} color="#00A982" />
      </TouchableOpacity>
      <Text>RegisterScreen</Text>
    </View>
  );
}
