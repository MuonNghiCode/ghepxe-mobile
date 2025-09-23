import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
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

    setTimeout(() => {
      runOnJS(goToWelcome)();
    }, 3800);
  }, []);

  return (
    <View style={tw`flex-1 relative`}>
      {/* 5 Thanh dọc tạo background - cùng màu */}
      <View style={tw`absolute inset-0 flex-row`}>
        {barAnimations.map((_, index) => (
          <Animated.View
            key={index}
            style={[
              {
                width: screenWidth / 5,
                height: screenHeight,
                backgroundColor: "#00A982", // Cùng màu
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

      {/* Logo và Text */}
      <View style={tw`flex-1 items-center justify-center z-10`}>
        <Animated.View style={[tw`items-center`, logoAnimatedStyle]}>
          {/* Logo Container với shadow */}
          <View style={tw`mb-6`}>
            <View
              style={[
                tw`w-24 h-24 bg-white rounded-3xl items-center justify-center`,
                {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 15,
                },
              ]}
            >
              <Text style={tw`text-[#00A982] text-4xl font-bold`}>G</Text>
            </View>
          </View>

          {/* App Name với shadow */}
          <Text
            style={[
              tw`text-white text-5xl font-bold mb-3`,
              {
                fontFamily: "RobotoSerifBold",
                textShadowColor: "rgba(0,0,0,0.3)",
                textShadowOffset: { width: 0, height: 2 },
                textShadowRadius: 4,
              },
            ]}
          >
            Ghepxe
          </Text>

          {/* Tagline */}
          <Text
            style={[
              tw`text-white/90 text-lg text-center px-8`,
              {
                textShadowColor: "rgba(0,0,0,0.2)",
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
              },
            ]}
          >
            Kết nối - Chia sẻ - Tiết kiệm
          </Text>

          {/* Loading dots với animation đẹp hơn */}
          <View style={tw`flex-row mt-10`}>
            {[0, 1, 2].map((_, index) => (
              <Animated.View
                key={index}
                style={[
                  tw`w-3 h-3 bg-white rounded-full mx-2`,
                  {
                    shadowColor: "#fff",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: 4,
                  },
                  useAnimatedStyle(() => ({
                    transform: [
                      {
                        scale: withDelay(
                          index * 300,
                          withSequence(
                            withTiming(1.3, { duration: 400 }),
                            withTiming(1, { duration: 400 })
                          )
                        ),
                      },
                    ],
                    opacity: withDelay(
                      index * 300,
                      withSequence(
                        withTiming(1, { duration: 400 }),
                        withTiming(0.6, { duration: 400 })
                      )
                    ),
                  })),
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    </View>
  );
}
