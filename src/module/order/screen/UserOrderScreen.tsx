import { Text, View } from "react-native";
import tw from "twrnc";

/**
 * Full-screen screen component that displays centered "UserOrderScreen" text.
 *
 * Renders a View that fills the screen, centers its content, and uses a red background (`bg-red-500`).
 *
 * @returns The rendered JSX element for the user order screen.
 */
export default function UserOrderScreen() {
  return (
    <View style={tw`flex-1 items-center justify-center bg-red-500`}>
      <Text>UserOrderScreen</Text>
    </View>
  );
}
