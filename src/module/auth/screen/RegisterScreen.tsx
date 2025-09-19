import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

/**
 * Register screen component displaying a centered placeholder UI with a top-left back button.
 *
 * Renders a full-screen view with a "RegisterScreen" label and an absolute-positioned back
 * button (Ionicons arrow). Pressing the back button calls navigation.goBack() to return to the
 * previous screen.
 *
 * @returns The Register screen React component.
 */
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
