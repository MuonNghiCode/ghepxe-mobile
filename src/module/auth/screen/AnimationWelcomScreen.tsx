import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View, Dimensions, Image } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated";
import tw from "twrnc";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function AnimationWelcomeScreen() {
  const navigation = useNavigation();
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.5);
  const logoTranslateY = useSharedValue(50);
  const barAnimations = Array.from({ length: 5 }, () => ({
    translateY: useSharedValue(0),
    opacity: useSharedValue(1),
  }));

  const goToWelcome = () => {
    navigation.navigate("Welcome" as never);
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value },
      { translateY: logoTranslateY.value },
    ],
  }));

  const barStyles = barAnimations.map((bar) =>
    useAnimatedStyle(() => ({
      transform: [{ translateY: bar.translateY.value }],
      opacity: bar.opacity.value,
    }))
  );

  useEffect(() => {
    logoOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.back(1.5)),
    });
    logoTranslateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.quad),
    });

    setTimeout(() => {
      logoScale.value = withSequence(
        withTiming(1.1, { duration: 300 }),
        withTiming(1, { duration: 300 })
      );
    }, 1500);

    setTimeout(() => {
      logoTranslateY.value = withTiming(-screenHeight, {
        duration: 1200,
        easing: Easing.in(Easing.quad),
      });

      barAnimations.forEach((bar, index) => {
        bar.translateY.value = withDelay(
          index * 50,
          withTiming(-screenHeight, {
            duration: 1200,
            easing: Easing.in(Easing.quad),
          })
        );
      });
    }, 2500);

    // Phase 4: Navigate to Welcome (3.8s)
    setTimeout(() => {
      runOnJS(goToWelcome)();
    }, 3800);
  }, []);

  return (
    <View style={tw`flex-1 relative`}>
      {/* 5 Thanh dọc tạo background */}
      <View style={tw`absolute inset-0 flex-row`}>
        {barAnimations.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              {
                width: screenWidth / 5,
                height: screenHeight,
                backgroundColor: "#00A982",
              },
              barStyles[index],
            ]}
          >
            {/* Highlight effect nhẹ */}
            <View
              style={[
                tw`absolute top-0 w-full h-40`,
                {
                  backgroundColor: "rgba(255,255,255,0.05)",
                  transform: [{ translateY: index * 30 }],
                },
              ]}
            />
          </Animated.View>
        ))}
      </View>

      {/* Logo Container */}
      <View style={tw`flex-1 items-center justify-center z-10`}>
        <Animated.View style={[tw`items-center`, logoAnimatedStyle]}>
          <Image
            source={require("../../../assets/pictures/logo-white.png")}
            style={tw`w-60 h-60`}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </View>
  );
}
